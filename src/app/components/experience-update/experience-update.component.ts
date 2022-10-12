import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Experience } from 'src/app/models/experience.interface';
import { WorkTimeType } from 'src/app/models/workTimeType.interface';
import { StorageService } from 'src/app/services/storage.service';
import { WorkTimeTypeService } from 'src/app/services/workTimeType.service';
import { dateInPastValidator } from 'src/app/validators/date-in-past.directive';
import { dateLessThenDateValidator } from 'src/app/validators/date-less-then-date.directive';

@Component({
  selector: 'app-experience-update',
  templateUrl: './experience-update.component.html',
  styleUrls: ['./experience-update.component.css', '../../app.component.css']
})

export class ExperienceUpdateComponent implements OnInit {
  @Output() onUpdateExperience: EventEmitter<Experience> = new EventEmitter();
  @Input() showUpdateExperience: Boolean = false;
  @Output() closeUpdateExperience = new EventEmitter();

  @Input() experience: Experience = {
    id: "", 
    title: "", 
    companyName: "", 
    startDate: new Date(), 
    endDate: null,  
    location: "", 
    urlImage: "", 
    personId: "", 
    workTimeTypeId: "", 
    workTimeType: { 
      id: "",
      name: ""
    }
  };

  image: any;
  form: FormGroup = new FormGroup({});
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  selectedWorkTimeType: WorkTimeType = { 
    id: "",
    name: ""
  }
  workTimeTypes: WorkTimeType[] = [];

  faImage = faImage;
  faTimes = faTimes;

  constructor(private workTimeTypeService: WorkTimeTypeService, 
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.urlImage = this.experience.urlImage;
    this.disabledEndDate = this.experience.endDate ? false : true;
    this.form = new FormGroup({
      title: new FormControl(this.experience.title, [Validators.required]), 
      companyName: new FormControl(this.experience.companyName, [Validators.required]), 
      workTimeType: new FormControl(this.experience.workTimeType, [Validators.required]),
      startDate: new FormControl(this.experience.startDate.toString().slice(0,7), 
        [Validators.required, dateInPastValidator()]),
      endDate: this.experience.endDate ? new FormControl(this.experience.endDate.toString().slice(0,7),
        [Validators.required, dateInPastValidator()]) : 
        new FormControl(null, [Validators.required, dateInPastValidator()]),
      location: new FormControl(this.experience.location, [Validators.required]),
    }, { validators: dateLessThenDateValidator });

    this.workTimeTypeService.list().subscribe(workTimeTypes => {
      this.workTimeTypes = workTimeTypes;
      this.selectedWorkTimeType = this.workTimeTypes.find(type => 
        type.name === this.experience.workTimeType.name) || workTimeTypes[0];
      this.form.controls['workTimeType'].setValue(this.selectedWorkTimeType, { onlySelf: true });
    });
  }

  // Envia la experiencia actualizada a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.experience.title = this.form.value.title;
      this.experience.companyName =  this.form.value.companyName;
      this.experience.location = this.form.value.location;
      this.experience.personId = this.experience.personId;
      this.experience.workTimeTypeId =  this.form.value.workTimeType.id;
      this.experience.startDate = new Date(this.form.value.startDate.toString() + "-01")
      
      if(this.image){
        if (this.experience.urlImage) {
          await this.deleteImage(this.experience.urlImage);
        };
        await this.saveImage();
        this.image = null;
      }

      if (this.form.value.endDate != null) {
        this.experience.endDate = new Date(this.form.value.endDate.toString() + "-01")
      }
      
      this.onUpdateExperience.emit(this.experience)
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
    await this.storageService.uploadImage("persons/" + this.experience.personId + "/workExperiences/" + this.experience.id, this.image)
    .then(urlImagen =>{
      this.experience.urlImage =  urlImagen;
   })
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    this.form.patchValue({
      endDate: null,
    });
  }

  // Cerrar formulario
  close() {
    this.showUpdateExperience = false;
    this.closeUpdateExperience.emit(this.showUpdateExperience);
  }

  // Comparar nombres de tipos de jornadas
  compareNames(work1: WorkTimeType, work2: WorkTimeType) {
    return work1.name === work2.name;
  }

  get title() { return this.form.get('title'); }

  get companyName() { return this.form.get('companyName'); }

  get workTimeType() { return this.form.get('workTimeType'); }

  get startDate() { return this.form.get('startDate'); }

  get endDate() { return this.form.get('endDate'); }

  get location() { return this.form.get('location'); }

}
