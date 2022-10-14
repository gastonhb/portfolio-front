import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTrashCan, faPen, faImage } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from 'src/app/services/storage.service';
import { Education } from "../../models/education.interface";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-education-item',
  templateUrl: './education-item.component.html',
  styleUrls: ['./education-item.component.css', '../../app.component.css']
})
export class EducationItemComponent implements OnInit {

  @Input() education: Education = {
    id: "", 
    title: "", 
    institute: "", 
    startDate: 0, 
    endDate: null, 
    urlImage: "", 
    personId: ""
  };
  @Output() onDeleteEducation: EventEmitter<Education> = new EventEmitter();
  @Output() updateEducation: EventEmitter<Education> = new EventEmitter();

  showUpdateEducation: boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;

  personId: string = "";

  faTrashCan = faTrashCan;
  faPen = faPen;
  faImage = faImage;

  constructor(private storageService: StorageService, private authenticationService: AuthenticationService, private userService: UserService) { 
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

  // Borrar educación
  async onDelete(education: Education){
    if (education.urlImage != null) {
      await this.deleteImage(education.urlImage);
    }
    this.onDeleteEducation.emit(education);
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Actualizar educación
  onUpdateEducation(education: Education){
    this.toggleUpdateEducation();
    this.updateEducation.emit(education);
  }

  // Mostrar educación
  toggleUpdateEducation(){
    this.showUpdateEducation = !this.showUpdateEducation;
  }

  // Cerrar update de educación
  closeUpdateEducation(showUpdateEducation: boolean){
    this.showUpdateEducation = showUpdateEducation;
  }
}