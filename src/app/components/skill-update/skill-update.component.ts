import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Skill } from 'src/app/models/skill.interface';
import { SkillType } from 'src/app/models/skillType.interface';
import { SkillTypeService } from 'src/app/services/skillType.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-skill-update',
  templateUrl: './skill-update.component.html',
  styleUrls: ['./skill-update.component.css', '../../app.component.css']
})
export class SkillUpdateComponent implements OnInit {

  @Output() onUpdateSkill: EventEmitter<Skill> = new EventEmitter();
  @Input() showUpdateSkill: Boolean = false;
  @Output() closeUpdateSkill = new EventEmitter();

  @Input() skill: Skill = {
    name: "",
    grade: 50,
    personId: "",
    skillTypeId: "",
    skillType: { 
      id: "",
      name: ""
    }
  }

  image: any;
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  skillTypes: SkillType[] = [];

  faImage = faImage;
  faTimes = faTimes;

  constructor(private skillTypeService: SkillTypeService) { }

  ngOnInit(): void {
    this.skillTypeService.list().subscribe(skillTypes => {
      this.skillTypes = skillTypes;
    });
  }

  // Envia la experiencia actualizada a la clase padre
  async save(){
    if (this.skill.name.length === 0) {
      return;
    }

    this.skill.skillTypeId =  this.skill.skillType.id;
    
    this.onUpdateSkill.emit(this.skill)
  }

  // Cerrar formulario
  close() {
    this.showUpdateSkill = false;
    this.closeUpdateSkill.emit(this.showUpdateSkill);
  }

  // Comparar nombres de tipos de jornadas
  compareNames(work1: SkillType, work2: SkillType) {
    return work1.name === work2.name;
  }

}
