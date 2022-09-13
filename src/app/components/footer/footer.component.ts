import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SocialNetwork } from 'src/app/models/socialNetwork.interface';
import { SocialNetworkService } from 'src/app/services/socialNetwork.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() personId: string = "";

  socialNetworks: SocialNetwork[] = [];
  socialNetworkLinks: SocialNetwork[] = [];

  constructor(private socialNetworkService: SocialNetworkService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.personId = changes['personId'].currentValue;
    if (this.personId != '') {
      this.socialNetworkService.list(this.personId).subscribe(socialNetworks => {
        socialNetworks.forEach(socialNetwork => {
          if (socialNetwork.socialNetworkType.isLink) {
            this.socialNetworkLinks.push(socialNetwork);
          } else {
            this.socialNetworks.push(socialNetwork);
          }
        });
      })
    }
  }

}
