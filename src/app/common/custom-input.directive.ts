import { Directive, Input } from '@angular/core';
import * as f from './functions';

@Directive({
  selector: '[customInput]',
  host: {
    '(input)': 'onChange($event)'
  }
})
export class CustomInputDirective {

  @Input('customInput') inputType!: string;

  constructor() {}

  onChange($event: any) {
    console.log($event.event);
    let pos = $event.event.target.value.selectionStart;
    switch(this.inputType.toLowerCase()) {
      case 'uppercase':
        $event.event.target.value = String($event.event.target.value).toUpperCase();
        break;
      case 'camelcase':
        $event.event.target.value = f.camelCase($event.event.target.value);
        break;
      case 'phone':
        if ($event.event.target.value.length == 10) {
            pos += 4;
        }
        $event.event.target.value = f.phone($event.event.target.value);
        break;
    }
    $event.event.target.selectionStart = pos;
    $event.event.target.selectionEnd = pos;
  }
}
