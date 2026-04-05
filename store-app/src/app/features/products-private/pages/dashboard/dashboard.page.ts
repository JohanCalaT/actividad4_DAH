import { Component, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonCard,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  AlertController,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, logOutOutline, trashOutline, eyeOutline, cubeOutline, createOutline } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import type { Product } from '@core/services/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon,
    IonFab, IonFabButton,
    IonCard,
    IonInfiniteScroll, IonInfiniteScrollContent
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements ViewWillEnter {
  private router = inject(Router);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  products = signal<Product[]>([]);
  hasMore = signal(true);
  private lastDoc?: any;
  private readonly pageSize = 10;

  constructor() {
    addIcons({ addOutline, logOutOutline, trashOutline, eyeOutline, cubeOutline, createOutline });

    // Use effect to react to auth user changes and update the product signal
    effect(() => {
      const uid = this.authService.getCurrentUserId();
      if (uid) {
        this.initialLoad(uid);
      } else {
        this.products.set([]);
      }
    });
  }

  ionViewWillEnter() {
    const uid = this.authService.getCurrentUserId();
    if (uid) {
      this.initialLoad(uid);
    }
  }

  async initialLoad(uid: string) {
    const result = await this.productService.getUserProductsPage(uid, this.pageSize);
    this.products.set(result.products);
    this.lastDoc = result.lastDoc;
    this.hasMore.set(result.hasMore);
  }

  async loadMore(event: any) {
    const uid = this.authService.getCurrentUserId();
    if (!uid || !this.hasMore()) {
      event.target.complete();
      return;
    }

    const result = await this.productService.getUserProductsPage(uid, this.pageSize, this.lastDoc);
    this.products.update(prev => [...prev, ...result.products]);
    this.lastDoc = result.lastDoc;
    this.hasMore.set(result.hasMore);
    
    event.target.complete();
  }

  viewDetail(id: string) { this.router.navigate(['/product', id]); }
  goToAdd() { this.router.navigate(['/add-product']); }
  goToEdit(id: string) { this.router.navigate(['/edit-product', id]); }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/home']);
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmDelete(id: string, name: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Deseas eliminar "${name}"? Esta acción no se puede deshacer.`,
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.productService.deleteProduct(id);
            this.products.update(prev => prev.filter(p => p.id !== id));
            const toast = await this.toastController.create({
              message: 'Producto eliminado correctamente.',
              duration: 2500,
              color: 'success',
              position: 'bottom',
            });
            await toast.present();
          },
        },
      ],
    });
    await alert.present();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x225/1e1b4b/a78bfa?text=Sin+imagen';
  }
}
