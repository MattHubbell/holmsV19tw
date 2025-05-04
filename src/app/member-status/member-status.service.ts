import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';
import { MemberStatus } from "./member-status.model";

@Injectable({
  providedIn: 'root',
})
export class MemberStatusService {

  list: any;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getList(): void {
    this.firebaseService.getDynamicListWithCallback(MemberStatus.TableName,(records) => {
      this.list = records;
    });
  }

  getItem(callback: (data: any)=> void): void {
    this.firebaseService.getDynamicItemWithCallback(MemberStatus.TableName, (record) => {
      callback(record);
    });
  }

  addItem(model: MemberStatus) {
      let data = MemberStatus.setData(model);
      this.firebaseService.addObject(MemberStatus.TableName, data);
  }

  updateItem(model: MemberStatus) {
      let data = MemberStatus.setData(model);
      this.firebaseService.updateObject(MemberStatus.TableName, data);
  }

  unsubscribe(): void {
    this.firebaseService.unsubscribe();
  }
}
