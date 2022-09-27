import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ExperiencePayload } from 'src/app/models/experiencePayload.interface';
import { WorkTimeType } from 'src/app/models/workTimeType.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { WorkTimeTypeService } from 'src/app/services/workTimeType.service';

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
    startDate: new Date(), 
    endDate: null,  
    location: "", 
    urlImage: null, 
    personId: "", 
    workTimeTypeId: ""
  }

  image: any;
  disabledEndDate: boolean = false;
  workTimeTypes: WorkTimeType[] = [];
  workTimeType: WorkTimeType = { id: "", name: "" };

  faPlus = faPlus;
  faImage = faImage;
  faTimes = faTimes;

  constructor(private workTimeTypeService: WorkTimeTypeService, private storageService: StorageService,
    private authenticationService: AuthenticationService) { 
      //TODO ver personId
    this.experience.personId = this.authenticationService.personId;
  }

  ngOnInit(): void {
    this.workTimeTypeService.list().subscribe(workTimeTypes => {
      this.workTimeTypes = workTimeTypes;
      this.workTimeType = workTimeTypes.find(type => type.name === "Jornada Completa") || workTimeTypes[0];
    });
  }

  // Envia la nueva experiencia a la clase padre
  async save(){
    if (this.experience.title.length === 0 || this.experience.companyName.length === 0 || 
      this.experience.startDate === null || this.experience.location.length === 0 ) {
      return;
    }

    this.experience.workTimeTypeId = this.workTimeType.id;

    if(this.image){
      await this.saveImage();
      this.image = null;
    }

    this.onAddExperience.emit(this.experience)
    this.cleanVars();
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
      this.experience.urlImage =  urlImage;
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
    this.experience = {
      title: "", 
      companyName: "", 
      startDate: null, 
      endDate: null,  
      location: "", 
      urlImage: null, 
      personId: "", 
      workTimeTypeId: ""
    };
    this.showAddExperience = false;
  }

}
