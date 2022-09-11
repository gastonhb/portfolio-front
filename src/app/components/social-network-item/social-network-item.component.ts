import { Component, Input, OnInit } from '@angular/core';
import { faLinkedinIn, faInstagram, faFacebook, faYoutube, IconDefinition, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { SocialNetwork } from 'src/app/models/socialNetwork.interface';

@Component({
  selector: 'app-social-network-item',
  templateUrl: './social-network-item.component.html',
  styleUrls: ['./social-network-item.component.css']
})
export class SocialNetworkItemComponent implements OnInit {

  @Input() socialNetwork: SocialNetwork = {
    id: "",
    description: "",
    personId: "",
    socialNetworkTypeId: "",
    socialNetworkType: {
      id: "",
      name: ""
    }
  };

  icon: IconDefinition = faLinkedinIn;
  description: string = "";
  visible: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.description = this.socialNetwork.description;
    switch (this.socialNetwork.socialNetworkType.name) {
      case "YouTube":
        this.icon = faYoutube;
        break;
      case "Twitter":
        this.icon = faTwitter;
        break;
      case "Instagram":
        this.icon = faInstagram;
        break;
      case "Facebook":
        this.icon = faFacebook;
        break;
      case "LinkedinIn":
        this.icon = faLinkedinIn;
        break;
      default:
        this.visible = false;
        break;
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

}
