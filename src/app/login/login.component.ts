import { Component, ViewEncapsulation, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TextBoxModule, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { FirebaseService } from '../common/firebase.service';
import { Router } from '@angular/router';
import { InputHintDirective } from '../common/input-hint.directive';

@Component({
  selector: 'app-user-login',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ 
    ButtonModule, TextBoxModule, FormsModule, InputHintDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('password', { static: true })
  public textbox?: TextBoxComponent;
  
  model: Login = new Login();
  error: boolean = false;
  errorMsg: any;
  firebaseService: FirebaseService = inject(FirebaseService);
  router: Router = inject(Router);

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

  onSignIn(form: NgForm): void {
    if (form.invalid) {
      for (let control in form.form.controls) {
        form.form.get(control)?.markAsTouched();
        form.form.get(control)?.updateValueAndValidity();
      }
      return;
    }

		this.firebaseService.signInWithEmail(this.model.email!, this.model.password!)
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

export class Login {
  email?: string;
  password?: string;

  constructor(email?: string, password?: string) {
    this.email = (email) ? this.email : '';
    this.password = (password) ? this.password : '';
  }
}