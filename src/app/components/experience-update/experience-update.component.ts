import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Experience } from 'src/app/models/experience.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-experience-update',
  templateUrl: './experience-update.component.html',
  styleUrls: ['./experience-update.component.css']
})

export class ExperienceUpdateComponent implements OnInit {
  @Output() onUpdateExperience: EventEmitter<Experience> = new EventEmitter();
  @Input() showUpdateExperience: Boolean = false;
  @Output() closeUpdateExperience = new EventEmitter();

  @Input() experience: Experience;

  image: any;
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  subscription?: Subscription;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService) { 
    this.experience = {id: "", title: "", companyName: "", startDate: null, endDate: null, workTime: "", location: "", urlImage: "", personId: ""};
    this.urlImage = this.experience.urlImage;
  }

  ngOnInit(): void {
  }

  // Envia la experiencia actualizada a la clase padre
  async save(){
    if (this.experience.title.length === 0 || this.experience.companyName.length === 0 || 
      this.experience.startDate === null || this.experience.location.length === 0 ) {
      return;
    }
    if(this.experience.person){
      this.experience.personId = this.experience.person.id;
    }

    if(this.image){
      if (this.experience.urlImage) {
        await this.deleteImage(this.experience.urlImage);
      };
      await this.saveImage();
      this.image = null;
    }
    
    this.onUpdateExperience.emit(this.experience)
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
    this.experience.endDate = null;
  }

  // Cerrar formulario
  close() {
    this.showUpdateExperience = false;
    this.closeUpdateExperience.emit(this.showUpdateExperience);
  }

}
