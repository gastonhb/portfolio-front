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
  form: FormGroup;
  hasError: Boolean = false;
  errorMessage: String = '';

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

  // Autenticar
  onSend(event: Event){
    event.preventDefault();
    this.autenticacionService.login(this.form.value).subscribe({
      next: (res) => {
        this.ruta.navigate(['/portfolio/' + res.username])},
      error: (err) => {
        if(err.status === 401){
          this.hasError = true;
          this.errorMessage = "Nombre de usuario o contraseña incorrecta."
        }
      }
    })
  }

  // Cerrar modal de error
  closeErrorModal(){
    this.hasError = !this.hasError;
  }
}
