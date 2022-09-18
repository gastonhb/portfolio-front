import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Skill } from 'src/app/models/skill.interface';
import { SkillPayload } from 'src/app/models/skillPayload.interface';
import { SkillType } from 'src/app/models/skillType.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SkillTypeService } from 'src/app/services/skillType.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-skill-add',
  templateUrl: './skill-add.component.html',
  styleUrls: ['./skill-add.component.css', '../../app.component.css']
})
export class SkillAddComponent implements OnInit {

  @Output() onAddSkill: EventEmitter<SkillPayload> = new EventEmitter();
  @Input() showAddSkill: Boolean = false;
  @Output() closeAddSkill = new EventEmitter();

  skill: SkillPayload = {
    name: "",
    grade: 50,
    personId: "",
    skillTypeId: ""
  }

  image: any;
  disabledEndDate: boolean = false;
  skillTypes: SkillType[] = [];
  skillType: SkillType = { id: "", name: "" };

  faPlus = faPlus;
  faImage = faImage;
  faTimes = faTimes;

  constructor(private skillTypeService: SkillTypeService,
    private authenticationService: AuthenticationService) { 
      //TODO ver personId
    this.skill.personId = this.authenticationService.personId;
  }

  ngOnInit(): void {
    this.skillTypeService.list().subscribe(skillTypes => {
      this.skillTypes = skillTypes;
      this.skillType = skillTypes.find(type => type.name === "Hard skill") || skillTypes[0];
    })
  }

  // Envia la nueva experiencia a la clase padre
  async save(){
    if (this.skill.name.length === 0) {
      return;
    }

    this.skill.skillTypeId = this.skillType.id;

    this.onAddSkill.emit(this.skill)
  }

  // Cerrar formulario
  close() {
    this.cleanVars();
    this.closeAddSkill.emit(this.showAddSkill);
  }


  // Comparar nombres de tipos de jornadas
  compareNames(skillType1: SkillType, skillType2: SkillType) {
    return skillType1.name === skillType2.name;
  }

  // Limpiar las variables
  cleanVars() {
    this.skill = {
      name: "",
      grade: 50,
      personId: "",
      skillTypeId: ""
    };
    this.showAddSkill = false;
  }

}

