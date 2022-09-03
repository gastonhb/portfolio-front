import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Experience } from 'src/app/models/experience.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-experience-add',
  templateUrl: './experience-add.component.html',
  styleUrls: ['./experience-add.component.css']
})

export class ExperienceAddComponent implements OnInit {
  
  @Output() onAddExperience: EventEmitter<Experience> = new EventEmitter();
  @Input() showAddExperience: Boolean = false;
  @Output() closeAddExperience = new EventEmitter();

  title: string = "";
  companyName: string = "";
  workTime: string = "Jornada Completa";
  startDate: Date | null = null;
  endDate: Date | null = null;
  location: string = "";
  personId: string;
  urlImage: string | null = null;

  image: any;
  disabledEndDate: boolean = false;

  faPlus = faPlus;
  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService,
    private authenticationService: AuthenticationService) { 
    this.personId = this.authenticationService.personId;
  }

  ngOnInit(): void {}

  // Envia la nueva experiencia a la clase padre
  async save(){
    const { title, companyName, workTime, startDate, endDate, location, personId } = this;
    if (title.length === 0 || companyName.length === 0 || 
      startDate === null || location.length === 0 ) {
      return;
    }

    if(this.image){
      await this.saveImage();
      this.image = null;
    }

    const urlImage =  this.urlImage;
    const newExperience = { title, companyName, startDate, endDate, workTime, location, urlImage, personId }
    
    this.title = this.companyName = this.location = "";
    this.startDate =  this.endDate = this.urlImage = null;
    this.workTime = "Jornada Completa";
    this.showAddExperience = false;

    this.onAddExperience.emit(newExperience)
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
    await this.storageService.uploadImage("persons/" + this.personId + "/workExperiences/" + (new Date()).toString() , this.image)
    .then(urlImage =>{
      this.urlImage =  urlImage;
   })
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    this.endDate = null;
  }

  // Cerrar formulario
  close() {
    this.title = this.companyName = this.workTime = this.location = "";
    this.startDate =  this.endDate = this.urlImage = this.image = null;
    this.showAddExperience = false;
    this.closeAddExperience.emit(this.showAddExperience);
  }

}
