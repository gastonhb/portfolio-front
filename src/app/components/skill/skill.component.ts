import { Component, OnInit } from '@angular/core';
import { faPen, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SkillService } from 'src/app/services/skill.service';
import { Skill } from 'src/app/models/skill.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  showAddSkill: Boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;

  personId: string = "";
  hardSkills: Skill [] = [];
  softSkills: Skill [] = [];

  faPlus = faPlus;
  faPen = faPen;
  faTimes = faTimes;

  constructor(private skillService: SkillService, private authenticationService: AuthenticationService, private userService: UserService) { 
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
    this.skillService.list().subscribe(skills => {
      skills.forEach(skill => {
        if (skill.type === "Hard Skill") {
          this.hardSkills.push(skill);
        } else {
          this.softSkills.push(skill);
        }
      });
    })
  }

  // Mostrar o ocultar add skill
  toggleAddSkill(){
    this.showAddSkill = !this.showAddSkill;
  }

  // Borrar habilidad
  onDelete(skill: Skill){
    this.skillService.delete(skill)
      .subscribe(() =>{
        if (skill.type === "Hard Skill") {
          this.hardSkills = this.hardSkills.filter(ski => ski.id !== skill.id);
        } else {
          this.softSkills = this.softSkills.filter(ski => ski.id !== skill.id);
        }
        
      });
  }

  // Agrega habilidad
  onAddSkill(skill:Skill){
    this.showAddSkill = false;
    this.skillService.create(skill)
    .subscribe((skill) =>{
      if (skill.type === "Hard Skill") {
        this.hardSkills.push(skill);
      } else {
        this.softSkills.push(skill);
      }
    });
  }

  // Actualizar habilidad
  updateSkill(skill:Skill){
    this.skillService.update(skill)
    .subscribe((skill) =>{
      if (skill.type === "Hard Skill") {
        const index = this.hardSkills.findIndex(ski => ski.id === skill.id);
        this.hardSkills[index] = skill;
      } else {
        this.softSkills.push(skill);
      }
      const index = this.softSkills.findIndex(ski => ski.id === skill.id);
      this.softSkills[index] = skill;
    });
  }

  // Cerrar add skill
  closeAddSkill(showAddSkill: boolean){
    this.showAddSkill = showAddSkill;
  }

}
