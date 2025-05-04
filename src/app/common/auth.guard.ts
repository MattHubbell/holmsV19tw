import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);


  return firebaseService.user.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    })
  );
};
