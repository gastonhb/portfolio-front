import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project.interface';
import { StorageService } from 'src/app/services/storage.service';
import { dateInPastValidator } from 'src/app/validators/date-in-past.directive';
import { dateLessThenDateValidator } from 'src/app/validators/date-less-then-date.directive';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html',
  styleUrls: ['./project-update.component.css', '../../app.component.css']
})
export class ProjectUpdateComponent implements OnInit {

  @Output() onUpdateProject: EventEmitter<Project> = new EventEmitter();
  @Input() showUpdateProject: Boolean = false;
  @Output() closeUpdateProject = new EventEmitter();

  @Input() project: Project = {
    id: "", 
    name: "", 
    description: "", 
    startDate: new Date(), 
    endDate: null, 
    link: "", 
    urlImage: "", 
    personId: ""
  };

  image: any;
  form: FormGroup = new FormGroup({});
  urlImage: string | null = null;
  disabledEndDate: boolean = false;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService) {  }

  ngOnInit(): void {
    this.urlImage = this.project.urlImage;
    this.disabledEndDate = this.project.endDate ? false : true;

    this.form = new FormGroup({
      name: new FormControl(this.project.name, [Validators.required]), 
      description: new FormControl(this.project.description, [Validators.required]), 
      link: new FormControl(this.project.link, [Validators.required]),
      startDate: new FormControl(this.project.startDate.toString().slice(0,7), 
        [Validators.required, dateInPastValidator()]),
      endDate: this.project.endDate ? new FormControl(this.project.endDate.toString().slice(0,7),
        [dateInPastValidator()]) : 
        new FormControl(null, [Validators.required, dateInPastValidator()]),
    }, { validators: dateLessThenDateValidator });
  }

  // Envia la experiencia actualizada a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.project.name = this.form.value.name;
      this.project.description =  this.form.value.description;
      this.project.link = this.form.value.link;
      this.project.startDate = new Date(this.form.value.startDate.toString() + "-01")
      
      if(this.image){
        if (this.project.urlImage) {
          await this.deleteImage(this.project.urlImage);
        };
        await this.saveImage();
        this.image = null;
      }

      if (this.form.value.endDate != null) {
        this.project.endDate = new Date(this.form.value.endDate.toString() + "-01")
      }
      
      this.onUpdateProject.emit(this.project)
    }
  }

  // Guarda una imagen subida por un usuario
  uploadImage(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () => {
      this.image = reader.result;
    }
  }

  // Guardar imagen en Firebase
  async saveImage() {
    await this.storageService.uploadImage("persons/" + this.project.personId + "/projects/" + this.project.id, this.image)
    .then(urlImagen =>{
      this.project.urlImage =  urlImagen;
   })
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    if (this.disabledEndDate) {
      this.form.patchValue({
        endDate: null,
      });
    } else {
      this.form.patchValue({
        endDate: new Date().toISOString().slice(0,7),
      });
    }
  }

  // Cerrar formulario
  close() {
    this.showUpdateProject = false;
    this.closeUpdateProject.emit(this.showUpdateProject);
  }

  // Agregar error cuando la fecha de fin sea menor a la fecha de inicio
  endDateIfFormIsDirty(){
    let errorsEndDate = this.form.controls['endDate'].errors
    if (errorsEndDate != null && errorsEndDate['dateLessThenDate']) {
      delete errorsEndDate['dateLessThenDate']
      if (Object.keys(errorsEndDate).length === 0) {
        errorsEndDate = null
      }
    }
  
    this.form.errors?.['dateLessThenDate'] ? 
      this.form.controls['endDate'].setErrors({...errorsEndDate,'dateLessThenDate': true}) : 
      this.form.controls['endDate'].setErrors(errorsEndDate);
  }

  get name() { return this.form.get('name'); }

  get description() { return this.form.get('description'); }

  get link() { return this.form.get('link'); }

  get startDate() { return this.form.get('startDate'); }

  get endDate() { return this.form.get('endDate'); }

}
