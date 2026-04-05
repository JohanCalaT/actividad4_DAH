import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  orderBy,
  QueryConstraint,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import type { Product } from './product.model';

const COLLECTION = 'products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);

  // Public Signal: ALL products (no filter) - public access
  private _allProductsRef = collection(this.firestore, COLLECTION);
  private _allProducts$ = collectionData(this._allProductsRef, {
    idField: 'id',
  }) as Observable<Product[]>;
  readonly allProducts = toSignal(this._allProducts$, { initialValue: [] });

  // Private query: products filtered by userId
  getUserProducts(userId: string) {
    const q = query(
      collection(this.firestore, COLLECTION),
      where('userId', '==', userId),
    );
    return toSignal(collectionData(q, { idField: 'id' }) as Observable<Product[]>, {
      initialValue: [],
    });
  }

  // Get single product by id as Observable (used with toSignal in component)
  getProductById(id: string): Observable<Product | undefined> {
    const ref = doc(this.firestore, COLLECTION, id);
    return docData(ref, { idField: 'id' }) as Observable<Product | undefined>;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<void> {
    await addDoc(collection(this.firestore, COLLECTION), product);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const ref = doc(this.firestore, COLLECTION, id);
    await updateDoc(ref, product);
  }

  async deleteProduct(id: string): Promise<void> {
    const ref = doc(this.firestore, COLLECTION, id);
    await deleteDoc(ref);
  }

  // --- NEW PAGINATION METHODS ---

  async getProductsPage(pageSize: number, lastVisible?: QueryDocumentSnapshot) {
    const constraints: QueryConstraint[] = [
      orderBy('name'),
      limit(pageSize)
    ];

    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }

    const q = query(collection(this.firestore, COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    return {
      products,
      lastDoc,
      hasMore: snapshot.docs.length === pageSize
    };
  }

  async getUserProductsPage(userId: string, pageSize: number, lastVisible?: QueryDocumentSnapshot) {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('name'),
      limit(pageSize)
    ];

    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }

    const q = query(collection(this.firestore, COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    return {
      products,
      lastDoc,
      hasMore: snapshot.docs.length === pageSize
    };
  }
}
