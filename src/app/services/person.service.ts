import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Person } from "../models/person.interface";
import { environment } from "../../environments/environment"
import { PersonPayload } from '../models/personPayload.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private url: string = environment.api + "persons"
  
  constructor(private http:HttpClient) {  }

  list(): Observable<Person[]>{
    return this.http.get<Person[]>(this.url)
  }

  delete(person: Person): Observable<Person>{
    return this.http.delete<Person>(this.url + `/${person.id}`)
  }

  create(person: PersonPayload): Observable<Person>{
    return this.http.post<Person>(this.url, person)
  }

  update(id: String, person: PersonPayload): Observable<Person>{
    return this.http.put<Person>(this.url + `/${id}`, person)
  }

  get(personId: String): Observable<Person>{
    return this.http.get<Person>(this.url + `/${personId}`)
  }

}
