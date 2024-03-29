import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faPen, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { EducationService } from 'src/app/services/education.service';
import { Education } from 'src/app/models/education.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { EducationPayload } from 'src/app/models/educationPayload.interface';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit, OnChanges {

  @Input() personId: string = "";

  showAddEducation: Boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;
  hasError: Boolean = false;
  errorMessage: String = '';

  educations: Education [] = [];

  faPlus = faPlus;
  faPen = faPen;
  faTimes = faTimes;

  constructor(private educationService: EducationService, 
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void { 
    this.hasCurrentUser = this.authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.personId = changes['personId'].currentValue;
    if (this.personId != '') {
      this.educationService.list(this.personId).subscribe(educations => {
        this.educations = educations;
      })
    }
  }

  // Mostrar o ocultar add education
  toggleAddEducation(){
    this.showAddEducation = !this.showAddEducation;
  }

  // Borrar educacion
  onDelete(education: Education){
    this.educationService.delete(education)
      .subscribe(() =>{
        this.educations = this.educations.filter(edu => edu.id !== education.id);
      });
  }

  // Agrega educacion
  onAddEducation(education: EducationPayload){
    this.showAddEducation = false;
    this.educationService.create(education)
    .subscribe({
      next: (education) =>{
        this.educations.push(education);
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = "Revise la información enviada"
      }
    });
  }

  // Actualizar educacion
  updateEducation(education: Education){
    const index = this.educations.findIndex(edu => edu.id === education.id);
    this.educations[index] = education;
  }

  // Cerrar add education
  closeAddEducation(showAddEducation: boolean){
    this.showAddEducation = showAddEducation;
  }

  // Cerrar modal de error
  closeErrorModal(){
    this.hasError = !this.hasError;
  }

}
