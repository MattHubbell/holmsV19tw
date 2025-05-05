import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseService: FirebaseService;
  router: Router;

  constructor() {
    this.firebaseService = inject(FirebaseService);
    this.router = inject(Router);
  }

  canActivate(): boolean {
    if (this.firebaseService.authenticated) {
      if (this.firebaseService.currentUser) {
        return true;
      }
    }

    this.router.navigate(['']);
    return false;
  }

}
