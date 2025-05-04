import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  constructor(private control: NgControl) { }

  @HostListener('input', ['$event'])

  onInput(event: any) {
    let value = event.value;
      if (value) {
        value = value.toUpperCase();
        this.control.control?.setValue(value, { emitEvent: false });
        event.value = value;
      }
  }

}
