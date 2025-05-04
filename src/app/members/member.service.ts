import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';
import { Member } from "./member.model";

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  list: any;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getList(): void {
    this.firebaseService.getDynamicListWithCallback(Member.TableName,(records) => {
      this.list = records;
    });
  }

  getItem(callback: (data: any)=> void): void {
    this.firebaseService.getDynamicItemWithCallback(Member.TableName, (record) => {
      callback(record);
    });
  }

  getItemByKey(key:any): any {
    return this.firebaseService.getItemByKey(Member.TableName, key, (record)=> {
      return record;
    });
}

  addItem(model: Member): void { 
      let data = Member.setData(model);
      this.firebaseService.addItem(Member.TableName, data);
  }
  
  updateItem(item:any, model:Member): void {
      let data = Member.setData(model);
      this.firebaseService.updateItem(Member.TableName, item.key, data);
  }

  deleteItem(item:any): void {
    this.firebaseService.deleteItem(Member.TableName, item.key);
  }

  unsubscribe(): void {
    this.firebaseService.unsubscribe();
  }
}
