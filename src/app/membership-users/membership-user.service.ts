import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';
import { MembershipUser } from './membership-user.model';

@Injectable({
  providedIn: 'root',
})
export class MembershipUserService {

  list: any;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getList(): void {
    this.firebaseService.getDynamicListWithCallback(MembershipUser.TableName,(records) => {
      this.list = records;
    });
  }

  getItem(callback: (data: any)=> void): void {
    this.firebaseService.getDynamicItemWithCallback(MembershipUser.TableName, (record) => {
      callback(record);
    });
  }

  addItem(key:string, model: MembershipUser): void {
    let data = MembershipUser.setData(model);
    this.firebaseService.addObject(MembershipUser.TableName + '/' + key, data);
}

  updateItem(item:any, model:MembershipUser): void {
      let data = MembershipUser.setData(model);
      this.firebaseService.updateItem(MembershipUser.TableName, item.key, data);
  }

  deleteItem(item:any): void {
    this.firebaseService.deleteItem(MembershipUser.TableName, item.key);
}

  unsubscribe(): void {
    this.firebaseService.unsubscribe();
  }
}
