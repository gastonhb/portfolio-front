import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Skill } from "../models/skill.interface";

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  //TODO change entorno variable
  private url: string = "http://localhost:8080/skills"
  
  constructor(private http:HttpClient) {  }

  list():Observable<Skill[]>{
    return this.http.get<Skill[]>(this.url)
  }

  delete(skill: Skill): Observable<Skill>{
    return this.http.delete<Skill>(this.url + `/${skill.id}`)
  }

  create(skill:Skill): Observable<Skill>{
    return this.http.post<Skill>(this.url, skill)
  }

  update(skill:Skill): Observable<Skill>{
    return this.http.put<Skill>(this.url + `/${skill.id}`, skill)
  }

}

