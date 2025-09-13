// Lightweight client-side Submissions DB for user-submitted articles
// IndexedDB with localStorage fallback (no external deps)

import { addArticle, AdminArticle, AdminArticleCategory, generateId as generateArticleId } from './articlesDb';

export type SubmissionStatus = 'pending' | 'approved' | 'declined';

export interface ArticleSubmission {
  id: string; // uuid
  title: string;
  excerpt: string;
  category: AdminArticleCategory;
  image?: string;
  content: string;
  tags?: string[];
  authorId: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string; // ISO
  status: SubmissionStatus; // default: pending
  moderationComment?: string;
  // Admin-editable extra fields to map to AdminArticle on publish
  featured?: boolean;
  readTime?: string;
  // When approved, we store the created AdminArticle id for deep-linking
  publishedArticleId?: string;
}

const DB_NAME = 'tts_submissions_db';
const STORE_NAME = 'submissions';
const DB_VERSION = 1;

function hasIndexedDB(): boolean { return typeof indexedDB !== 'undefined'; }

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('authorId', 'authorId', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage fallback
const LS_KEY = 'tts_submissions_ls';

function lsRead(): ArticleSubmission[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as ArticleSubmission[]) : [];
  } catch {
    return [];
  }
}

function lsWrite(data: ArticleSubmission[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

export function generateSubmissionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function addSubmission(sub: ArticleSubmission): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(sub);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const all = lsRead();
  all.push(sub);
  lsWrite(all);
}

export async function getAllSubmissions(): Promise<ArticleSubmission[]> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as ArticleSubmission[]) || []);
      req.onerror = () => reject(req.error);
    });
  }
  return lsRead();
}

export async function getSubmissionById(id: string): Promise<ArticleSubmission | undefined> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as ArticleSubmission) || undefined);
      req.onerror = () => reject(req.error);
    });
  }
  return lsRead().find((s) => s.id === id);
}

export async function getPendingSubmissions(): Promise<ArticleSubmission[]> {
  const all = await getAllSubmissions();
  return all.filter((s) => s.status === 'pending').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateSubmission(updated: ArticleSubmission): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(updated);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const all = lsRead();
  const idx = all.findIndex((s) => s.id === updated.id);
  if (idx === -1) return;
  all[idx] = updated;
  lsWrite(all);
}

export async function deleteSubmission(id: string): Promise<void> {
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
  }
  const all = lsRead().filter((s) => s.id !== id);
  lsWrite(all);
}

export async function approveSubmission(sub: ArticleSubmission, publishDateISO?: string): Promise<AdminArticle> {
  // Create admin article from submission (using possibly admin-edited fields)
  const article: AdminArticle = {
    id: generateArticleId(),
    title: sub.title,
    excerpt: sub.excerpt || undefined,
    category: sub.category,
    image: sub.image || '',
    publishedAt: publishDateISO || new Date().toISOString(),
    featured: Boolean(sub.featured),
    readTime: sub.readTime || undefined,
    content: sub.content || undefined,
  };
  await addArticle(article);
  // Mark submission approved and store mapping to published article id
  const updated: ArticleSubmission = { ...sub, status: 'approved', publishedArticleId: article.id };
  await updateSubmission(updated);
  return article;
}

export async function declineSubmission(sub: ArticleSubmission, comment: string): Promise<void> {
  const updated: ArticleSubmission = { ...sub, status: 'declined', moderationComment: (comment || '').trim() };
  await updateSubmission(updated);
}
