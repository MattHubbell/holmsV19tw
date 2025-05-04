import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';
import { NewRegistration } from "./new-registration.model";

@Injectable({
  providedIn: 'root',
})
export class NewRegistrationService {

  list: any;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getList(): void {
    this.firebaseService.getDynamicListWithCallback(NewRegistration.TableName,(records) => {
      this.list = records;
    });
  }

  getItem(callback: (data: any)=> void): void {
    this.firebaseService.getDynamicItemWithCallback(NewRegistration.TableName, (record) => {
      callback(record);
    });
  }

  addItem(key:string, model: NewRegistration): void { 
    let data = NewRegistration.setData(model);
    this.firebaseService.addObject(NewRegistration.TableName + '/' + key, data);
}

  updateItem(item:any, model:NewRegistration): void {
      let data = NewRegistration.setData(model);
      this.firebaseService.updateItem(NewRegistration.TableName, item.key, data);
  }

  deleteItem(item:any): void {
    this.firebaseService.deleteItem(NewRegistration.TableName, item.key);
}

  unsubscribe(): void {
    this.firebaseService.unsubscribe();
  }
}
