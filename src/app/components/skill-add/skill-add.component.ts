import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Skill } from 'src/app/models/skill.interface';
import { SkillPayload } from 'src/app/models/skillPayload.interface';
import { SkillType } from 'src/app/models/skillType.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SkillTypeService } from 'src/app/services/skillType.service';

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
  form: FormGroup = new FormGroup({});
  disabledEndDate: Boolean = false;
  skillTypes: SkillType[] = [];
  selectedSkillType: SkillType = { 
    id: "", 
    name: "" 
  };

  faPlus = faPlus;
  faImage = faImage;
  faTimes = faTimes;

  constructor(private skillTypeService: SkillTypeService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.skillTypeService.list().subscribe(skillTypes => {
      this.skillTypes = skillTypes;
      this.selectedSkillType = skillTypes.find(type => type.name === "Hard skill") || skillTypes[0];

      this.form = new FormGroup({
        name: new FormControl('', [Validators.required]), 
        grade: new FormControl(50, [Validators.required, Validators.min(0), Validators.max(100)]), 
        skillType: new FormControl(this.selectedSkillType, [Validators.required]),
      });
    })
  }

  // Envia la nueva experiencia a la clase padre
  async onSubmit(){
    if (this.form.valid){
      this.skill.name =  this.form.value.name;
      this.skill.grade = this.form.value.grade;
      this.skill.personId = this.authenticationService.personId;
      this.skill.skillTypeId =  this.form.value.skillType.id;
  
      this.onAddSkill.emit(this.skill)
      this.cleanVars();
    }
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
    this.form.reset();

    this.form.patchValue({
      skillType: this.selectedSkillType,
      grade: 50
    });

    this.showAddSkill = false;
  }

  get name() { return this.form.get('name'); }

  get grade() { return this.form.get('grade'); }

  get skillType() { return this.form.get('skillType'); }

}

