import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Project } from "../models/project.interface";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  //TODO change entorno variable
  private url: string = "http://localhost:8080/projects"
  
  constructor(private http:HttpClient) {  }

  list(personId: String):Observable<Project[]>{
    return this.http.get<Project[]>(this.url+ `?personId=${personId}`)
  }

  delete(project: Project): Observable<Project>{
    return this.http.delete<Project>(this.url + `/${project.id}`)
  }

  create(project: Project): Observable<Project>{
    return this.http.post<Project>(this.url, project)
  }

  update(project: Project): Observable<Project>{
    return this.http.put<Project>(this.url + `/${project.id}`, project)
  }

}
