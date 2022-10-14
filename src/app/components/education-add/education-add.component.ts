import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Education } from 'src/app/models/education.interface';
import { EducationPayload } from 'src/app/models/educationPayload.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { dateLessThenDateValidator } from 'src/app/validators/date-less-then-date.directive';

@Component({
  selector: 'app-education-add',
  templateUrl: './education-add.component.html',
  styleUrls: ['./education-add.component.css', '../../app.component.css']
})
export class EducationAddComponent implements OnInit {

  @Output() onAddEducation: EventEmitter<EducationPayload> = new EventEmitter();
  @Input() showAddEducation: Boolean = false;
  @Output() closeAddEducation = new EventEmitter();

  education: EducationPayload =  {
    title: "", 
    institute: "",
    startDate: new Date().getFullYear(), 
    endDate: null,  
    urlImage: null, 
    personId: "", 
  }

  image: any;
  form: FormGroup = new FormGroup({});
  disabledEndDate: boolean = false;
  years: number[] = [];

  faPlus = faPlus;
  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService,
    private authenticationService: AuthenticationService) { 
  }

  ngOnInit(): void {
    for (let i = new Date().getFullYear(); i > 1900; i--) {
      this.years.push(i);
    }

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]), 
      institute: new FormControl('', [Validators.required]),
      startDate: new FormControl('Año', [Validators.required]),
      endDate: new FormControl('Año', [])
    }, { validators: dateLessThenDateValidator });
  }

  // Envia la nueva experiencia a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.education.title = this.form.value.title;
      this.education.institute =  this.form.value.institute;
      this.education.personId = this.authenticationService.personId;
      this.education.startDate = this.form.value.startDate;
      this.education.endDate = this.form.value.endDate
  
      if(this.image){
        await this.saveImage();
      }
  
      this.onAddEducation.emit(this.education)
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
    await this.storageService.uploadImage("persons/" + this.education.personId + "/educations/" + (new Date()).toString() , this.image)
    .then(urlImage =>{
      this.education.urlImage =  urlImage;
   })
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    this.education.endDate = null;
    this.form.patchValue({
      endDate: 'Año',
    });
  }

  // Cerrar formulario
  close() {
    this.cleanVars();
    this.closeAddEducation.emit(this.showAddEducation);
  }

  // Limpiar las variables
  cleanVars() {
    this.education.title = "";
    this.education.institute = "";
    this.education.startDate = 0; 
    this.education.endDate = null;
    this.education.urlImage = null; 

    this.form.reset();
    this.form.patchValue({
      startDate: 'Año',
      endDate: 'Año'
    });

    this.showAddEducation = false;
    this.disabledEndDate = false;
    this.image = null;
  }

  get title() { return this.form.get('title'); }

  get institute() { return this.form.get('institute'); }

  get startDate() { return this.form.get('startDate'); }

  get endDate() { return this.form.get('endDate'); }

}
