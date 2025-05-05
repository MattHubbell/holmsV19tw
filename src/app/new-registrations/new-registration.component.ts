import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { GridModule, GridComponent, PageSettingsModel, PageService } from '@syncfusion/ej2-angular-grids';
import { TextBoxModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonAllModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule, DialogComponent, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { TabModule, TabComponent} from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ToastModule, ToastComponent, ToastUtility } from '@syncfusion/ej2-angular-notifications';

import { NewRegistration } from "./new-registration.model";
import { NewRegistrationService } from "./new-registration.service";
import { Countries } from '../common/countries';
import { MemberTypeService } from '../member-types/member-type.service';
import { Observable } from 'rxjs';
import { MemberType } from '../member-types/member-type.model';
import { MemberStatus } from '../member-status/member-status.model';
import { MemberStatusService } from '../member-status/member-status.service';
import { SetupService } from '../setup/setup.service';
import { MemberService } from '../members/member.service';
import { Member } from '../members/member.model';
import { MembershipUser, MembershipUserType } from '../membership-users/membership-user.model';
import { EmailService } from '../common/email.service';
import { FormErrorDirective } from '../common/form-error.directive';
import { UppercaseDirective } from '../common/uppercase.directive';
import * as f from '../common/functions';

@Component({
  selector: 'app-new-registrations',
  standalone: true,
  templateUrl: './new-registration.component.html',
  styleUrls: [ './new-registration.component.css' ],
  encapsulation: ViewEncapsulation.None,
  imports: [ CommonModule, FormsModule, GridModule, TextBoxModule, ButtonAllModule, CheckBoxModule, DialogModule, TabModule, DropDownListModule, NumericTextBoxModule, ToastModule, FormErrorDirective, UppercaseDirective ],
  providers: [PageService],
})
export class NewRegistrationComponent implements OnDestroy {

  @ViewChild('formData')
  formData?: NgForm;


  @ViewChild('ejDialog')
  ejDialog?: DialogComponent;

  @ViewChild('ejTab')
  ejTab?: TabComponent;

  @ViewChild('filteredGrid')
  filteredGrid?: GridComponent;

  @ViewChild('formMessage')
  formMessage!: ElementRef;

  ejToast?: ToastComponent;

  pageOptions?: PageSettingsModel;
  headerText: any = [{ text: "Address" }, { text: "Member Info" }, { text: "Search" }];
  salutations: any = [ "MR", "MRS", "MR & MRS", "MS", "DR" ];
  countries: any = Countries.map((rec) => rec.name.toUpperCase());
  countryFields: Object = { text: 'name'};
  selectedItem!: Observable<NewRegistration>;
  model: NewRegistration = new NewRegistration();
  memberTypeFields: Object = MemberType.MemberTypeFields;
  memberStatusFields: Object = MemberStatus.MemberStatusFields;
  filteredMemberList: any;
  deleteConfirmDlg: any;

  newRegistrationService: NewRegistrationService;
  memberTypeService: MemberTypeService;
  memberStatusService: MemberStatusService;
  setupService: SetupService;
  memberService: MemberService;
  emailService: EmailService;

  constructor() {
    this.newRegistrationService = inject(NewRegistrationService);
    this.newRegistrationService.getList();
    this.memberTypeService = inject(MemberTypeService);
    this.memberTypeService.getList();
    this.memberStatusService = inject(MemberStatusService);
    this.memberStatusService.getList();
    this.setupService = inject(SetupService);
    this.setupService.getItem();
    this.memberService = inject(MemberService);
    this.memberService.getList();
    this.emailService = inject(EmailService);
  }

  ngOnDestroy(): void {
    this.newRegistrationService.unsubscribe();
  }

  onOpenDialog(event:any): void {
    this.selectedItem = event.data;
    this.model = NewRegistration.clone(event.data);
    this.filterMembers();
    this.ejTab?.select(0);
    this.formMessage.nativeElement.textContent = "";
    this.ejDialog!.show();
  };

  onAssignMemberNo():void {
    this.model.memberNo = this.setupService.item.nextMemberNo!.toString();
  }

  onRowClick(event:any) {
    const member:Member = event.data;
    this.model.memberNo = member.memberNo;
    this.model.arBook = member.arBook;
    this.model.hgBook = member.hgBook;
    this.model.meBook = member.meBook;
    this.model.memberStatus = member.memberStatus;
    this.model.memberType = member.memberType;
    this.model.lastDuesYear = member.lastDuesYear;
    this.model.sortName = member.sortName;
    this.ejTab?.select(1);
}

  filterMembers(): void {
    const name: any = this.model.registrationName;
    this.filteredMemberList = this.memberService.list.filter((item:any) => f.filterBy(name, item.memberName, 'hubbell, hubble') == true)
    console.log(this.filteredMemberList);
  }

  onDelete() {
    this.deleteConfirmDlg = DialogUtility.confirm({
      title: 'Delete Registration',
      content: "Are you sure you want to delete this registration?",
      position: { X: 'center', Y: 'center' },
      okButton: {  text: 'OK', click: this.deleteRegistration.bind(this) },
      showCloseIcon: true,
      closeOnEscape: true,
      height: '200px',
      width: '400px',
      animationSettings: { effect: 'Zoom' }
    });
  }

  deleteRegistration(obj:any): void {
    // this.newRegistrationService.deleteItem(this.selectedItem);
    console.log("registration deleted");
    this.deleteConfirmDlg.hide();
  };

  onSubmit(form:NgForm) {
    if(form.invalid) {
      this.formMessage.nativeElement.textContent = "Check for errors.";
      return;
    }

    this.formMessage.nativeElement.textContent = "";

    let selectedMember:any;

    if (this.model.memberNo == '') {
        this.newRegistrationService.updateItem(this.selectedItem, this.model);
        this.ejToast = ToastUtility.show('New Registration updated', 'Success', 2000) as ToastComponent;
        this.ejDialog?.hide();
        return;
    }

    let message:string;
    let member:any = this.memberService.list.find((x:any) => x.memberNo == this.model.memberNo);

    if (member) {
        selectedMember = this.memberService.getItemByKey(member['key']);
        // this.updateMember(this.model, member);
        message = "Member updated";
    } else {
        // this.addMember(this.model);
        message = "Member added";
    }

    this.sendAckowledgmentEmail();

    let membershipUser:MembershipUser = new MembershipUser();
    membershipUser.memberId = this.model.memberNo;
    membershipUser.userType = MembershipUserType.Member;
    // this.membershipUserService.updateObject(this.selectedMembership, this.key ,this.membershipUser);
    // this.newRegistrationService.deleteItem(this.selectedItem);

    this.setupService.item.nextMemberNo! += 1;
    // this.setupService.updateItem(this.setupService.list);

    this.ejToast = ToastUtility.show(message, 'Success', 2000) as ToastComponent;
    this.ejDialog?.hide();
  }

  addMember(newRegistration: NewRegistration) {
    let member: Member = new Member();
    member.memberNo = newRegistration.memberNo!;
    member.oldMemberNo = 0;
    member.salutation = newRegistration.salutation!;
    member.memberName = newRegistration.registrationName!;
    member.addrLine1 = newRegistration.street1!;
    member.addrLine2 = newRegistration.street2!;
    member.city = newRegistration.city!;
    member.state = newRegistration.state!;
    member.zip = newRegistration.zip!;
    member.country = newRegistration.country!;
    member.phone = newRegistration.phone!;
    member.hgBook = newRegistration.hgBook!;
    member.arBook = newRegistration.arBook!;
    member.meBook = newRegistration.meBook!;
    member.annualName = newRegistration.annualName!;
    member.sortName = newRegistration.sortName!;
    member.lastDuesYear = newRegistration.lastDuesYear!;
    member.startYear = +(new Date().getFullYear);
    member.memberType = newRegistration.memberType!;
    member.memberStatus = newRegistration.memberStatus!;
    member.eMailAddr = newRegistration.email!;
    member.fax = '';
    member.comments = '';
    member.isAlternateAddress = false;
    member.giftFromMember = '';
    member.printCertification = false;
    // member.certificationDate = null;
    // this.memberService.addItem(member);
}

updateMember(newRegistration: NewRegistration, member: any) {
    member.memberNo = newRegistration.memberNo!;
    member.salutation = newRegistration.salutation!;
    member.memberName = newRegistration.registrationName!;
    member.addrLine1 = newRegistration.street1!;
    member.addrLine2 = newRegistration.street2!;
    member.city = newRegistration.city!;
    member.state = newRegistration.state!;
    member.zip = newRegistration.zip!;
    member.country = newRegistration.country!;
    member.phone = newRegistration.phone!;
    member.hgBook = newRegistration.hgBook!;
    member.arBook = newRegistration.arBook!;
    member.meBook = newRegistration.meBook!;
    member.annualName = newRegistration.annualName!;
    member.sortName = newRegistration.sortName!;
    member.lastDuesYear = newRegistration.lastDuesYear!;
    member.memberType = newRegistration.memberType!;
    member.memberStatus = newRegistration.memberStatus!;
    member.eMailAddr = newRegistration.email!;
    // this.memberService.updateItem(member, member);
}

sendAckowledgmentEmail(): void {
    const body: string = this.emailService.toAcknowledgementBody(this.model.registrationName!, this.setupService.item.regEmailMessage!);
    let fromEmail = this.setupService.item.holmsEmail!;
    let fromName = "Membership Chair";
    let toEmail = this.model.email!;
    let toName = this.model.registrationName!;
    let subject = this.setupService.item.appSubTitle + ' - Welcome Member!';
    let text = '';
    let sandboxMode = true;
    this.emailService.sendMailJetEmail(fromEmail, fromName, toEmail, toName, subject, text, body, sandboxMode)
    .subscribe({
      next: (message:string) => {
        this.ejToast = ToastUtility.show(message, 'Email sent', 2000) as ToastComponent;
      },
      error: (error:string) => {
        this.ejToast = ToastUtility.show(error, 'Error sending email', 2000) as ToastComponent;
      }
    });
  }
}
