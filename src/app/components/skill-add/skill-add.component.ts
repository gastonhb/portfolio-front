import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Skill } from 'src/app/models/skill.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-skill-add',
  templateUrl: './skill-add.component.html',
  styleUrls: ['./skill-add.component.css', '../../app.component.css']
})
export class SkillAddComponent implements OnInit {

  @Output() onAddSkill: EventEmitter<Skill> = new EventEmitter();
  @Input() showAddSkill: Boolean = false;
  @Output() closeAddSkill = new EventEmitter();

  name: string = "";
  type: string = "Hard Skill";
  grade: number = 50;
  personId: string;

  image: any;
  disabledEndDate: boolean = false;

  faPlus = faPlus;
  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService,
    private authenticationService: AuthenticationService) { 
    this.personId = this.authenticationService.personId;
  }

  ngOnInit(): void {}

  // Envia la nueva experiencia a la clase padre
  async save(){
    const { name, type, grade, personId } = this;
    if (name.length === 0 || type.length === 0 ) {
      return;
    }

    const newSkill = { name, type, grade, personId}
    
    this.name = "";
    this.type = "Hard Skill";
    this.grade = 50;
    this.showAddSkill = false;

    this.onAddSkill.emit(newSkill)
  }

  // Cerrar formulario
  close() {
    this.name = this.type = "";
    this.type = "Hard Skill";
    this.grade = 50;
    this.showAddSkill = false;
    this.closeAddSkill.emit(this.showAddSkill);
  }

}

