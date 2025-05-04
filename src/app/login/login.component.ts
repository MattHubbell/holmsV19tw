import { Component, ViewEncapsulation, inject, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { TextBoxModule, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { FirebaseService } from '../common/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ ButtonModule, TextBoxModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('password', { static: true })
  public textbox?: TextBoxComponent;
  error: boolean = false;
  errorMsg: any;
  fb: FormBuilder = inject(FormBuilder);
  firebaseService: FirebaseService = inject(FirebaseService);
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

  constructor() {}

  ngAfterViewInit(): void {
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

  // onSubmit(): void {
  //   const rawForm = this.form.getRawValue();
  //   this.firebaseService.login(rawForm.email, rawForm.password).subscribe({
  //     next: () => {
  //       this.router.navigateByUrl('/protected-content');
  //     },
  //     error: (error) => {
  //       this.error = true;
  //       console.error('Email/Password Sign-In error:', error);
  //     },
  //   });
  // }

  signIn(): void {
    const rawForm = this.form.getRawValue();
		this.firebaseService.signInWithEmail(rawForm.email, rawForm.password)
		.then(() => {
			this.completeSignIn();
		})
		.catch(err => {
			this.onLoginError(err.message);
		});
	}

  completeSignIn() {
		if (this.firebaseService.authenticated) {
			// this.setLoginCookie();
			// this.appService.userEmail = this.email;
			// this.appService.onSuccessfulSignIn();
      this.router.navigateByUrl('/new-registrations');
		} else {
			this.errorMsg = 'Your email address and password are not found';
		}
	}

  onLoginError(message:string) {
		var re = /no user record/gi;
		if (message.search(re)) {
			this.errorMsg = 'Your email address and password are not found';
		} else {
			this.errorMsg = message;
		}
	}
}
