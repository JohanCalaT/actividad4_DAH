import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gridOutline, logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private router = inject(Router);

  constructor() {
    addIcons({ gridOutline, logInOutline });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
