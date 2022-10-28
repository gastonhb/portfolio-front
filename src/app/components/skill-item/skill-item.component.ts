import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTrashCan, faPen, faImage } from '@fortawesome/free-solid-svg-icons';
import { Skill } from "../../models/skill.interface";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { SkillService } from 'src/app/services/skill.service';
import { SkillPayload } from 'src/app/models/skillPayload.interface';

@Component({
  selector: 'app-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.css']
})
export class SkillItemComponent implements OnInit {

  @Input() skill: Skill = {
    id: "",
    name: "",
    grade: 50,
    personId: "",
    skillTypeId: "",
    skillType: { 
      id: "",
      name: ""
    }
  }

  @Output() onDeleteSkill: EventEmitter<Skill> = new EventEmitter();
  @Output() updateSkill: EventEmitter<Skill> = new EventEmitter();

  showUpdateSkill: boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;
  hasError: Boolean = false;
  errorMessage: String = '';

  personId: string = "";

  faTrashCan = faTrashCan;
  faPen = faPen;
  faImage = faImage;

  constructor(private authenticationService: AuthenticationService,
    private skillService: SkillService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value
    });
  }

  ngOnInit(): void {}

  // Borrar habilidad
  async onDelete(skill: Skill){
    this.onDeleteSkill.emit(skill);
  }

  // Actualizar habilidad
  onUpdateSkill(skillPayload: SkillPayload){
    this.skillService.update(this.skill.id, skillPayload)
    .subscribe({
      next: (skill) =>{
        this.skill = skill;
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = "Revise la información enviada"
      }
    });
    this.toggleUpdateSkill();
    this.updateSkill.emit(this.skill);
  }

  // Mostrar habilidad
  toggleUpdateSkill(){
    this.showUpdateSkill = !this.showUpdateSkill;
  }

  // Cerrar update de habilidad
  closeUpdateSkill(showUpdateSkill: boolean){
    this.showUpdateSkill = showUpdateSkill;
  }

  skillType(skillType: string, type: string){
    return skillType === type ? true : false;
  }

  // Cerrar modal de error
  closeErrorModal(){
    this.hasError = !this.hasError;
  }
  
}
