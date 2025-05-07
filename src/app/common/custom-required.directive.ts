import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appCustomRequired]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomRequiredValidatorDirective, multi: true }]
})
export class CustomRequiredValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { required: true };
  }
}