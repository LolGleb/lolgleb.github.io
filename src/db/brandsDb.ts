// Lightweight IndexedDB wrapper for Brands
// No external dependencies; falls back to localStorage if IndexedDB unavailable

export interface AdminBrand {
  id: string; // uuid
  name: string;
  logo: string; // URL to logo image
  image?: string; // URL to brand cover/hero image
  description?: string;
  website?: string;
  tags?: string[];
  madeIn?: string[];
  priceRange?: string[]; // e.g., ["$"], ["$$"], etc.
  featured?: boolean;
  trending?: boolean;
  topRated?: boolean;
}

const DB_NAME = 'tts_brands_db';
const STORE_NAME = 'brands';
const DB_VERSION = 1;

function hasIndexedDB(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage fallback
const LS_KEY = 'tts_brands_ls';

function lsRead(): AdminBrand[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AdminBrand[]) : [];
  } catch {
    return [];
  }
}

function lsWrite(data: AdminBrand[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export async function addBrand(brand: AdminBrand): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(brand);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } else {
    const all = lsRead();
    all.push(brand);
    lsWrite(all);
  }
}

export async function getAllBrands(): Promise<AdminBrand[]> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve((request.result as AdminBrand[]) || []);
      request.onerror = () => reject(request.error);
    });
  }
  return lsRead();
}

export async function deleteBrand(id: string): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } else {
    const all = lsRead().filter((b) => b.id !== id);
    lsWrite(all);
  }
}

export function generateBrandId(): string {
  // Simple UUID v4-like generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getBrandByIdAdmin(id: string): Promise<AdminBrand | undefined> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve((request.result as AdminBrand) || undefined);
      request.onerror = () => reject(request.error);
    });
  }
  return lsRead().find((b) => b.id === id);
}

export async function updateBrand(brand: AdminBrand): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(brand);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const all = lsRead();
  const idx = all.findIndex((b) => b.id === brand.id);
  if (idx === -1) {
    all.push(brand);
  } else {
    all[idx] = brand;
  }
  lsWrite(all);
}
