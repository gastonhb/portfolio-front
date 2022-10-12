import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appDateInPast]',
  providers: [{provide: NG_VALIDATORS, useExisting: DateInPastDirective, multi: true}]
})
export class DateInPastDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return dateInPastValidator()(control);
  }
}

export function dateInPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const today = new Date();
    const date = new Date(control.value)
    return date > today ? { futureDate: { value: control.value } } : null;
  };
}
