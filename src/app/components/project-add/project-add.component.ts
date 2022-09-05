import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faPlus, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Project } from 'src/app/models/project.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css', '../../app.component.css']
})
export class ProjectAddComponent implements OnInit {

  @Output() onAddProject: EventEmitter<Project> = new EventEmitter();
  @Input() showAddProject: Boolean = false;
  @Output() closeAddProject = new EventEmitter();

  name: string = "";
  description: string = "";
  startDate: Date | null = null;
  endDate: Date | null = null;
  link: string = "";
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
    const { name, description, startDate, endDate, link, personId } = this;
    if (name.length === 0 || description.length === 0 || 
      startDate === null || endDate === null || link.length === 0 ) {
      return;
    }

    if(this.image){
      await this.saveImage();
      this.image = null;
    }

    const urlImage =  this.urlImage;
    const newProject = { name, description, startDate, endDate, link, urlImage, personId }
    
    this.cleanVars();
    this.onAddProject.emit(newProject)
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
    await this.storageService.uploadImage("persons/" + this.personId + "/projects/" + (new Date()).toString() , this.image)
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
    this.cleanVars();
    this.closeAddProject.emit(this.showAddProject);
  }

  // Limpiar las variables
  cleanVars() {
    this.name = this.description = this.link = "";
    this.startDate =  this.endDate = this.urlImage = this.image = null;
    this.showAddProject = false;
  }

}
