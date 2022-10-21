import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialNetwork } from 'src/app/models/socialNetwork.interface';
import { SocialNetworkType } from 'src/app/models/socialNetworkType.interface';
import { SocialNetworkTypeService } from 'src/app/services/socialNetworkType.service';
import { socialNetworkTypeValidator } from 'src/app/validators/social-network-type-validator.directive';

@Component({
  selector: 'app-social-network-update',
  templateUrl: './social-network-update.component.html',
  styleUrls: ['./social-network-update.component.css', '../../app.component.css']
})
export class SocialNetworkUpdateComponent implements OnInit {

  @Output() onUpdateSocialNetwork: EventEmitter<SocialNetwork> = new EventEmitter();
  @Output() closeUpdateSocialNetwork = new EventEmitter();
  @Input() showUpdateSocialNetwork: Boolean = false;
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
  

  form: FormGroup = new FormGroup({});
  selectedsocialNetworkType: SocialNetworkType = { 
    id: "",
    name: "",
    isLink: false
  }
  socialNetworkTypes: SocialNetworkType[] = [];
  labelContent: String = "Correo electrónico";

  constructor(private socialNetworkTypeService: SocialNetworkTypeService) { }

  ngOnInit(): void { 
    this.form = new FormGroup({
      content: new FormControl(this.socialNetwork.content, [Validators.required]), 
      socialNetworkType: new FormControl(this.socialNetwork.socialNetworkType, [Validators.required]), 
    }, { validators: socialNetworkTypeValidator });

    this.socialNetworkTypeService.list().subscribe(socialNetworkTypes => {
      this.socialNetworkTypes = socialNetworkTypes;
      this.selectedsocialNetworkType = this.socialNetworkTypes.find(type => 
        type.name === this.socialNetwork.socialNetworkType.name) || socialNetworkTypes[0];
      this.form.controls['socialNetworkType'].setValue(this.selectedsocialNetworkType, { onlySelf: true });
      this.labelSocialNetwork();
    });
  }

  // Envia la red social al padre
  async onSubmit(){
    if (this.form.valid){
      this.socialNetwork.content = this.form.value.content;
      this.socialNetwork.socialNetworkTypeId = this.form.value.socialNetworkType.id;
      this.socialNetwork.personId = this.socialNetwork.personId;
  
      this.onUpdateSocialNetwork.emit(this.socialNetwork)
    }
  }

  // Cerrar formulario
  close() {
    this.cleanVars();
    this.closeUpdateSocialNetwork.emit(this.showUpdateSocialNetwork);
  }

  // Limpiar las variables
  cleanVars() {
    this.showUpdateSocialNetwork = false;
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
