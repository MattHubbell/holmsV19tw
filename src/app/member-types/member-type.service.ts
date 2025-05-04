import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';
import { MemberType } from "./member-type.model";

@Injectable({
  providedIn: 'root',
})
export class MemberTypeService {

  list: any;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getList(): void {
    this.firebaseService.getDynamicListWithCallback(MemberType.TableName,(records) => {
      this.list = records;
    });
  }

  getItem(callback: (data: any)=> void): void {
    this.firebaseService.getDynamicItemWithCallback(MemberType.TableName, (record) => {
      callback(record);
    });
  }

  addItem(model: MemberType) {
      let data = MemberType.setData(model);
      this.firebaseService.addObject(MemberType.TableName, data);
  }

  updateItem(model: MemberType) {
      let data = MemberType.setData(model);
      this.firebaseService.updateObject(MemberType.TableName, data);
  }

  unsubscribe(): void {
    this.firebaseService.unsubscribe();
  }
}
