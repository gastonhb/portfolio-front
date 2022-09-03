import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html',
  styleUrls: ['./project-update.component.css', '../../app.component.css']
})
export class ProjectUpdateComponent implements OnInit {

  @Output() onUpdateProject: EventEmitter<Project> = new EventEmitter();
  @Input() showUpdateProject: Boolean = false;
  @Output() closeUpdateProject = new EventEmitter();

  @Input() project: Project;

  image: any;
  urlImage: string | null = null;
  disabledEndDate: boolean = false;
  subscription?: Subscription;

  faImage = faImage;
  faTimes = faTimes;

  constructor(private storageService: StorageService) { 
    this.project = {id: "", name: "", description: "", startDate: null, endDate: null, link: "", urlImage: "", personId: ""};
    this.urlImage = this.project.urlImage;
  }

  ngOnInit(): void {
  }

  // Envia la experiencia actualizada a la clase padre
  async save(){
    if (this.project.name.length === 0 || this.project.description.length === 0 || 
      this.project.startDate === null || this.project.endDate === null ||
      this.project.link.length === 0 ) {
      return;
    }
    if(this.project.person){
      this.project.personId = this.project.person.id;
    }

    if(this.image){
      if (this.project.urlImage) {
        await this.deleteImage(this.project.urlImage);
      };
      await this.saveImage();
      this.image = null;
    }
    
    this.onUpdateProject.emit(this.project)
  }

  // Guarda una imagen subida por un usuario
  uploadImage(event:any){
    let archivos = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(archivos[0]);
    reader.onloadend = () => {
      this.image = reader.result;
    }
  }

  // Guardar imagen en Firebase
  async saveImage() {
    await this.storageService.uploadImage("persons/" + this.project.personId + "/projects/" + this.project.id, this.image)
    .then(urlImagen =>{
      this.project.urlImage =  urlImagen;
   })
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Bloquear fecha de fin y poner en null
  changeDisabledEndDate() {
    this.disabledEndDate = !this.disabledEndDate;
    this.project.endDate = null;
  }

  // Cerrar formulario
  close() {
    this.showUpdateProject = false;
    this.closeUpdateProject.emit(this.showUpdateProject);
  }

}
