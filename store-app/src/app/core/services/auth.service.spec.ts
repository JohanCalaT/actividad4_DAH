import '../../../test-setup';
import { TestBed } from '@angular/core/testing';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

// Mock Firebase Auth functions
vi.mock('@angular/fire/auth', async (importOriginal) => {
  const original = await importOriginal<typeof import('@angular/fire/auth')>();
  return {
    ...original,
    Auth: class {},
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    user: vi.fn(() => of(null)), // Default to not authenticated
  };
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: { currentUser: null } },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('debe iniciar con el usuario como null', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('debe llamar a signInWithEmailAndPassword durante el login', async () => {
    const email = 'test@test.com';
    const password = 'password';
    
    await service.login(email, password);
    
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
  });

  it('debe llamar a signOut durante el logout', async () => {
    await service.logout();
    expect(signOut).toHaveBeenCalled();
  });

  it('debe devolver null si el usuario no tiene uid al llamar a getCurrentUserId', () => {
    expect(service.getCurrentUserId()).toBeNull();
  });

  it('debe llamar a createUserWithEmailAndPassword durante el registro', async () => {
    const email = 'newuser@test.com';
    const password = 'password123';
    
    await service.register(email, password);
    
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), email, password);
  });
});
