import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Skill } from 'src/app/models/skill.interface';
import { SkillPayload } from 'src/app/models/skillPayload.interface';
import { SkillType } from 'src/app/models/skillType.interface';
import { SkillTypeService } from 'src/app/services/skillType.service';

@Component({
  selector: 'app-skill-update',
  templateUrl: './skill-update.component.html',
  styleUrls: ['./skill-update.component.css', '../../app.component.css']
})
export class SkillUpdateComponent implements OnInit {

  @Output() onUpdateSkill: EventEmitter<SkillPayload> = new EventEmitter();
  @Input() showUpdateSkill: Boolean = false;
  @Output() closeUpdateSkill = new EventEmitter();

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

  form: FormGroup = new FormGroup({});
  skillTypes: SkillType[] = [];

  faImage = faImage;
  faTimes = faTimes;

  constructor(private skillTypeService: SkillTypeService) { }

  ngOnInit(): void {
    this.skillTypeService.list().subscribe(skillTypes => {
      this.skillTypes = skillTypes;
    });

    this.form = new FormGroup({
      name: new FormControl(this.skill.name, [Validators.required]), 
      grade: new FormControl(this.skill.grade, 
        [Validators.required, Validators.min(0), Validators.max(100)]), 
      skillType: new FormControl(this.skill.skillType, [Validators.required]),
    });
  }

  // Envia la habilidad actualizada a la clase padre
  async onSubmit(){
    if (this.form.valid){
      
      const skillPayload: SkillPayload = {
        name: this.form.value.name, 
        grade: this.form.value.grade, 
        skillTypeId: this.form.value.skillType.id,
        personId: this.skill.personId
      };

      this.onUpdateSkill.emit(skillPayload)
    }
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

  get name() { return this.form.get('name'); }

  get grade() { return this.form.get('grade'); }

  get skillType() { return this.form.get('skillType'); }

}
