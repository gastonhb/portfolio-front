import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Skill } from 'src/app/models/skill.interface';
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

  @Input() skill: Skill;

  image: any;
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  subscription?: Subscription;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService) { 
    this.skill = {id: "", name: "", type: "", grade: 50, personId: ""};
  }

  ngOnInit(): void {
  }

  // Envia la experiencia actualizada a la clase padre
  async save(){
    if (this.skill.name.length === 0 || this.skill.type.length === 0 ) {
      return;
    }

    if(this.skill.person){
      this.skill.personId = this.skill.person.id;
    }
    
    this.onUpdateSkill.emit(this.skill)
  }

  // Cerrar formulario
  close() {
    this.showUpdateSkill = false;
    this.closeUpdateSkill.emit(this.showUpdateSkill);
  }

}
