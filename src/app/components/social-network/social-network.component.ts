import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { SocialNetwork } from 'src/app/models/socialNetwork.interface';
import { SocialNetworkPayload } from 'src/app/models/socialNetworkPayload.interface';
import { SocialNetworkService } from 'src/app/services/socialNetwork.service';

@Component({
  selector: 'app-social-network',
  templateUrl: './social-network.component.html',
  styleUrls: ['./social-network.component.css']
})
export class SocialNetworkComponent implements OnInit {

  @Input() showSocialNetwork: Boolean = false;
  @Input() showAddSocialNetwork: Boolean = false;
  @Input() socialNetworks: SocialNetwork[] = [];
  @Output() closeSocialNetwork = new EventEmitter();

  faPlus = faPlus;
  
  constructor(private socialNetworkService: SocialNetworkService) { }

  ngOnInit(): void { }

  // Borrar red social
  onDelete(socialNetwork: SocialNetwork){
    this.socialNetworkService.delete(socialNetwork)
      .subscribe(() =>{
        this.socialNetworks = this.socialNetworks.filter(sn => sn.id !== socialNetwork.id);
      });
  }

  // Agrega red social
  onAddSocialNetwork(socialNetwork: SocialNetworkPayload){
    this.showAddSocialNetwork = false;
    this.socialNetworkService.create(socialNetwork)
    .subscribe((socialNetwork) =>{
      this.socialNetworks.push(socialNetwork);
    });
  }

  // Actualizar red social
  updateSocialNetwork(socialNetwork: SocialNetwork){
    const socialNetworkPayload: SocialNetworkPayload = {
      content: socialNetwork.content,
      socialNetworkTypeId: socialNetwork.socialNetworkTypeId, 
      personId: socialNetwork.personId, 
    };

    this.socialNetworkService.update(socialNetwork.id, socialNetworkPayload)
    .subscribe((socialNetwork) =>{
      const index = this.socialNetworks.findIndex(sn => sn.id === socialNetwork.id);
      this.socialNetworks[index] = socialNetwork;
    });
  }

  // Cerrar add socialNetwork
  closeAddSocialNetwork(showAddSocialNetwork: boolean){
    this.showAddSocialNetwork = showAddSocialNetwork;
  }

  // Cerrar formulario
  close() {
    this.closeSocialNetwork.emit(this.showAddSocialNetwork);
  }

  // Mostrar o ocultar update social network
  toggleAddSocialNetwork(){
    this.showAddSocialNetwork = !this.showAddSocialNetwork;
  }

}
