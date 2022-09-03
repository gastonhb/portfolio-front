import { Component, OnInit } from '@angular/core';
import { faPlus, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ExperienceService } from 'src/app/services/experience.service';
import { Experience } from 'src/app/models/experience.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})

export class ExperienceComponent implements OnInit {

  showAddExperience: Boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;

  personId: string = "";
  experiences: Experience [] = [];

  faPlus = faPlus;
  faPen = faPen;
  faTimes = faTimes;

  constructor(private experienceService: ExperienceService, private authenticationService: AuthenticationService, private userService: UserService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value
    });

    if (this.hasCurrentUser) {
      this.personId = this.authenticationService.personId;
    } else {
      this.userService.getByUsername("GastonHb").subscribe(user => {
        this.personId = user.person.id;
      });
    }
  }

  ngOnInit(): void {
    this.experienceService.list().subscribe(experiences => {
      this.experiences = experiences;
    })
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
  onAddExperience(experience:Experience){
    this.showAddExperience = false;
    this.experienceService.create(experience)
    .subscribe((experience) =>{
      this.experiences.push(experience);
    });
  }

  // Actualizar experiencia
  updateExperience(experience:Experience){
    this.experienceService.update(experience)
    .subscribe((experience) =>{
      const index = this.experiences.findIndex(exp => exp.id === experience.id);
      this.experiences[index] = experience;
    });
  }

  // Cerrar add experience
  closeAddExperience(showAddExperience: boolean){
    this.showAddExperience = showAddExperience;
  }

}
