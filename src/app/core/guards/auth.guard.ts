import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.authReady$.pipe(
    take(1),
    map(() => auth.isLoggedIn()),
    tap((ok) => {
      if (!ok) router.navigate(['/auth']);
    })
  );
};
