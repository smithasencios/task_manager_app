import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { from, tap, catchError, of, Observable, Subject, shareReplay } from 'rxjs';
import { getApp } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.userSignal());

  private readonly readySub = new Subject<void>();
  readonly authReady$ = this.readySub.asObservable().pipe(shareReplay(1));

  constructor() {
    try {
      const auth = getAuth(getApp());
      let first = true;
      onAuthStateChanged(auth, (u) => {
        this.userSignal.set(u);
        if (first) {
          first = false;
          this.readySub.next();
          this.readySub.complete();
        }
      });
    } catch {
      this.userSignal.set(null);
      this.readySub.next();
      this.readySub.complete();
    }
  }

  private get auth() {
    return getAuth(getApp());
  }

  signUp(email: string, password: string): Observable<{ user: User } | null> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(({ user: u }) => {
        this.userSignal.set(u);
        this.router.navigate(['/']);
      }),
      catchError((err) => {
        console.error('Sign up error', err);
        throw err;
      })
    );
  }

  signIn(email: string, password: string): Observable<{ user: User } | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(({ user: u }) => {
        this.userSignal.set(u);
        this.router.navigate(['/']);
      }),
      catchError((err) => {
        console.error('Sign in error', err);
        throw err;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.userSignal.set(null);
        this.router.navigate(['/auth']);
      }),
      catchError((err) => {
        console.error('Logout error', err);
        return of(undefined);
      })
    );
  }

  async getIdToken(): Promise<string | null> {
    const u = this.auth.currentUser;
    return u ? u.getIdToken() : null;
  }
}
