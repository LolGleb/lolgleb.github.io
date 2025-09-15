// Supabase-backed Articles DB
// Replaces previous IndexedDB/localStorage implementation
import { supabase } from './supabaseClient';

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

const TABLE = 'articles';

export async function addArticle(article: AdminArticle): Promise<void> {
  const { error } = await supabase.from(TABLE).upsert(article);
  if (error) throw error;
}

export async function getAllArticles(): Promise<AdminArticle[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as AdminArticle[];
}

export async function getArticlesByCategory(category: AdminArticleCategory): Promise<AdminArticle[]> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('category', category);
  if (error) throw error;
  return (data ?? []) as AdminArticle[];
}

export async function getArticleByIdAdmin(id: string): Promise<AdminArticle | undefined> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as AdminArticle) ?? undefined;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
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
  const { error } = await supabase.from(TABLE).upsert(article);
  if (error) throw error;
}