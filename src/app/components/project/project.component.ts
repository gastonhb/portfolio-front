import { Component, OnInit } from '@angular/core';
import { faPlus, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  showAddProject: Boolean = false;
  hasCurrentUser: boolean = false;
  subscription?: Subscription;

  personId: string = "";
  projects: Project [] = [];

  faPlus = faPlus;
  faPen = faPen;
  faTimes = faTimes;

  constructor(private projectService: ProjectService, private authenticationService: AuthenticationService, private userService: UserService) { 
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

  ngOnInit(): void {
    this.projectService.list().subscribe(projects => {
      this.projects = projects;
    })
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

  // Agrega proyecto
  onAddProject(project:Project){
    this.showAddProject = false;
    this.projectService.create(project)
    .subscribe((project) =>{
      this.projects.push(project);
    });
  }

  // Actualizar proyecto
  updateProject(project:Project){
    this.projectService.update(project)
    .subscribe((project) =>{
      const index = this.projects.findIndex(pro => pro.id === project.id);
      this.projects[index] = project;
    });
  }

  // Cerrar add project
  closeAddProject(showAddProject: boolean){
    this.showAddProject = showAddProject;
  }

}