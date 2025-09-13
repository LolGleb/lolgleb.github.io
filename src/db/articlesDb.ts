// Lightweight IndexedDB wrapper for Articles
// No external dependencies; falls back to localStorage if IndexedDB unavailable

export type AdminArticleCategory = 'News' | 'Drops' | 'Stories';

export interface AdminArticle {
  id: string; // uuid
  title: string;
  excerpt?: string;
  category: AdminArticleCategory;
  image: string;
  publishedAt: string; // ISO string
  featured?: boolean;
  readTime?: string;
  content?: string;
}

const DB_NAME = 'tts_articles_db';
const STORE_NAME = 'articles';
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
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('publishedAt', 'publishedAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage fallback
const LS_KEY = 'tts_articles_ls';

function lsRead(): AdminArticle[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AdminArticle[]) : [];
  } catch {
    return [];
  }
}

function lsWrite(data: AdminArticle[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export async function addArticle(article: AdminArticle): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(article);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } else {
    const all = lsRead();
    all.push(article);
    lsWrite(all);
  }
}

export async function getAllArticles(): Promise<AdminArticle[]> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve((request.result as AdminArticle[]) || []);
      request.onerror = () => reject(request.error);
    });
  }
  return lsRead();
}

export async function getArticlesByCategory(category: AdminArticleCategory): Promise<AdminArticle[]> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('category');
      const request = index.getAll(category);
      request.onsuccess = () => {
        const res = (request.result as AdminArticle[]) || [];
        resolve(res);
      };
      request.onerror = () => reject(request.error);
    });
  }
  return lsRead().filter((a) => a.category === category);
}

export async function getArticleByIdAdmin(id: string): Promise<AdminArticle | undefined> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve((request.result as AdminArticle) || undefined);
      request.onerror = () => reject(request.error);
    });
  }
  return lsRead().find((a) => a.id === id);
}

export async function deleteArticle(id: string): Promise<void> {
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
    const all = lsRead().filter((a) => a.id !== id);
    lsWrite(all);
  }
}

export function generateId(): string {
  // Simple UUID v4-like generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


export async function updateArticle(article: AdminArticle): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(article);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const all = lsRead();
  const idx = all.findIndex((a) => a.id === article.id);
  if (idx === -1) {
    all.push(article);
  } else {
    all[idx] = article;
  }
  lsWrite(all);
}