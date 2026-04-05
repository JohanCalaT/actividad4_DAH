import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, imagesOutline, chevronDownOutline } from 'ionicons/icons';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/services/product.model';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { signal } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonSpinner,
    IonInfiniteScroll, IonInfiniteScrollContent
  ],
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements ViewWillEnter {
  private router = inject(Router);
  private productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly hasMore = signal(true);
  private lastDoc?: QueryDocumentSnapshot;
  private readonly pageSize = 10;

  constructor() {
    addIcons({ arrowBackOutline, imagesOutline, chevronDownOutline });
    this.initialLoad();
  }

  ionViewWillEnter() {
    this.initialLoad();
  }

  async initialLoad() {
    const result = await this.productService.getProductsPage(this.pageSize);
    this.products.set(result.products);
    this.lastDoc = result.lastDoc;
    this.hasMore.set(result.hasMore);
  }

  async loadMore(event: any) {
    if (!this.hasMore()) {
      event.target.complete();
      return;
    }

    const result = await this.productService.getProductsPage(this.pageSize, this.lastDoc);
    this.products.update(prev => [...prev, ...result.products]);
    this.lastDoc = result.lastDoc;
    this.hasMore.set(result.hasMore);
    
    event.target.complete();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  viewDetail(id: string) {
    this.router.navigate(['/product', id]);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x225/1e1b4b/a78bfa?text=Sin+imagen';
  }
}
