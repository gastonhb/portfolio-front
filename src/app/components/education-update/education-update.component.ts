import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Education } from 'src/app/models/education.interface';
import { StorageService } from 'src/app/services/storage.service';
import { dateLessThenDateValidator } from 'src/app/validators/date-less-then-date.directive';

@Component({
  selector: 'app-education-update',
  templateUrl: './education-update.component.html',
  styleUrls: ['./education-update.component.css', '../../app.component.css']
})
export class EducationUpdateComponent implements OnInit {

  @Output() onUpdateEducation: EventEmitter<Education> = new EventEmitter();
  @Input() showUpdateEducation: Boolean = false;
  @Output() closeUpdateEducation = new EventEmitter();

  @Input() education: Education = { 
    id: "", 
    title: "", 
    institute: "", 
    startDate: 0, 
    endDate: null, 
    urlImage: "", 
    personId: "" 
  };

  image: any;
  form: FormGroup = new FormGroup({});
  disabledEndDate: boolean = false;
  years: number[] = [];
  urlImage: string | null = null;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.urlImage = this.education.urlImage;
    this.disabledEndDate = this.education.endDate ? false : true;

    for (let i = new Date().getFullYear(); i > 1900; i--) {
      this.years.push(i);
    }

    this.form = new FormGroup({
      title: new FormControl(this.education.title, [Validators.required]), 
      institute: new FormControl(this.education.institute, [Validators.required]),
      startDate: new FormControl(this.education.startDate, 
        [Validators.required, Validators.pattern("^[0-9]*$")]),
      endDate: new FormControl(this.education.endDate, [Validators.pattern("^[0-9]*$")])
    }, { validators: dateLessThenDateValidator });
  }

  // Envia la educacion actualizada a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.education.title = this.form.value.title;
      this.education.institute =  this.form.value.institute;
      this.education.personId = this.education.personId;
      this.education.startDate = this.form.value.startDate;
      this.education.endDate = this.form.value.endDate
  
      if(this.image){
        if (this.education.urlImage) {
          await this.deleteImage(this.education.urlImage);
        };
        await this.saveImage();
        this.image = null;
      }
  
      this.onUpdateEducation.emit(this.education)
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
    await this.storageService.uploadImage("persons/" + this.education.personId + "/educations/" + this.education.id, this.image)
    .then(urlImagen =>{
      this.education.urlImage =  urlImagen;
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
      this.form.controls['endDate'].markAsUntouched()
    } else {
      this.form.patchValue({
        endDate: new Date().getFullYear(),
      });
      this.form.controls['endDate'].markAsTouched()
    }
    
  }

  // Cerrar formulario
  close() {
    this.showUpdateEducation = false;
    this.closeUpdateEducation.emit(this.showUpdateEducation);
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

  get title() { return this.form.get('title'); }

  get institute() { return this.form.get('institute'); }

  get startDate() { return this.form.get('startDate'); }

  get endDate() { return this.form.get('endDate'); }

}
