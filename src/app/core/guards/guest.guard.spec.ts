import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';

describe('guestGuard', () => {
  let authService: { isLoggedIn: ReturnType<typeof vi.fn>; authReady$: Observable<void> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      isLoggedIn: vi.fn(),
      authReady$: of(undefined),
    };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should allow access when user is not logged in', async () => {
    authService.isLoggedIn.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() => guestGuard(null!, null!)) as Observable<boolean>;
    const allowed = await firstValueFrom(result);
    expect(allowed).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to / when user is logged in', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => guestGuard(null!, null!)) as Observable<boolean>;
    const allowed = await firstValueFrom(result);
    expect(allowed).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
