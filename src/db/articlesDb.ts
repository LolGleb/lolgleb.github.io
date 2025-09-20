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
  brandIds?: string[]; // related brands (uuid[])
}

const TABLE = 'articles';
const JOIN_TABLE = 'article_brands';

function stripOptionalColumns(a: AdminArticle): Partial<AdminArticle> {
  const copy: any = { ...a };
  delete copy.brandIds;
  return copy;
}
export async function addArticle(article: AdminArticle): Promise<void> {
  // Always exclude brandIds from the upsert payload; relations are handled via join-table
  const payload = stripOptionalColumns(article);
  const { error } = await supabase.from(TABLE).upsert(payload);
  if (error) throw error;
  // Sync join-table links
  if (Array.isArray(article.brandIds)) {
    try {
      await setArticleBrands(article.id, article.brandIds);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[articlesDb] setArticleBrands failed after addArticle', e);
    }
  }
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

// Set brand links for an article via join-table (replaces existing links)
export async function setArticleBrands(articleId: string, brandIds: string[]): Promise<void> {
  // delete existing
  const del = await supabase.from(JOIN_TABLE).delete().eq('article_id', articleId);
  if (del.error) throw del.error;
  // insert new
  if (Array.isArray(brandIds) && brandIds.length > 0) {
    const rows = brandIds.map((bid) => ({ article_id: articleId, brand_id: bid }));
    const ins = await supabase.from(JOIN_TABLE).insert(rows as any);
    if (ins.error) throw ins.error;
  }
}

// Fetch linked brand IDs for an article (join-table first, fallback to array column)
export async function getBrandIdsForArticle(articleId: string): Promise<string[]> {
  // Try join-table
  const j = await supabase.from(JOIN_TABLE).select('brand_id').eq('article_id', articleId);
  if (!j.error) {
    const rows = (j.data ?? []) as Array<{ brand_id: string }>;
    if (rows.length > 0) return rows.map((r) => r.brand_id);
  }
  // Fallback to array column if join not available or empty
  const { data, error } = await supabase.from(TABLE).select('brandIds').eq('id', articleId).maybeSingle();
  if (error) throw error;
  const arr = (data as any)?.brandIds as string[] | null | undefined;
  return Array.isArray(arr) ? arr : [];
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
  // Always exclude brandIds from the upsert payload; relations are handled via join-table
  const payload = stripOptionalColumns(article);
  const { error } = await supabase.from(TABLE).upsert(payload);
  if (error) throw error;
  // Sync join-table links
  if (Array.isArray(article.brandIds)) {
    try {
      await setArticleBrands(article.id, article.brandIds);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[articlesDb] setArticleBrands failed after updateArticle', e);
    }
  }
}

export async function getArticlesByBrandId(brandId: string): Promise<AdminArticle[]> {
  // Prefer join-table for accurate relations
  try {
    const { data, error } = await supabase
      .from(JOIN_TABLE)
      .select('articles(*)')
      .eq('brand_id', brandId);
    if (error) throw error;
    const rows = (data ?? []) as Array<{ articles: AdminArticle | null }>;
    const items = rows.map((r) => r.articles).filter(Boolean) as AdminArticle[];
    // Order by publishedAt desc
    return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (e) {
    // Fallback to legacy array column
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .contains('brandIds', [brandId]);
    if (error) throw error;
    const items = (data ?? []) as AdminArticle[];
    return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
}