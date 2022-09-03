import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTrashCan, faPen, faImage } from '@fortawesome/free-solid-svg-icons';
import { Skill } from "../../models/skill.interface";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.css']
})
export class SkillItemComponent implements OnInit {

  @Input() skill: Skill = {id: "", name: "", type: "", grade: 50, personId: ""};;
  @Output() onDeleteSkill: EventEmitter<Skill> = new EventEmitter();
  @Output() updateSkill: EventEmitter<Skill> = new EventEmitter();

  showUpdateSkill: boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;

  personId: string = "";

  faTrashCan = faTrashCan;
  faPen = faPen;
  faImage = faImage;

  constructor(private authenticationService: AuthenticationService, private userService: UserService) { 
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

  ngOnInit(): void {}

  // Borrar habilidad
  async onDelete(skill: Skill){
    this.onDeleteSkill.emit(skill);
  }

  // Actualizar habilidad
  onUpdateSkill(skill: Skill){
    this.toggleUpdateSkill();
    this.updateSkill.emit(skill);
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
    if (skillType === type) {
      return true;
    } else {
      return false;
    }
  }
  
}
