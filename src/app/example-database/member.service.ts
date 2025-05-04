import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  tableName: string = 'members';
  primaryID: string = 'memberNo';
  list: any;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getList(): void {
    this.firebaseService.getDynamicListWithCallback(this.tableName,(records) => {
      this.list = records;
    });
  }

  unsubscribe(): void {
    this.firebaseService.unsubscribe();
  }

}

export type Member = {
  memberNo: string;
  oldMemberNo: number;
  sortName: string;
  salutation: string;
  memberName: string;
  addrLine1: string;
  addrLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  hgBook: string;
  arBook: string;
  meBook: string;
  annualName: string;
  lastDuesYear: number;
  startYear: number;
  anniversary: Date;
  paidThruDate: Date;
  memberType: string;
  memberStatus: string;
  eMailAddr: string;
  fax: string;
  comments: string;
  isAlternateAddress: boolean;
  giftFromMember: string;
  printCertification: boolean;
  certificationDate: Date;
};

