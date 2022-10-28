import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { faPlus, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ExperienceService } from 'src/app/services/experience.service';
import { Experience } from 'src/app/models/experience.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExperiencePayload } from 'src/app/models/experiencePayload.interface';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})

export class ExperienceComponent implements OnInit {

  @Input() personId: string = "";

  showAddExperience: Boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;
  hasError: Boolean = false;
  errorMessage: String = '';

  experiences: Experience [] = [];

  faPlus = faPlus;
  faPen = faPen;
  faTimes = faTimes;

  constructor(private experienceService: ExperienceService, private authenticationService: AuthenticationService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value;
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    this.personId = changes['personId'].currentValue;
    if (this.personId != '') {
      this.experienceService.list(this.personId).subscribe(experiences => {
        this.experiences = experiences;
      })
    }
  }

  // Mostrar o ocultar add experience
  toggleAddExperience(){
    this.showAddExperience = !this.showAddExperience;
  }

  // Borrar experiencia
  onDelete(experience: Experience){
    this.experienceService.delete(experience)
      .subscribe(() =>{
        this.experiences = this.experiences.filter(exp => exp.id !== experience.id);
      });
  }

  // Agrega experiencia
  onAddExperience(experience: ExperiencePayload){
    this.showAddExperience = false;
    this.experienceService.create(experience)
    .subscribe({
      next: (experience) =>{
        this.experiences.push(experience);
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = "Revise la información enviada"
      }
    });
  }

  // Actualizar experiencia
  updateExperience(experience: Experience){
    const index = this.experiences.findIndex(exp => exp.id === experience.id);
    this.experiences[index] = experience;
  }

  // Cerrar add experience
  closeAddExperience(showAddExperience: boolean){
    this.showAddExperience = showAddExperience;
  }

  // Cerrar modal de error
  closeErrorModal(){
    this.hasError = !this.hasError;
  }

}
