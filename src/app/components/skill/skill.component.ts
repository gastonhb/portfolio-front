import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { faPen, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SkillService } from 'src/app/services/skill.service';
import { Skill } from 'src/app/models/skill.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { SkillPayload } from 'src/app/models/skillPayload.interface';
import { SkillTypeService } from 'src/app/services/skillType.service';
import { SkillType } from 'src/app/models/skillType.interface';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  @Input() personId: string = "";

  showAddSkill: Boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;

  hardSkills: Skill[] = [];
  softSkills: Skill[] = [];
  skillTypes: SkillType[] = [];

  faPlus = faPlus;
  faPen = faPen;
  faTimes = faTimes;

  constructor(private skillService: SkillService, private skillTypeService: SkillTypeService, private authenticationService: AuthenticationService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value;
    });
  }

  ngOnInit(): void { 
    this.skillTypeService.list().subscribe(skillTypes => {
      this.skillTypes = skillTypes;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.personId = changes['personId'].currentValue;
    if (this.personId != '') {
      this.skillService.list(this.personId).subscribe(skills => {
        skills.forEach(skill => {
          if (skill.skillType.name === "Hard skill") {
            this.hardSkills.push(skill);
          } else {
            this.softSkills.push(skill);
          }
        });
      })
    }
  }

  // Mostrar o ocultar add skill
  toggleAddSkill(){
    this.showAddSkill = !this.showAddSkill;
  }

  // Borrar habilidad
  onDelete(skill: Skill){
    this.skillService.delete(skill)
      .subscribe(() =>{
        if (skill.skillType.name === "Hard Skill") {
          this.hardSkills = this.hardSkills.filter(ski => ski.id !== skill.id);
        } else {
          this.softSkills = this.softSkills.filter(ski => ski.id !== skill.id);
        }
        
      });
  }

  // Agrega habilidad
  onAddSkill(skill: SkillPayload){
    this.showAddSkill = false;
    this.skillService.create(skill)
    .subscribe((skill) =>{
      if (skill.skillType.name === "Hard Skill") {
        this.hardSkills.push(skill);
      } else {
        this.softSkills.push(skill);
      }
    });
  }

  // Actualizar habilidad
  updateSkill(skill: SkillPayload){
    this.skillService.update(skill)
    .subscribe((skill) =>{
      let index;
      if (skill.skillType.name === "Hard skill") {
        index = this.hardSkills.findIndex(ski => ski.id === skill.id);
        console.log("hs" + index);
        if (index != -1) {
          console.log("hs-1" + index);
          this.hardSkills[index] = skill;
        } else {
          console.log("hs+1" + index);
          this.softSkills = this.softSkills.filter(ski => ski.id !== skill.id);
          this.hardSkills.push(skill)
        } 
      }

      if (skill.skillType.name === "Soft skill") {
        index = this.softSkills.findIndex(ski => ski.id === skill.id);
        if (index  != -1) {
          this.softSkills[index] = skill;
        } else {
          this.hardSkills = this.hardSkills.filter(ski => ski.id !== skill.id);
          this.softSkills.push(skill)
        } 
      }
    });
  }

  // Cerrar add skill
  closeAddSkill(showAddSkill: boolean){
    this.showAddSkill = showAddSkill;
  }

}
