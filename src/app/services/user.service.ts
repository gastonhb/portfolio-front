import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //TODO change entorno variable
  private url: string = "http://localhost:8080/users"
  
  constructor(private http:HttpClient) {  }

  getByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.url + `/username/${username}`)
  }
  
}
