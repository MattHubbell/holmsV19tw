import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TextBoxModule, TextBoxComponent, TextAreaModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { EmailService }     from '../common/email.service';
import { Setup }            from './setup.model';
import { SetupService }     from './setup.service';
// import { TitleService }     from '../../title.service';
// import { MatSnackBar }      from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-setup',
  standalone: true,
	templateUrl: './setup.component.html',
	styleUrls: [ './setup.component.css' ],
  imports: [ FormsModule, TextBoxModule, TextAreaModule, ButtonModule ],
})
export class SetupComponent implements OnInit, OnDestroy {

    model: Setup;
    isNewItem: boolean;
    selectedItem: any;
    emailMsg: string;
    // subscription: Subscription;

    constructor(
        private setupService: SetupService,
        private emailService: EmailService,
        // private titleService: TitleService,
        // public snackBar: MatSnackBar
    ) {
        this.model = new Setup();
        this.isNewItem = true;
        this.emailMsg = '';
        this.setupService.getItemWithCallback((record:any) => {
          this.selectedItem = record;
          this.model = Setup.clone(this.selectedItem);
          this.isNewItem = false;
        });
    }

    ngOnInit() {
        this.resetForm();
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }

    resetForm() {
        let yearRegEx = `^(20)[0-9]{2}$`;
    }

    onSubmit(form: NgForm) {
        let model:Setup = new Setup(this.model.duesYear);
        if(!form.valid) {
            return;
        }

        if (!this.isNewItem) {
          console.log('Original: ');
          console.log(this.selectedItem);
          console.log('Updated: ');
          console.log(this.model);
        }

        // if (this.isNewItem) {
        //     this.setupService.addItem(model);
        // } else {
        //     this.setupService.updateItem(this.model);
        // }
        // this.snackBar.open("Setup updated","", {
        //     duration: 2000,
        // });
    }

    onTestInvoiceEmail() {
      this.emailMsg = 'Sending Email...';
      let paidThruDate: string = new Date().toLocaleDateString();
      const body = this.emailService.toInvoiceBody('Membership Chair', 'FOUNDATION', 'MUSEUM LIBRARY', 'SCHOLARSHIP' , paidThruDate, 'COMMENTS', 1, 20, 10, 5, 15);
      this.emailService.sendMailJetEmail(this.model.holmsEmail!.toString(), "Membership Chair", this.model.membershipChairEmail!.toString(), "Matthew Hubbell", this.model.appSubTitle + ' - Test Dues Acknowledgment', '', body, false )
      .subscribe({
        next: (message:string) => this.emailMsg = message,
        error: (error:string) => this.emailMsg = error
    });

    }

  onTestEmail(): void {
    this.emailMsg = 'Sending Email...';
    this.emailService.sendMailJetEmail(this.model.holmsEmail!.toString(), "Membership Chair", this.model.membershipChairEmail!.toString(), "Matthew Hubbell", 'Test NodeMailJet', `Hello Matt Hubbell, This is a Text of nodeMailJet3`, `Hello Matt Hubbell, This is a Text of nodeMailJet3`, true )
      .subscribe({
        next: (message:string) => this.emailMsg = message,
        error: (error:string) => this.emailMsg = error
    });
  }
}
