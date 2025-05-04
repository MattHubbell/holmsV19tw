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
import { AuthService } from '../login/services/auth.service';
import { Router } from '@angular/router';
import { ToastModule, ToastComponent} from '@syncfusion/ej2-angular-notifications';
import { ToastUtility } from '@syncfusion/ej2-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { TextAreaModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ExampleService } from './example.service';
import { Example } from './example.model';

@Component({
  imports: [
      ButtonModule, CheckBoxModule, TextBoxModule,  FormsModule, ReactiveFormsModule, ToastModule, DropDownListModule, NumericTextBoxModule, TextAreaModule, DatePickerModule
    ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})

export class ExampleComponent implements AfterViewInit {
  @ViewChild('password', { static: true })
  public textbox?: TextBoxComponent;
  public toastObj?: ToastComponent;
  public data: string[] = ['Snooker', 'Tennis', 'Cricket', 'Football', 'Rugby'];
  error: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  model: Example;
  selectedItem: any;

  exampleService: ExampleService;

  constructor() {
    this.exampleService = inject(ExampleService);
    this.model = new Example();
  }

  ngAfterViewInit(): void {
    enableRipple(true);
    (this.textbox as TextBoxComponent).addIcon('append', 'e-input-eye e-icons e-eye');
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
    const rawForm = this.form.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/protected-content');
      },
      error: (error) => {
        this.error = true;
        console.error('Email/Password Sign-In error:', error);
        this.toastObj = ToastUtility.show('Email/Password Sign-In error:' + error, 'Error', 2000) as ToastComponent;
      },
    });
  }

  onSuccessSubmit(): void {
    this.toastObj = ToastUtility.show('Hey, that actually worked!', 'Success', 2000) as ToastComponent;
  }

  onErrorSubmit(): void {
    this.toastObj = ToastUtility.show('Oops, that was an error.', 'Error', 2000) as ToastComponent;
  }

  async onGoogleSignIn(): Promise<void> {
    try {
      await this.authService.googleLogin();
      this.router.navigateByUrl('/main');
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  }

  guestLogin(): void {
    const values = { email: 'guest@mail.uk', password: 'fake_password' };
    this.form.patchValue(values);
    const subscription = this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        subscription.unsubscribe();
        this.onSubmit();
      }
    });
  } 

  addItem(): void {
    const model:Example = new Example();
    model.annualName = "Laura Ann Williams";
    model.street1 = "95391 Creekville Drive";
    model.city = "Fernandina Beach";
    model.state = "FL",
    model.zip  = "32034"
    this.exampleService.addItem(model);
  }

  findItem(): void {
    this.exampleService.getItemByFieldValue("annualName", "Laura Ann Williams", (record) => {
      this.selectedItem = record;
      this.model = Example.clone(record);
      console.log(this.selectedItem);
    });
  }

  updateItem(): void {
    this.model.street1 = "5102 Kenmore Ave";
    this.model.city = "Parma";
    this.model.state = "OH";
    this.model.zip = "44134";
    this.exampleService.updateItem(this.selectedItem.key, this.model)
  }

  deleteItem(): void {
    this.exampleService.deleteItem(this.selectedItem.key);
  }
}

