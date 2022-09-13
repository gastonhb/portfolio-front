import { Component, Input, OnInit } from '@angular/core';
import { faLinkedinIn, faInstagram, faFacebook, faYoutube, IconDefinition, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { SocialNetwork } from 'src/app/models/socialNetwork.interface';

@Component({
  selector: 'app-social-network-link-item',
  templateUrl: './social-network-link-item.component.html',
  styleUrls: ['./social-network-link-item.component.css']
})
export class SocialNetworkLinkItemComponent implements OnInit {

  @Input() socialNetwork: SocialNetwork = {
    id: "",
    content: "",
    personId: "",
    socialNetworkTypeId: "",
    socialNetworkType: {
      id: "",
      name: "",
      isLink: true
    }
  };

  icon: IconDefinition = faLinkedinIn;

  constructor() { }

  ngOnInit(): void {
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
      case "Linkedin":
        this.icon = faLinkedinIn;
        break;
    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }

}
