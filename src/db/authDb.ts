// Supabase-backed Users DB for auth
// NOTE: This is for demo purposes only. Do NOT store plaintext passwords in production.
import { supabase } from './supabaseClient';

export interface DbUser {
  id: string; // uuid
  name: string;
  email: string; // unique (case-insensitive)
  password: string; // plaintext for simplicity (not secure)
  avatar?: string;
  bio?: string;
  createdAt: string; // ISO
}

const TABLE = 'users';

export function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getAllUsers(): Promise<DbUser[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as DbUser[];
}

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const emailNorm = email.trim().toLowerCase();
  const { data, error } = await supabase.from(TABLE).select('*').eq('email', emailNorm).maybeSingle();
  if (error) throw error;
  return (data as DbUser) ?? undefined;
}

export async function addUser(user: DbUser): Promise<void> {
  const { error } = await supabase.from(TABLE).upsert(user);
  if (error) throw error;
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
  const { data, error } = await supabase
    .from(TABLE)
    .update({ avatar: avatarUrl })
    .eq('id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('User not found');
  return data as DbUser;
}

export async function updateUserBio(userId: string, bio: string): Promise<DbUser> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ bio })
    .eq('id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('User not found');
  return data as DbUser;
}

export async function updateUserName(userId: string, name: string): Promise<DbUser> {
  const safe = (name || '').trim();
  if (!safe) {
    throw new Error('Name cannot be empty');
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update({ name: safe })
    .eq('id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('User not found');
  return data as DbUser;
}
