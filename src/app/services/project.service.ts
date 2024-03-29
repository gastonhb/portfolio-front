import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Project } from "../models/project.interface";
import { environment } from "../../environments/environment"
import { ProjectPayload } from '../models/projectPayload.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private url: string = environment.api + "projects"
  
  constructor(private http:HttpClient) {  }

  list(personId: String):Observable<Project[]>{
    return this.http.get<Project[]>(this.url+ `?personId=${personId}`)
  }

  delete(project: Project): Observable<Project>{
    return this.http.delete<Project>(this.url + `/${project.id}`)
  }

  create(project: ProjectPayload): Observable<Project>{
    return this.http.post<Project>(this.url, project)
  }

  update(id: String, project: ProjectPayload): Observable<Project>{
    return this.http.put<Project>(this.url + `/${id}`, project)
  }

}
