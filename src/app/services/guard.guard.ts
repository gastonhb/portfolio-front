import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class GuardGuard implements CanActivate {

  // personId: string = "";
  nool: boolean = false;

  constructor(private userService: UserService, private rutas:Router) { }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // let currentUser = this.authenticationService.AutenticatedUser;
      const username = route.paramMap.get('username');
      /* this.route.params.subscribe(params => {
        const username = params['username']; 
        this.userService.getByUsername(username).subscribe(user => {
          this.personId = user.person.id;
        });
     }); */
    if (username) {
      this.userService.getByUsername(username).subscribe(user => {
        //this.personId = user.person.id;
        if (user.person.id) {
          this.nool =  true;
        } else {
          this.nool = false;
      
        }
      });

      if (!this.nool) {
        this.rutas.navigate(['**'])
      }
      
    }
    return this.nool;
    
    
  }
  
}
