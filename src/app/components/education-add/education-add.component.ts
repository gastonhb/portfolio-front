import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Education } from 'src/app/models/education.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-education-add',
  templateUrl: './education-add.component.html',
  styleUrls: ['./education-add.component.css', '../../app.component.css']
})
export class EducationAddComponent implements OnInit {

  @Output() onAddEducation: EventEmitter<Education> = new EventEmitter();
  @Input() showAddEducation: Boolean = false;
  @Output() closeAddEducation = new EventEmitter();

  title: string = "";
  institute: string = "";
  startDate: number | null = null;
  endDate: number | null = null;
  personId: string;
  urlImage: string | null = null;

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
    const { title, institute, startDate, endDate, personId } = this;
    if (title.length === 0 || institute.length === 0 || 
      startDate === null ) {
      return;
    }

    if(this.image){
      await this.saveImage();
      this.image = null;
    }
    const urlImage = this.urlImage;

    const newEducation = { title, institute, startDate, endDate, urlImage, personId }
    
    this.title = this.institute = "";
    this.startDate =  this.endDate = this.urlImage = null;
    this.showAddEducation = false;

    this.onAddEducation.emit(newEducation)
  }

  // Guarda una imagen subida por un usuario
  uploadImage(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () => {
      this.image = reader.result
    }
  }

  // Guardar imagen en Firebase
  async saveImage() {
    await this.storageService.uploadImage("persons/" + this.personId + "/educations/" + (new Date()).toString() , this.image)
    .then(urlImage =>{
      this.urlImage =  urlImage;
   })
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    this.endDate = null;
  }

  // Cerrar formulario
  close() {
    this.title = this.institute = "";
    this.startDate =  this.endDate = this.urlImage = this.image = null;
    this.showAddEducation = false;
    this.closeAddEducation.emit(this.showAddEducation);
  }

}
