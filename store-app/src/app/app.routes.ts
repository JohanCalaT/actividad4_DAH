import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/products-public/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products-public/pages/product-list/product-list.page').then(
        (m) => m.ProductListPage,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products-private/pages/dashboard/dashboard.page').then(
        (m) => m.DashboardPage,
      ),
  },
  {
    path: 'product/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products-private/pages/product-detail/product-detail.page').then(
        (m) => m.ProductDetailPage,
      ),
  },
  {
    path: 'add-product',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products-private/pages/add-product/add-product.page').then(
        (m) => m.AddProductPage,
      ),
  },
  {
    path: 'edit-product/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products-private/pages/add-product/add-product.page').then(
        (m) => m.AddProductPage,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
