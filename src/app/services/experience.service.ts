
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Experience } from "../models/experience.interface";

@Injectable({
  providedIn: 'root'
})

export class ExperienceService {

  //TODO change entorno variable
  private url: string = "http://localhost:8080/work-experiences"
  
  constructor(private http:HttpClient) {  }

  list():Observable<Experience[]>{
    return this.http.get<Experience[]>(this.url)
  }

  delete(experience: Experience): Observable<Experience>{
    return this.http.delete<Experience>(this.url + `/${experience.id}`)
  }

  create(experience:Experience): Observable<Experience>{
    return this.http.post<Experience>(this.url, experience)
  }

  update(experience:Experience): Observable<Experience>{
    return this.http.put<Experience>(this.url + `/${experience.id}`, experience)
  }
}
