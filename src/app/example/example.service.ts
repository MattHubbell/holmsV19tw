import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';
import { Example } from "./example.model";

@Injectable({
  providedIn: 'root',
})
export class ExampleService {

  list: any;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getList(): void {
    this.firebaseService.getDynamicListWithCallback(Example.TableName,(records) => {
      this.list = records;
    });
  }

  getItem(callback: (data: any)=> void): void {
    this.firebaseService.getDynamicItemWithCallback(Example.TableName, (record) => {
      callback(record);
    });
  }

  getItemByFieldValue(field:string, value:string, callback: (data: any)=> void): void {
    return this.firebaseService.getItem(Example.TableName, field, value, (record) => {
      callback(record);
    });
  }

  addItem(model:Example): void { 
    let data = Example.setData(model);
    this.firebaseService.addItem(Example.TableName, data);
}

  updateItem(key:any, model:Example): void {
    let data = Example.setData(model);
    this.firebaseService.updateItem(Example.TableName, key, data);
  }

  deleteItem(key:any): void {
    this.firebaseService.deleteItem(Example.TableName, key);
}

  unsubscribe(): void {
    this.firebaseService.unsubscribe();
  }
}
