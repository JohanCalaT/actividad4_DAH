import '../../../../../test-setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, provideRouter } from '@angular/router';
import { ToastController, provideIonicAngular, NavController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authServiceSpy: any;
  let routerSpy: any;
  let toastControllerSpy: any;
  let navCtrlSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      register: vi.fn(),
    };
    routerSpy = {
      navigate: vi.fn(),
    };
    navCtrlSpy = {
      back: vi.fn(),
      navigateBack: vi.fn(),
    };
    toastControllerSpy = {
      create: vi.fn().mockResolvedValue({
        present: vi.fn(),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterPage, ReactiveFormsModule],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: NavController, useValue: navCtrlSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('debe validar el formato del email', () => {
    const email = component.registerForm.controls['email'];
    email.setValue('invalid-email');
    expect(email.errors?.['email']).toBeTruthy();
  });

  it('debe llamar a authService.register y navegar al dashboard en caso de éxito', async () => {
    authServiceSpy.register.mockResolvedValue(undefined);
    component.registerForm.patchValue({ 
      email: 'new@test.com', 
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    await component.onSubmit();
    
    expect(authServiceSpy.register).toHaveBeenCalledWith('new@test.com', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
