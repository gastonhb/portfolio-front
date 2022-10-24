import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition, faWhatsapp, faTelegram, faGoogle} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { SocialNetwork } from 'src/app/models/socialNetwork.interface';

@Component({
  selector: 'app-social-network-contact-item',
  templateUrl: './social-network-contact-item.component.html',
  styleUrls: ['./social-network-contact-item.component.css']
})
export class SocialNetworkContactItemComponent implements OnInit {

  @Input() socialNetwork: SocialNetwork = {
    id: "",
    content: "",
    personId: "",
    socialNetworkTypeId: "",
    socialNetworkType: {
      id: "",
      name: "",
      isLink: false
    }
  };

  icon: IconDefinition = faEnvelope;

  constructor() { }

  ngOnInit(): void { 
    switch (this.socialNetwork.socialNetworkType.name) {
      case "Gmail":
        this.icon = faGoogle;
        break;
      case "Email":
        this.icon = faEnvelope;
        break;
      case "Telefono":
        this.icon = faPhone;
        break;
      case "Whatsapp":
        this.icon = faWhatsapp;
        break;
      case "Telegram":
        this.icon = faTelegram;
        break;
    }
  }

}
