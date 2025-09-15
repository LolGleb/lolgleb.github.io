// Supabase-backed Submissions DB
import { supabase } from './supabaseClient';
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

const TABLE = 'submissions';

export function generateSubmissionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function addSubmission(sub: ArticleSubmission): Promise<void> {
  const { error } = await supabase.from(TABLE).insert(sub);
  if (error) throw error;
}

export async function getAllSubmissions(): Promise<ArticleSubmission[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as ArticleSubmission[];
}

export async function getSubmissionById(id: string): Promise<ArticleSubmission | undefined> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ArticleSubmission) ?? undefined;
}

export async function getPendingSubmissions(): Promise<ArticleSubmission[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('status', 'pending')
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ArticleSubmission[];
}

export async function updateSubmission(updated: ArticleSubmission): Promise<void> {
  const { error } = await supabase.from(TABLE).upsert(updated);
  if (error) throw error;
}

export async function deleteSubmission(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
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
