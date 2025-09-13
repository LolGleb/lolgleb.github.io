// Lightweight client-side Comments DB (IndexedDB with localStorage fallback)
// Stores comments per article. For demo purposes only.

export interface DbComment {
  id: string;
  articleId: string;
  userId?: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string; // ISO
  parentId?: string; // optional for replies
}

const DB_NAME = 'tts_comments_db';
const STORE_NAME = 'comments';
const DB_VERSION = 1;

function hasIndexedDB(): boolean { return typeof indexedDB !== 'undefined'; }

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('articleId', 'articleId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage fallback
const LS_KEY = 'tts_comments_ls';

function lsRead(): DbComment[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as DbComment[]) : [];
  } catch {
    return [];
  }
}

function lsWrite(data: DbComment[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

export function generateCommentId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function addComment(comment: DbComment): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(comment);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const all = lsRead();
  all.push(comment);
  lsWrite(all);
}

export async function getCommentsForArticle(articleId: string): Promise<DbComment[]> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('articleId');
      const request = index.getAll(articleId);
      request.onsuccess = () => {
        const res = (request.result as DbComment[]) || [];
        res.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        resolve(res);
      };
      request.onerror = () => reject(request.error);
    });
  }
  return lsRead()
    .filter((c) => c.articleId === articleId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
