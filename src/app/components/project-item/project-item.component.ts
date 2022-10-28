import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTrashCan, faPen, faImage } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from 'src/app/services/storage.service';
import { Project } from "../../models/project.interface";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ProjectPayload } from 'src/app/models/projectPayload.interface';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css', '../../app.component.css']
})
export class ProjectItemComponent implements OnInit {

  @Input() project: Project = { 
    id: "", 
    name: "", 
    description: "", 
    startDate: new Date(), 
    endDate: null, 
    link: "", 
    urlImage: "", 
    personId: "" 
  };
  @Output() onDeleteProject: EventEmitter<Project> = new EventEmitter();
  @Output() updateProject: EventEmitter<Project> = new EventEmitter();

  showUpdateProject: boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;
  hasError: Boolean = false;
  errorMessage: String = '';

  personId: string = "";

  faTrashCan = faTrashCan;
  faPen = faPen;
  faImage = faImage;

  constructor(private storageService: StorageService,
    private authenticationService: AuthenticationService, 
    private userService: UserService,
    private projectService: ProjectService) {
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

  ngOnInit(): void { }

  // Borrar proyecto
  async onDelete(project: Project) {
    if (project.urlImage != null) {
      await this.deleteImage(project.urlImage);
    }
    this.onDeleteProject.emit(project);
  }

  // Borrar imagen en Firebase
  async deleteImage(url: string) {
    await this.storageService.deleteImage(url)
  }

  // Actualizar proyecto
  onUpdateProject(projectPayload: ProjectPayload) {
    this.projectService.update(this.project.id, projectPayload)
    .subscribe({
      next: (project) =>{
        this.project = project;
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = "Revise la información enviada"
      }
    });
    this.toggleUpdateProject();
    this.updateProject.emit(this.project);
  }

  // Mostrar proyecto
  toggleUpdateProject() {
    this.showUpdateProject = !this.showUpdateProject;
  }

  // Cerrar update de proyecto
  closeUpdateProject(showUpdateProject: boolean) {
    this.showUpdateProject = showUpdateProject;
  }
  
  // Cerrar modal de error
  closeErrorModal(){
    this.hasError = !this.hasError;
  }

  // Ir a la pagina web
  goToLink(url: string){
    window.open(url, "_blank");
  }

}
