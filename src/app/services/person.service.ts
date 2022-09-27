import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Person } from "../models/person.interface";
import { environment } from "../../environments/environment"

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

  create(person:Person): Observable<Person>{
    return this.http.post<Person>(this.url, person)
  }

  update(person:Person): Observable<Person>{
    return this.http.put<Person>(this.url + `/${person.id}`, person)
  }

  get(personId: string): Observable<Person>{
    return this.http.get<Person>(this.url + `/${personId}`)
  }

}
