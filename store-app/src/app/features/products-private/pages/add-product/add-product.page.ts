import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, cloudUploadOutline, imageOutline } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon, IonSpinner,
  ],
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private toastController = inject(ToastController);

  readonly isLoading = signal(false);
  readonly imagePreview = signal<string | null>(null);
  readonly isEditMode = signal(false);
  private productId: string | null = null;

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
  });

  constructor() {
    addIcons({ arrowBackOutline, cloudUploadOutline, imageOutline, saveOutline: 'save-outline' });
  }

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode.set(true);
      this.loadProduct(this.productId);
    }
  }

  private async loadProduct(id: string) {
    this.isLoading.set(true);
    try {
      this.productService.getProductById(id).subscribe({
        next: (product: any) => {
          if (product) {
            this.productForm.patchValue({
              name: product.name,
              description: product.description,
              imageUrl: product.imageUrl
            });
            this.imagePreview.set(product.imageUrl);
          }
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } catch {
      this.isLoading.set(false);
    }
  }

  hasError(field: string): boolean {
    const ctrl = this.productForm.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  onUrlInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();
    // Only update preview if URL looks valid
    if (url.startsWith('http') || url.startsWith('https')) {
      this.imagePreview.set(url);
    } else {
      this.imagePreview.set(null);
    }
  }

  onPreviewError(event: Event) {
    this.imagePreview.set(null);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  async onSubmit() {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) return;

    const uid = this.authService.getCurrentUserId();
    const userEmail = this.authService.getCurrentUserEmail();
    if (!uid) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading.set(true);
    try {
      const { name, description, imageUrl } = this.productForm.value;
      const productData: any = { 
        name, 
        description, 
        imageUrl, 
        userId: uid,
        userEmail: userEmail ?? undefined 
      };

      if (this.isEditMode() && this.productId) {
        await this.productService.updateProduct(this.productId, productData);
      } else {
        await this.productService.addProduct(productData);
      }

      const toast = await this.toastController.create({
        message: this.isEditMode() ? '¡Producto actualizado!' : '¡Producto añadido!',
        duration: 2500,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();
      this.router.navigate(['/dashboard']);
    } catch {
      const toast = await this.toastController.create({
        message: 'Error al guardar el producto. Inténtalo de nuevo.',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
    } finally {
      this.isLoading.set(false);
    }
  }
}
