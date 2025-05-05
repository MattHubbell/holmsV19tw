import { Component, ViewEncapsulation, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { TextBoxModule, TextBoxComponent, NumericTextBoxModule, TextAreaModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { ToastModule, ToastComponent, ToastUtility } from '@syncfusion/ej2-angular-notifications';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { NewRegistration } from '../new-registrations/new-registration.model';
import { Countries } from '../common/countries';
import { FormErrorDirective } from '../common/form-error.directive';
import { UppercaseDirective } from '../common/uppercase.directive';
import { NewRegistrationService } from '../new-registrations/new-registration.service';
import { FirebaseService } from '../common/firebase.service';
import { MembershipUser, MembershipUserType } from '../membership-users/membership-user.model';
import { EmailService } from '../common/email.service';
import { SetupService } from '../setup/setup.service';
import { MembershipUserService } from '../membership-users/membership-user.service';
import  * as f from '../common/functions';

@Component({
  selector: 'app-register',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonModule, CheckBoxModule, TextBoxModule,  FormsModule, ToastModule, DropDownListModule, NumericTextBoxModule, TextAreaModule, DatePickerModule, FormErrorDirective, UppercaseDirective
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements AfterViewInit {

  @ViewChild('password', { static: true })
  passwordObj?: TextBoxComponent;

  ejToast?: ToastComponent;

  error: boolean = false;
  model: NewRegistration = new NewRegistration();
  router: Router = inject(Router);
  countries: any = Countries.map((rec) => rec.name.toUpperCase());

  firebaseService: FirebaseService;
  membershipUserService: MembershipUserService;
  newRegistrationService: NewRegistrationService;
  emailService: EmailService;
  setupService: SetupService;

  constructor() {
    this.firebaseService = inject(FirebaseService);
    this.membershipUserService = inject(MembershipUserService);
    this.newRegistrationService = inject(NewRegistrationService);
    this.emailService = inject(EmailService);
    this.setupService = inject(SetupService);
    this.setupService.getItem();
  }

  ngAfterViewInit(): void {
    (this.passwordObj as TextBoxComponent).addIcon('append', 'e-input-eye e-icons e-eye');
    document
    .getElementsByClassName('e-input-eye')[0]
    .addEventListener('click', function (e) {
      let textObj: any = (document.getElementById('password') as any).ej2_instances[0];
      if (textObj.element.type === 'password') {
        textObj.element.type = 'text';
      } else {
        textObj.element.type = 'password';
      }
    });
  }

  onSubmit(form:NgForm): void {
    if(form.invalid) {
      return;
    }

    let email = this.model.email!;
    let password = this.model.password!;
    this.firebaseService.createUser(email, password)
    .then(() => {
      let name = f.camelCase(this.model.registrationName!)
      this.firebaseService.updateUserProfile(name);
      this.addNewRegistration();
      this.signinNewUser();
    })
    .catch((error:string) => {
      console.log(error);
      this.ejToast = ToastUtility.show('Email Address already used.', 'Error', 2000) as ToastComponent;
    });
  }

  addNewRegistration(): void {
    let registrationName = this.model.registrationName!;
    let existingMemberNo = this.model.existingMemberNo!;
    let membershipUserType = MembershipUserType.New;
    let membershipUser = new MembershipUser(registrationName, existingMemberNo, membershipUserType);
    let uid = this.firebaseService.currentUser.uid;
    // this.membershipUserService.addItem(uid, membershipUser);
    // this.newRegistrationService.addItem(uid, this.model);
    this.sendNewMemberEmailToMembershipChair();
  }

  signinNewUser(): void {
    let email = this.model.email!;
    let password = this.model.password!;
    this.firebaseService.signInWithEmail(email, password)
    .then(() => {
      console.log("To Do");
    });
  }

  sendNewMemberEmailToMembershipChair(): void {
    let fromEmail = this.setupService.item.holmsEmail!;
    let fromName = "HOLMS";
    let toEmail = this.setupService.item.membershipChairEmail!;
    let toName = "Membership Chair";
    let subject = this.setupService.item.appSubTitle! + ' - New Member!';
    let text = '';

    let email = this.model.email!;
    let name = this.model.registrationName!;
    let street1 = this.model.street1!;
    let street2 = this.model.street2!;
    let city = this.model.city!;
    let state = this.model.state!;
    let zip = this.model.zip!;
    let country = this.model.country!;
    let body = this.emailService.toRegisterBody(email, name, street1, street2, city, state, zip, country);

    let sandboxMode = true;
   
    this.emailService.sendMailJetEmail(fromEmail, fromName, toEmail, toName, subject, text, body, sandboxMode)
    .subscribe({
      next: () => {
        this.ejToast = ToastUtility.show('Email sent!', 'Success', 2000) as ToastComponent;
      },
      error: (error:string) => {
        console.log(error);
        this.ejToast = ToastUtility.show('Error sending email!', 'Error', 2000) as ToastComponent;
      }
    });
  }

}
