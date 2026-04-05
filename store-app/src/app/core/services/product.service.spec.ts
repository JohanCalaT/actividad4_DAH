import '../../../test-setup';
import { TestBed } from '@angular/core/testing';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, docData, query, where } from '@angular/fire/firestore';
import { firstValueFrom, of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from './product.service';

// Mock Firebase Firestore functions
vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const original = await importOriginal<typeof import('@angular/fire/firestore')>();
  return {
    ...original,
    Firestore: class {},
    collection: vi.fn(),
    collectionData: vi.fn(() => of([])), // Return empty array by default
    doc: vi.fn(),
    docData: vi.fn(() => of(null)),
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: Firestore, useValue: { type: 'firestore' } },
      ],
    });
    service = TestBed.inject(ProductService);
  });

  it('debe inicializar allProducts con un array vacío', () => {
    expect(service.allProducts()).toEqual([]);
  });

  it('debe llamar a addDoc al añadir un producto', async () => {
    const product = { name: 'Test', description: 'Desc', imageUrl: 'url', userId: '123' };
    await service.addProduct(product);
    expect(addDoc).toHaveBeenCalled();
  });

  it('debe llamar a deleteDoc al eliminar un producto', async () => {
    const id = '123';
    await service.deleteProduct(id);
    expect(deleteDoc).toHaveBeenCalled();
  });

  it('debe retornar un observable de producto al buscar por id', async () => {
    const id = '123';
    const mockProduct = { id, name: 'Test' };
    (docData as any).mockReturnValue(of(mockProduct));

    const product = await firstValueFrom(service.getProductById(id));
    expect(product).toEqual(mockProduct);
  });
});
