import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { SocialNetwork } from 'src/app/models/socialNetwork.interface';
import { SocialNetworkService } from 'src/app/services/socialNetwork.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Input() personId: string = "";

  subscription?: Subscription;
  hasCurrentUser: Boolean = false;
  showSocialNetwork: Boolean = false;

  socialNetworks: SocialNetwork[] = [];

  faUser = faUser;

  constructor(private socialNetworkService: SocialNetworkService, 
    private authenticationService: AuthenticationService) { 
    this.hasCurrentUser = authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value;
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    this.personId = changes['personId'].currentValue;
    if (this.personId != '') {
      this.socialNetworkService.list(this.personId).subscribe(socialNetworks => {
        this.socialNetworks = socialNetworks;
      })
    }
  }

  logout(): void {
    return this.authenticationService.logout();
  }

  // Mostrar o ocultar update social network
  toggleUpdateSocialNetworks(){
    this.showSocialNetwork = !this.showSocialNetwork;
  }

  // Cerrar update social network
  closeSocialNetwork(showSocialNetwork: boolean){
    this.showSocialNetwork = showSocialNetwork;
  }

}
