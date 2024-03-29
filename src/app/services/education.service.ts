import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Education } from "../models/education.interface";
import { environment } from "../../environments/environment"
import { EducationPayload } from '../models/educationPayload.interface';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  private url: string = environment.api + "educations"

  constructor(private http:HttpClient) {  }

  // Listar educaciones
  list(personId: String): Observable<Education[]>{
    return this.http.get<Education[]>(this.url + `?personId=${personId}`)
  }

  // Borrar educacion 
  delete(education: Education): Observable<Education>{
    return this.http.delete<Education>(this.url + `/${education.id}`)
  }

  // Crear educacion
  create(education: EducationPayload): Observable<Education>{
    return this.http.post<Education>(this.url, education)
  }

  // Actualizar educacion
  update(id: String, education: EducationPayload): Observable<Education>{
    return this.http.put<Education>(this.url + `/${id}`, education)
  }
}
