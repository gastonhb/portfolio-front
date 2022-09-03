import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Person } from 'src/app/models/person.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-about-update',
  templateUrl: './about-update.component.html',
  styleUrls: ['./about-update.component.css', '../../app.component.css']
})
export class AboutUpdateComponent implements OnInit {

  @Output() updatePerson: EventEmitter<Person> = new EventEmitter();
  @Input() showUpdateAbout: Boolean = false;
  @Output() closeUpdateAbout = new EventEmitter();

  @Input() person: Person;

  image: any;
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  subscription?: Subscription;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService) { 
    this.person = {id: "", name: "", lastname: "", title: "", abstracts: "", urlImage: "", urlCoverPhoto: "" }
  }

  ngOnInit(): void {
  }

  // Envia la educacion actualizada a la clase padre
  async save(){
    if (this.person.name.length === 0 || this.person.lastname.length === 0 || 
      this.person.title.length === 0 || this.person.abstracts.length === 0) {
      return;
    }
    
    this.updatePerson.emit(this.person)
  }

  // Cerrar formulario
  close() {
    this.showUpdateAbout = false;
    this.closeUpdateAbout.emit(this.showUpdateAbout);
  }

}
