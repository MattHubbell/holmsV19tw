import { inject, Injectable } from '@angular/core';
import { FirebaseApp, } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail, user, User, updateProfile } from '@angular/fire/auth';
import { getDatabase, ref, get, set, onValue, DataSnapshot, off, update, push, query, equalTo } from '@angular/fire/database';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';
import { TimeMaskPlaceholder } from '@syncfusion/ej2-angular-calendars';
import { orderByChild, remove } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  private readonly database;
  private readonly auth;

  private dataRef: any;
  private listener: any;

  constructor() {
    this.database = getDatabase(inject(FirebaseApp));
    this.auth = getAuth();
  }

  /* Login */

  get firebaseAuth(): any {
    return this.auth;
  }

  get authenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  get currentUser(): any {
    return this.auth.currentUser;
  }

// signInWithGoogle(): Promise<any> {
//     return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
// }

// signInWithFacebook(): Promise<any> {
//     return this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
// }

signInWithEmail(email:string, password:string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
}

async resetPassword(email:string): Promise<any> {
    try {
        await sendPasswordResetEmail(this.auth, email);
        console.log('Password Reset Email successfully sent');
    }
    catch (error) {
        console.log(error);
    }
}

async changeEmail(email: string): Promise<any> {
  try {
      await updateEmail(this.auth.currentUser!, email);
      console.log('Email successfully updated');
  }
  catch (error) {
      console.log(error);
      return Promise.reject(error);
  }
}

  async updateUserProfile(displayName: string): Promise<any> {
    try {
        await updateProfile(this.auth.currentUser!,{displayName: displayName, photoURL: ''});
        console.log('Profile successfully updated');
    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
  }

  createUser(email:string, password:string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // createFacebookUser(): any {
  //     firebase.auth().getRedirectResult().then(result => {
  //         if(result.credential) {
  //             let token = result.credential.;
  //         }
  //         let user = result.user;
  //     });
  //     let provider = new firebase.auth.FacebookAuthProvider();
  //     return this.afAuth.auth.signInWithRedirect(provider);
  // }

  logout() {
    this.auth.signOut();
  }

  /* Lists */

   getDynamicListWithCallback(tableName: string, callback: (data: any)=> void): void {
    this.consoleLog(`${tableName}: get Dynamic List`);
    this.dataRef = ref(this.database, tableName);
    this.listener = onValue(this.dataRef, (snapshot) => {
      this.consoleLog(`${tableName}: Dynamic List`);
      callback(this.getSnapshotData(snapshot));
    });
  }

  async getDynamicItem(tableName: string): Promise<any> {
    this.consoleLog(`${tableName}: get Dynamic Item`);
    this.dataRef = ref(this.database, tableName);
    this.listener = onValue(this.dataRef, (snapshot) => {
      this.consoleLog(`${tableName}: Dynamic Item`);
      this.consoleLog(snapshot.val());
      return(snapshot.val());
    });
  }

  getDynamicItemWithCallback(tableName: string, callback: (data: any)=> void): void {
    this.consoleLog(`${tableName}: get Dynamic Item`);
    this.dataRef = ref(this.database, tableName);
    this.listener = onValue(this.dataRef, (snapshot) => {
      this.consoleLog(`${tableName}: Dynamic Item`);
      this.consoleLog(snapshot.val());
      callback(snapshot.val());
    });
  }

  getSnapshotData(snapshot: DataSnapshot): any {
    const data = snapshot.val();
    const dataList = [];
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          dataList.push({
            key: key,
            ...data[key]
          });
        }
      }
    }
    this.consoleLog(dataList);
    return dataList;
  }

  unsubscribe(): void {
    off(this.dataRef, 'value', this.listener);
  }

  /* table with multiple records */

  getItem(tableName:string, field:string = '', value:string = '', callback: (data: any)=> void): any {
    const dataRef = ref(this.database, tableName);
    if (field.length > 0 && value.length > 0) {
      const record = query(dataRef, orderByChild(field), equalTo(value));
      get(record).then((snapshot:any) => {
        callback(this.getSnapshotData(snapshot)[0]);
      });
    }
  }

  getItemByKey(tableName:string, key: any, callback: (data: any)=> void): any {
    let dataRef = ref(this.database, tableName+ "/" + key);
    let record = query(dataRef);
    get(record).then((snapshot:any) => {
      callback(this.getSnapshotData(snapshot)[0]);
    });
  }


//   private getItemsRef(tableName:string, child:string = '', equalTo:string = ''): AngularFireList<any>{
//     if (child.length > 0 && equalTo.length > 0) {
//         return this.db.list(tableName, ref => ref.orderByChild(child).equalTo(equalTo));
//     }
//     if (child.length > 0) {
//         return this.db.list(tableName, ref => ref.orderByChild(child));
//     }
//     return this.db.list(tableName);
// }

//   getItemsAsync(tableName:string, child:string = '', equalTo:string = '') {
//     return this.getItemsRef(tableName, child, equalTo).snapshotChanges().pipe(
//         map(changes => (
//             changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
//         ))
//     ).take(1).toPromise();
// }

  addItem(tableName:string, data:any) {
    this.consoleLog(`Add ${tableName} data: ${JSON.stringify(data)}`);
    this.dataRef = push(ref(this.database, tableName));
    set(this.dataRef, data)
      .then(() => console.log(`${tableName} added`))
      .catch((err:any) => console.log(`${tableName} error: ${err}`));
  }

  updateItem(tableName:string, key:string, data:any): void {
    this.consoleLog(`Update ${tableName} key: ${key} data: ${JSON.stringify(data)}`);
    this.dataRef = ref(this.database, tableName + "/" + key);
    set(this.dataRef, data)
      .then(() => console.log(`${tableName} updated`))
      .catch((err:any) => console.log(`${tableName} error: ${err}`));
}

  deleteItem(tableName:string, key:string): void {
    this.consoleLog(`Delete ${tableName} key: ${key}`);
    this.dataRef = ref(this.database, tableName + "/" + key);
    remove(this.dataRef)
      .then(() => console.log(`${tableName} deleted`))
      .catch((err:any) => console.log(`${tableName} error: ${err}`));
}

  /* Table with one record i.e. Setup */

  addObject(objectName:string, data:any): void {
    this.consoleLog(`Add ${objectName} data: ${JSON.stringify(data)}`);
    set(ref(this.database, objectName), data)
      .then(_ => console.log(objectName + ' added'))
      .catch(err => console.log(objectName + ' error: ' + err));
  }

  updateObject(objectName:string, data:any): void {
    this.consoleLog(`Update ${objectName} data: ${JSON.stringify(data)}`);
    update(ref(this.database, objectName), data)
    .then(_ => console.log(objectName + ' updated'))
    .catch(err => console.log(objectName + ' error: ' + err));
  }

  private consoleLog(text: any) {
    if (environment.production) {
        return;
    }
    console.log(text);
  }
}
