import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  // TODO cambiar url por cariable de entorno
  // url = "https://ghb-portfolio-back.herokuapp.com/auth/login"
  url = "http://localhost:8080/auth/login"
  currentUserSubject: BehaviorSubject<any>;
  private _hasCurrentUser: boolean = false;
  private subject = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'))
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(this.url, credenciales).pipe(map(data => {
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUserSubject.next(data);
      this._hasCurrentUser = true;
      this.subject.next(this.hasCurrentUser);
      return data;
    }))
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this._hasCurrentUser = false;
    console.log(this.hasCurrentUser);
    this.subject.next(this.hasCurrentUser);
  }

  get AutenticatedUser() {
    return this.currentUserSubject.value;
  }

  get personId() {
    return this.currentUserSubject.value.personId;
  }

  onToggle(): Observable<any> {
    return this.subject.asObservable();
  }

  public get hasCurrentUser(): boolean {
    return this._hasCurrentUser;
  }

}