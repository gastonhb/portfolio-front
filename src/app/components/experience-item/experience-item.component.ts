import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTrashCan, faPen, faImage } from '@fortawesome/free-solid-svg-icons';
import { Experience } from "../../models/experience.interface";
import { StorageService } from 'src/app/services/storage.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { ExperiencePayload } from 'src/app/models/experiencePayload.interface';
import { ExperienceService } from 'src/app/services/experience.service';

@Component({
  selector: 'app-experience-item',
  templateUrl: './experience-item.component.html',
  styleUrls: ['./experience-item.component.css', '../../app.component.css']
})
export class ExperienceItemComponent implements OnInit {
  
  @Input() experience: Experience = { 
    id:"", 
    title:"", 
    companyName:"", 
    startDate: new Date(), 
    endDate: null, 
    location:"", 
    urlImage:"", 
    personId:"", 
    workTimeTypeId:"", 
    workTimeType: { 
      id: "", 
      name: ""
    }
  };

  @Output() onDeleteExperience: EventEmitter<Experience> = new EventEmitter();
  @Output() updateExperience: EventEmitter<Experience> = new EventEmitter();

  showUpdateExperience: boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;
  hasError: Boolean = false;
  errorMessage: String = '';

  faTrashCan = faTrashCan;
  faPen = faPen;
  faImage = faImage;

  constructor(private storageService: StorageService, 
    private authenticationService: AuthenticationService,
    private experienceService: ExperienceService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value
    });
  }

  ngOnInit(): void { }

  // Borrar experiencia
  async onDelete(experience: Experience){
    if (experience.urlImage != null) {
      await this.deleteImage(experience.urlImage);
    }
    this.onDeleteExperience.emit(experience);
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Actualizar experiencia
  onUpdateExperience(experiencePayload: ExperiencePayload){
    this.experienceService.update(this.experience.id, experiencePayload)
    .subscribe({
      next: (experience) =>{
        this.experience = experience;
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = "Revise la información enviada"
      }
    });
    this.toggleUpdateExperience();
    this.updateExperience.emit(this.experience);
  }

  // Mostrar experiencia
  toggleUpdateExperience(){
    this.showUpdateExperience = !this.showUpdateExperience;
  }

  // Cerrar update de experiencia
  closeUpdateExperience(showUpdateExperience: boolean){
    this.showUpdateExperience = showUpdateExperience;
  }

  // Cerrar modal de error
  closeErrorModal(){
    this.hasError = !this.hasError;
  }

}
