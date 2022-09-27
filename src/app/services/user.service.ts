import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user.interface";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = environment.api + "users"
  
  constructor(private http:HttpClient) {  }

  getByUsername(username: string): Observable<User> {
    return this.http.get<User>(this.url + `/username/${username}`)
  }
  
}
