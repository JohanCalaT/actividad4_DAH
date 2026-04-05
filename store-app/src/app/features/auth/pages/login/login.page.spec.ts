import '../../../../../test-setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginPage } from './login.page';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastController, provideIonicAngular } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: any;
  let routerSpy: any;
  let toastControllerSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn(),
    };
    routerSpy = {
      navigate: vi.fn(),
    };
    toastControllerSpy = {
      create: vi.fn().mockResolvedValue({
        present: vi.fn(),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule],
      providers: [
        provideIonicAngular(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and navigate on success', async () => {
    authServiceSpy.login.mockResolvedValue(undefined);
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password' });
    await component.onSubmit();
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@test.com', 'password');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
