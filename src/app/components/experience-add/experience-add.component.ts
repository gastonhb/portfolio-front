import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ExperiencePayload } from 'src/app/models/experiencePayload.interface';
import { WorkTimeType } from 'src/app/models/workTimeType.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { WorkTimeTypeService } from 'src/app/services/workTimeType.service';
import { dateInPastValidator } from 'src/app/validators/date-in-past.directive';
import { dateLessThenDateValidator } from 'src/app/validators/date-less-then-date.directive';

@Component({
  selector: 'app-experience-add',
  templateUrl: './experience-add.component.html',
  styleUrls: ['./experience-add.component.css', '../../app.component.css']
})

export class ExperienceAddComponent implements OnInit {
  
  @Output() onAddExperience: EventEmitter<ExperiencePayload> = new EventEmitter();
  @Input() showAddExperience: Boolean = false;
  @Output() closeAddExperience = new EventEmitter();

  experience: ExperiencePayload =  {
    title: "", 
    companyName: "", 
    startDate: null, 
    endDate: null,  
    location: "", 
    urlImage: null, 
    personId: "", 
    workTimeTypeId: ""
  }

  image: any;
  form: FormGroup = new FormGroup({});
  disabledEndDate: Boolean = false;
  workTimeTypes: WorkTimeType[] = [];
  selectedWorkTimeType: WorkTimeType = { id: "", name: "" };

  faPlus = faPlus;
  faImage = faImage;
  faTimes = faTimes;

  constructor(private workTimeTypeService: WorkTimeTypeService, 
    private storageService: StorageService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.workTimeTypeService.list().subscribe(workTimeTypes => {
      this.workTimeTypes = workTimeTypes;
      this.selectedWorkTimeType = workTimeTypes.find(type => type.name === "Jornada Completa") || workTimeTypes[0];

      this.form = new FormGroup({
        title: new FormControl('', [Validators.required]), 
        companyName: new FormControl('', [Validators.required]), 
        workTimeType: new FormControl(this.selectedWorkTimeType, [Validators.required]),
        startDate: new FormControl(null, [Validators.required, dateInPastValidator()]),
        endDate: new FormControl(null, [dateInPastValidator()]),
        location: new FormControl(null, []),
      }, { validators: dateLessThenDateValidator });
    });
  }

  // Envia la nueva experiencia a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.experience.title = this.form.value.title;
      this.experience.companyName =  this.form.value.companyName;
      this.experience.location = this.form.value.location;
      this.experience.personId = this.authenticationService.personId;
      this.experience.workTimeTypeId =  this.form.value.workTimeType.id;
      this.experience.startDate = new Date(this.form.value.startDate.toString() + "-01T00:00:00.000-03:00")
  
      if(this.image){
        await this.saveImage();
      }
  
      if (this.form.value.endDate != null) {
        this.experience.endDate = new Date(this.form.value.endDate.toString() + "-01T00:00:00.000-03:00")
      }
  
      this.onAddExperience.emit(this.experience)
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
    await this.storageService.uploadImage("persons/" + this.experience.personId + "/workExperiences/" + (new Date()).toString() , this.image)
    .then(urlImage =>{
      this.experience.urlImage = urlImage;
   })
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    if (this.disabledEndDate) {
      this.experience.endDate = null;
    }
  }

  // Cerrar formulario
  close() {
    this.cleanVars();
    this.closeAddExperience.emit(this.showAddExperience);
  }

  // Comparar nombres de tipos de jornadas
  compareNames(work1: WorkTimeType, work2: WorkTimeType) {
    return work1.name === work2.name;
  }

  // Limpiar las variables
  cleanVars() {
    this.experience.title = "";
    this.experience.companyName = "";
    this.experience.startDate = null; 
    this.experience.endDate = null;
    this.experience.location = "";
    this.experience.urlImage = null; 
    this.experience.workTimeTypeId = "";

    this.form.reset();

    this.form.patchValue({
      workTimeType: this.selectedWorkTimeType,
    });

    this.showAddExperience = false;
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
  
    if ( this.form.errors?.['dateLessThenDate']) {
      this.form.controls['endDate'].markAsTouched();
      this.form.controls['endDate'].setErrors({...errorsEndDate,'dateLessThenDate': true});
    } else {
      this.form.controls['endDate'].setErrors(errorsEndDate);
    }
  }

  get title() { return this.form.get('title'); }

  get companyName() { return this.form.get('companyName'); }

  get workTimeType() { return this.form.get('workTimeType'); }

  get startDate() { return this.form.get('startDate'); }

  get endDate() { return this.form.get('endDate'); }

  get location() { return this.form.get('location'); }

}
