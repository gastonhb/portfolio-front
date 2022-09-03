import { Component, OnInit } from '@angular/core';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  faUser = faUser;
  faLinkedinIn = faLinkedinIn;

  subscription?: Subscription;
  hasCurrentUser: boolean = false;

  personId: string | null = null;

  constructor(private authenticationService: AuthenticationService, 
    private userService: UserService) { 
      this.hasCurrentUser = authenticationService.hasCurrentUser;
      this.subscription = this.authenticationService.onToggle().subscribe(value => {
        this.hasCurrentUser = value
      });

      if (this.hasCurrentUser) {
        this.personId = this.authenticationService.personId;
      } else {
        this.userService.getByUsername("GastonHb").subscribe(user => {
          this.personId = user.person.id;
        });
      }
  }

  ngOnInit(): void {
  }

  logout(): void {
    return this.authenticationService.logout();
  }

}
