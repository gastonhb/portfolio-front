import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialNetworkPayload } from 'src/app/models/socialNetworkPayload.interface';
import { SocialNetworkType } from 'src/app/models/socialNetworkType.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SocialNetworkTypeService } from 'src/app/services/socialNetworkType.service';
import { socialNetworkTypeValidator } from 'src/app/validators/social-network-type-validator.directive';


@Component({
  selector: 'app-social-network-add',
  templateUrl: './social-network-add.component.html',
  styleUrls: ['./social-network-add.component.css', '../../app.component.css']
})
export class SocialNetworkAddComponent implements OnInit {

  @Output() onAddSocialNetwork: EventEmitter<SocialNetworkPayload> = new EventEmitter();
  @Output() closeAddSocialNetwork = new EventEmitter();
  @Input() showAddSocialNetwork: Boolean = false;
  @Input() socialNetwork: SocialNetworkPayload = {
    content: "", 
    personId: "",
    socialNetworkTypeId: "",
  };
  
  form: FormGroup = new FormGroup({});
  selectedSocialNetworkType: SocialNetworkType = { 
    id: "",
    name: "",
    isLink: false
  }
  socialNetworkTypes: SocialNetworkType[] = [];
  labelContent: String = "Correo electrónico";

  constructor(private socialNetworkTypeService: SocialNetworkTypeService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void { 
    this.form = new FormGroup({
      content: new FormControl('', [Validators.required]), 
      socialNetworkType: new FormControl('', [Validators.required]), 
    }, { validators: socialNetworkTypeValidator });

    this.socialNetworkTypeService.list().subscribe(socialNetworkTypes => {
      this.socialNetworkTypes = socialNetworkTypes;
      this.selectedSocialNetworkType = this.socialNetworkTypes.find(type => 
        type.name === "Email") || socialNetworkTypes[0];
      this.form.controls['socialNetworkType'].setValue(this.selectedSocialNetworkType, { onlySelf: true });
    });
  }

  // Envia la red social al padre
  async onSubmit(){
    if (this.form.valid){
      this.socialNetwork.content = this.form.value.content;
      this.socialNetwork.socialNetworkTypeId = this.form.value.socialNetworkType.id;
      this.socialNetwork.personId = this.authenticationService.personId;
  
      this.onAddSocialNetwork.emit(this.socialNetwork)
      this.cleanVars();
    }
  }

  // Cerrar formulario
  close() {
    this.cleanVars();
    this.closeAddSocialNetwork.emit(this.showAddSocialNetwork);
  }

  // Limpiar las variables
  cleanVars() {
    this.socialNetwork.content = "";
    this.socialNetwork.socialNetworkTypeId = "";

    this.form.reset();
    this.form.patchValue({
      socialNetworkType: this.selectedSocialNetworkType,
    });

    this.labelContent = "Correo electrónico"
    this.showAddSocialNetwork = false;
  }

  labelSocialNetwork(){
    const currentType = this.socialNetworkType?.value
    if (currentType.isLink) {
      this.labelContent = "URL"
    } else {
      if (currentType.name === 'Gmail' || currentType.name === 'Email') {
        this.labelContent = "Correo electrónico"
      } else {
        this.labelContent = "Número"
      }
    }
  }

  // Agregar error cuando la fecha de fin sea menor a la fecha de inicio
  contentIfFormIsDirty(){
    let errorsContent = this.form.controls['content'].errors
    if (errorsContent != null && errorsContent['contentInvalid']) {
      delete errorsContent['contentInvalid']
      if (Object.keys(errorsContent).length === 0) {
        errorsContent = null
      }
    }
  
    this.form.errors?.['contentInvalid'] ? 
      this.form.controls['content'].setErrors({...errorsContent,'contentInvalid': true}) : 
      this.form.controls['content'].setErrors(errorsContent);
  }

  get content() { return this.form.get('content'); }

  get socialNetworkType() { return this.form.get('socialNetworkType'); }

}

