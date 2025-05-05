import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../common/firebase.service';
import { Setup } from './setup.model';

@Injectable({
  providedIn: 'root',
})
export class SetupService {

  item!: Setup;
  private firebaseService: FirebaseService

  constructor() {
    this.firebaseService = inject(FirebaseService);
  }

  getItem(): void {
      this.firebaseService.getDynamicItemWithCallback(Setup.TableName,(record) => {
        this.item = record;
      });
    }
  

  getItemWithCallback(callback: (data: any)=> void): void {
    this.firebaseService.getDynamicItemWithCallback(Setup.TableName, (record) => {
      callback(record);
    });
  }

  addItem(model: Setup) {
      let data = Setup.setData(model);
      this.firebaseService.addObject(Setup.TableName, data);
  }

  updateItem(model: Setup) {
      let data = Setup.setData(model);
      this.firebaseService.updateObject(Setup.TableName, data);
  }
}
