import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SkillType } from "../models/skillType.interface";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class SkillTypeService {

  private url: string = environment.api + "skill-types"

  constructor(private http:HttpClient) {  }

  // Listar tipos de habilidades
  list(): Observable<SkillType[]>{
    return this.http.get<SkillType[]>(this.url)
  }

  // Borrar tipo de habilidad 
  delete(skillType: SkillType): Observable<SkillType>{
    return this.http.delete<SkillType>(this.url + `/${skillType.id}`)
  }

  // Crear tipo de habilidad
  create(skillType: SkillType): Observable<SkillType>{
    return this.http.post<SkillType>(this.url, skillType)
  }

  // Actualizar tipo de habilidad
  update(skillType: SkillType): Observable<SkillType>{
    return this.http.put<SkillType>(this.url + `/${skillType.id}`, skillType)
  }
}
