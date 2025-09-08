// Lightweight client-side Users DB for auth (IndexedDB with localStorage fallback)
// NOTE: This is for demo purposes only. Do NOT store plaintext passwords in production.

export interface DbUser {
  id: string; // uuid
  name: string;
  email: string; // unique (case-insensitive)
  password: string; // plaintext for simplicity (not secure)
  avatar?: string;
  createdAt: string; // ISO
}

const DB_NAME = 'tts_users_db';
const STORE_NAME = 'users';
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
        store.createIndex('email_ci', 'email', { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// LocalStorage fallback
const LS_KEY = 'tts_users_ls';

function lsRead(): DbUser[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as DbUser[]) : [];
  } catch {
    return [];
  }
}

function lsWrite(data: DbUser[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getAllUsers(): Promise<DbUser[]> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve((request.result as DbUser[]) || []);
      request.onerror = () => reject(request.error);
    });
  }
  return lsRead();
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const emailNorm = email.trim().toLowerCase();
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      // We created an index but to keep compatibility across browsers, we can just scan all for simplicity
      const req = store.getAll();
      req.onsuccess = () => {
        const all = (req.result as DbUser[]) || [];
        resolve(all.find((u) => u.email.toLowerCase() === emailNorm));
      };
      req.onerror = () => reject(req.error);
    });
  }
  return lsRead().find((u) => u.email.toLowerCase() === emailNorm);
}

export async function addUser(user: DbUser): Promise<void> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(user);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const all = lsRead();
  all.push(user);
  lsWrite(all);
}

export async function registerUser(name: string, email: string, password: string): Promise<DbUser> {
  const emailNorm = email.trim().toLowerCase();
  const existing = await getUserByEmail(emailNorm);
  if (existing) {
    throw new Error('User with this email already exists');
  }
  const user: DbUser = {
    id: generateUserId(),
    name: name.trim() || emailNorm,
    email: emailNorm,
    password, // not secure; demo only
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
  };
  await addUser(user);
  return user;
}

export async function loginUser(email: string, password: string): Promise<DbUser> {
  const emailNorm = email.trim().toLowerCase();
  const existing = await getUserByEmail(emailNorm);
  if (!existing) {
    throw new Error('User not found');
  }
  if (existing.password !== password) {
    throw new Error('Invalid credentials');
  }
  return existing;
}
