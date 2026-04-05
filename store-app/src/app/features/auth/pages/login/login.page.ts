import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonBackButton,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';
import { FirebaseError } from '@angular/fire/app';

function mapFirebaseError(code: string): { type: 'inline' | 'toast'; message: string } {
  switch (code) {
    case 'auth/user-not-found':
      return { type: 'toast', message: 'No existe ninguna cuenta con ese email. Por favor regístrate primero.' };
    case 'auth/invalid-credential':
      return { type: 'toast', message: 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.' };
    case 'auth/wrong-password':
      return { type: 'toast', message: 'La contraseña introducida es incorrecta. Inténtalo de nuevo.' };
    case 'auth/too-many-requests':
      return { type: 'toast', message: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos. Espera unos minutos.' };
    case 'auth/network-request-failed':
      return { type: 'toast', message: 'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.' };
    default:
      return { type: 'toast', message: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.' };
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonContent,
    IonButton, IonIcon, IonSpinner, IonButtons, IonBackButton
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline, arrowBackOutline });
  }

  get emailHasError(): boolean {
    const ctrl = this.loginForm.get('email');
    return !!(ctrl?.invalid && ctrl.touched);
  }

  get passwordHasError(): boolean {
    const ctrl = this.loginForm.get('password');
    return !!(ctrl?.invalid && ctrl.touched);
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      const fbError = error as FirebaseError;
      const mapped = mapFirebaseError(fbError.code ?? '');
      await this.showToast(mapped.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color: 'danger',
      cssClass: 'custom-toast',
      buttons: [{ icon: 'close', role: 'cancel' }],
    });
    await toast.present();
  }
}
