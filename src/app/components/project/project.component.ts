import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { faPlus, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { ProjectPayload } from 'src/app/models/projectPayload.interface';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  @Input() personId: string = "";

  showAddProject: Boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;
  hasError: Boolean = false;
  errorMessage: String = '';

  projects: Project [] = [];

  faPlus = faPlus;
  faPen = faPen;
  faTimes = faTimes;

  constructor(private projectService: ProjectService,
    private authenticationService: AuthenticationService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    this.personId = changes['personId'].currentValue;
    if (this.personId != '') {
      this.projectService.list(this.personId).subscribe(projects => {
        this.projects = projects;
      })
    }
  }

  // Mostrar o ocultar add project
  toggleAddProject(){
    this.showAddProject = !this.showAddProject;
  }

  // Borrar proyecto
  onDelete(project: Project){
    this.projectService.delete(project)
      .subscribe(() =>{
        this.projects = this.projects.filter(pro => pro.id !== project.id);
      });
  }

  // Agregar proyecto
  onAddProject(project: ProjectPayload){
    this.showAddProject = false;
    this.projectService.create(project)
    .subscribe({
      next: (project) =>{
        console.log(project)
        this.projects.push(project);
      },
      error: (err) => {
        console.log("d")
        this.hasError = true;
        this.errorMessage = "Revise la información enviada"
      }
    });
  }

  // Actualizar proyecto
  updateProject(project: Project){
    const index = this.projects.findIndex(pro => pro.id === project.id);
    this.projects[index] = project;
  }

  // Cerrar add project
  closeAddProject(showAddProject: boolean){
    this.showAddProject = showAddProject;
  }

  // Cerrar modal de error
  closeErrorModal(){
    this.hasError = !this.hasError;
  }

}