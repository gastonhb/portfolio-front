import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appDateLessThenDate]',
  providers: [{provide: NG_VALIDATORS, useExisting: DateLessThenDateDirective, multi: true}]
})
export class DateLessThenDateDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    return dateLessThenDateValidator(control);
  }
}

export const dateLessThenDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate');
  const endDate = control.get('endDate');

  return endDate === null || 
    startDate?.value !== null && endDate !== null && startDate?.value > endDate.value
    ? { dateLessThenDate: true } : null ;
};
