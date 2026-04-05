import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, personOutline, createOutline, trashOutline } from 'ionicons/icons';
import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon,
    IonChip, IonLabel,
  ],
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  product = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') ?? '';
        return this.productService.getProductById(id);
      }),
    ),
    { initialValue: undefined },
  );

  isOwner = computed(() => {
    const prod = this.product();
    const currentUid = this.authService.getCurrentUserId();
    return prod && currentUid ? prod.userId === currentUid : false;
  });

  constructor() {
    addIcons({ arrowBackOutline, personOutline, createOutline, trashOutline });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x450/1e1b4b/a78bfa?text=Sin+imagen';
  }

  editProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.router.navigate(['/edit-product', id]);
    }
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteProduct();
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      await this.productService.deleteProduct(id);
      const toast = await this.toastController.create({
        message: 'Producto eliminado correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al eliminar el producto',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }
}
