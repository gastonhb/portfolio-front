import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInComponent implements OnInit {

  faCircleUser = faCircleUser;
  form:FormGroup;

  constructor(private formBuilder:FormBuilder, private autenticacionService:AuthenticationService, private ruta:Router) { 
    this.form = this.formBuilder.group(
      {
        username:['', [Validators.required]],
        password:['',[Validators.required, Validators.minLength(8)]],
      }
    )
  }

  ngOnInit(): void {
  }

  get Username() {
    return this.form.get('username');
  }

  get Password() {
    return this.form.get('password');
  }

  onEnviar(event: Event){
    event.preventDefault;
    this.autenticacionService.login(this.form.value).subscribe(data=>{
      console.log("das" + data.username)
      this.ruta.navigate(['/portfolio/' + data.username])
    })
  }
}
