import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private authenticationService: AuthenticationService) { }

  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    let currentUser = this.authenticationService.AutenticatedUser;
    
    if (currentUser && currentUser.accessToken) {
      req = req.clone({
        setHeaders:{
          Authorization: `Bearer ${currentUser.accessToken}`,
        }
      })
    }

    return next.handle(req);
  }
}
