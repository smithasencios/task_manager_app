import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.authReady$.pipe(
    take(1),
    map(() => !auth.isLoggedIn()),
    tap((allow) => {
      if (!allow) router.navigate(['/']);
    })
  );
};
