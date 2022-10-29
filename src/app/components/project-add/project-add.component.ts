import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProjectPayload } from 'src/app/models/projectPayload.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { dateInPastValidator } from 'src/app/validators/date-in-past.directive';
import { dateLessThenDateValidator } from 'src/app/validators/date-less-then-date.directive';


@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css', '../../app.component.css']
})
export class ProjectAddComponent implements OnInit {

  @Output() onAddProject: EventEmitter<ProjectPayload> = new EventEmitter();
  @Input() showAddProject: Boolean = false;
  @Output() closeAddProject = new EventEmitter();

  project: ProjectPayload =  {
    name: "", 
    description: "",
    startDate: new Date(), 
    endDate: null,
    link: "",  
    urlImage: null, 
    personId: ""
  }

  image: any;
  form: FormGroup = new FormGroup({});
  disabledEndDate: Boolean = false;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]), 
      description: new FormControl('', [Validators.required]), 
      link: new FormControl('', [Validators.required]),
      startDate: new FormControl(null, [Validators.required, dateInPastValidator()]),
      endDate: new FormControl(null, [dateInPastValidator()]),
    }, { validators: dateLessThenDateValidator });
  }

  // Envia la nueva experiencia a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.project.name = this.form.value.name;
      this.project.description =  this.form.value.description;
      this.project.link = this.form.value.link;
      this.project.personId = this.authenticationService.personId;
      this.project.startDate = new Date(this.form.value.startDate.toString() + "-01T00:00:00.000-03:00")
  
      if(this.image){
        await this.saveImage();
      }
  
      if (this.form.value.endDate != null) {
        this.project.endDate = new Date(this.form.value.endDate.toString() + "-01T00:00:00.000-03:00")
      }
  
      this.onAddProject.emit(this.project)
      this.cleanVars();
    }
  }

  // Guarda una imagen subida por un usuario
  uploadImage(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () => {
      this.image = reader.result
    }
  }

  // Guardar imagen en Firebase
  async saveImage() {
    await this.storageService.uploadImage("persons/" + this.project.personId + "/projects/" + (new Date()).toString() , this.image)
    .then(urlImage =>{
      this.project.urlImage =  urlImage;
   })
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    if (this.disabledEndDate) {
      this.project.endDate = null;
    }
  }

  // Cerrar formulario
  close() {
    this.cleanVars();
    this.closeAddProject.emit(this.showAddProject);
  }

  // Limpiar las variables
  cleanVars() {
    this.project.name = "";
    this.project.description = "";
    this.project.link = "";
    this.project.startDate = null; 
    this.project.endDate = null;
    this.project.urlImage = null; 

    this.form.reset();

    this.showAddProject = false;
    this.disabledEndDate = false;
    this.image = null;
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
