import { Component, ViewEncapsulation, inject, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { TextBoxModule, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import { Router } from '@angular/router';
import { ToastModule, ToastComponent} from '@syncfusion/ej2-angular-notifications';
import { ToastUtility } from '@syncfusion/ej2-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { TextAreaModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-register',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonModule, CheckBoxModule, TextBoxModule,  FormsModule, ReactiveFormsModule, ToastModule, DropDownListModule, NumericTextBoxModule, TextAreaModule, DatePickerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  error: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  form = this.fb.nonNullable.group({
    isExistingMember: [''],
    memberNo: [''],
    name: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });
  @ViewChild('password', { static: true })
  public passwordObj?: TextBoxComponent;
  public countries: string[] = ['United States', 'Canada'];

  ngAfterViewInit(): void {
    enableRipple(true);

    (this.passwordObj as TextBoxComponent).addIcon('append', 'e-input-eye e-icons e-eye');
    document
      .getElementsByClassName('e-input-eye')[0]
      .addEventListener('click', function (e) {
        let textObj: any = (document.getElementById('password') as any)
          .ej2_instances[0];
        if (textObj.element.type === 'password') {
          textObj.element.type = 'text';
        } else {
          textObj.element.type = 'password';
        }
      });
  }

  onSubmit(): void {
  }

}
