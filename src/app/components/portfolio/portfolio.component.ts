import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  personId: string = "";

  constructor(private route: ActivatedRoute, private userService: UserService) { 
  }

  ngOnInit(): void  {
    this.route.params.subscribe(params => {
      const username = params['username']; 
      this.userService.getByUsername(username).subscribe(user => {
        this.personId = user.person.id;
      });
   });
 }

}
