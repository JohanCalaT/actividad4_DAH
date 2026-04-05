import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import type { User } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  // Convert the auth state observable to a Signal
  private _user = toSignal(user(this.auth), { initialValue: null });

  readonly currentUser = computed<User | null>(() => this._user());
  readonly isAuthenticated = computed(() => this._user() !== null);

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUserId(): string | null {
    return this._user()?.uid ?? null;
  }

  getCurrentUserEmail(): string | null {
    return this._user()?.email ?? null;
  }
}
