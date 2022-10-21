import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appSocialNetworkTypeValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: SocialNetworkTypeValidatorDirective, multi: true}]
})
export class SocialNetworkTypeValidatorDirective implements Validator  {

  validate(control: AbstractControl): ValidationErrors | null {
    return socialNetworkTypeValidator(control);
  } 
  
}

export const socialNetworkTypeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const content = control.get('content')?.value;
  const socialNetworkType = control.get('socialNetworkType')?.value;

  let expression;
  if (socialNetworkType) {
    if (socialNetworkType.isLink) {
      expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    } else {
      if (socialNetworkType.name === 'Gmail' || socialNetworkType.name === 'Email') {
        expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.\w{2,4}/g
      } else {
        expression = '^[0-9]{7,}$'
      }
    }
    
    const regex = new RegExp(expression, 'i');
    return regex.test(content) ? null : { contentInvalid: true }  ;
  }
  return null;
};

