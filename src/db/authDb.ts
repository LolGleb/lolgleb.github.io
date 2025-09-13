// Lightweight client-side Users DB for auth (IndexedDB with localStorage fallback)
// NOTE: This is for demo purposes only. Do NOT store plaintext passwords in production.

export interface DbUser {
  id: string; // uuid
  name: string;
  email: string; // unique (case-insensitive)
  password: string; // plaintext for simplicity (not secure)
  avatar?: string;
  bio?: string;
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
    // No default placeholder avatar — user can upload their own in profile settings
    bio: '',
    createdAt: new Date().toISOString(),
  } as DbUser;
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

export async function updateUserAvatar(userId: string, avatarUrl: string): Promise<DbUser> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(userId);
      getReq.onsuccess = () => {
        const user = (getReq.result as DbUser) || undefined;
        if (!user) {
          tx.abort();
          reject(new Error('User not found'));
          return;
        }
        const updated: DbUser = { ...user, avatar: avatarUrl };
        store.put(updated);
        tx.oncomplete = () => resolve(updated);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }
  const all = lsRead();
  const idx = all.findIndex((u) => u.id === userId);
  if (idx === -1) {
    throw new Error('User not found');
  }
  const updated: DbUser = { ...all[idx], avatar: avatarUrl };
  all[idx] = updated;
  lsWrite(all);
  return updated;
}

export async function updateUserBio(userId: string, bio: string): Promise<DbUser> {
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(userId);
      getReq.onsuccess = () => {
        const user = (getReq.result as DbUser) || undefined;
        if (!user) {
          tx.abort();
          reject(new Error('User not found'));
          return;
        }
        const updated: DbUser = { ...user, bio };
        store.put(updated);
        tx.oncomplete = () => resolve(updated);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }
  const all = lsRead();
  const idx = all.findIndex((u) => u.id === userId);
  if (idx === -1) {
    throw new Error('User not found');
  }
  const updated: DbUser = { ...all[idx], bio };
  all[idx] = updated;
  lsWrite(all);
  return updated;
}

export async function updateUserName(userId: string, name: string): Promise<DbUser> {
  const safe = (name || '').trim();
  if (!safe) {
    throw new Error('Name cannot be empty');
  }
  if (hasIndexedDB()) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(userId);
      getReq.onsuccess = () => {
        const user = (getReq.result as DbUser) || undefined;
        if (!user) {
          tx.abort();
          reject(new Error('User not found'));
          return;
        }
        const updated: DbUser = { ...user, name: safe };
        store.put(updated);
        tx.oncomplete = () => resolve(updated);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }
  const all = lsRead();
  const idx = all.findIndex((u) => u.id === userId);
  if (idx === -1) {
    throw new Error('User not found');
  }
  const updated: DbUser = { ...all[idx], name: safe };
  all[idx] = updated;
  lsWrite(all);
  return updated;
}
