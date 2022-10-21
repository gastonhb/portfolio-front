import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SocialNetwork } from 'src/app/models/socialNetwork.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-social-network-item',
  templateUrl: './social-network-item.component.html',
  styleUrls: ['./social-network-item.component.css']
})
export class SocialNetworkItemComponent implements OnInit {

  @Input() socialNetwork: SocialNetwork = {
    id: "",
    content: "", 
    personId: "",
    socialNetworkTypeId: "",
    socialNetworkType: {
      id: "",
      name: "",
      isLink: false
    },
  };
  @Output() onDeleteSocialNetwork: EventEmitter<SocialNetwork> = new EventEmitter();
  @Output() updateSocialNetwork: EventEmitter<SocialNetwork> = new EventEmitter();

  showUpdateSocialNetwork: Boolean = false;
  hasCurrentUser: Boolean = false;
  subscription?: Subscription;
  
  faTrashCan = faTrashCan;
  faPen = faPen;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void { 
    this.hasCurrentUser = this.authenticationService.hasCurrentUser;
    this.subscription = this.authenticationService.onToggle().subscribe(value => {
      this.hasCurrentUser = value
    });
  }

  // Borrar red social
  async onDelete(socialNetwork: SocialNetwork){
    this.onDeleteSocialNetwork.emit(socialNetwork);
  }

  // Actualizar red social
  onUpdateSocialNetwork(socialNetwork: SocialNetwork){
    this.toggleUpdateSocialNetwork();
    this.updateSocialNetwork.emit(socialNetwork);
  }

  // Mostrar red social
  toggleUpdateSocialNetwork(){
    this.showUpdateSocialNetwork = !this.showUpdateSocialNetwork;
  }

  // Cerrar update de red social
  closeUpdateSocialNetwork(showUpdateSocialNetwork: boolean){
    this.showUpdateSocialNetwork = showUpdateSocialNetwork;
  }

}
