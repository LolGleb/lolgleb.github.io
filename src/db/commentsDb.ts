// Supabase-backed Comments DB
import { supabase } from './supabaseClient';

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

const TABLE = 'comments';

export function generateCommentId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function addComment(comment: DbComment): Promise<void> {
  const { error } = await supabase.from(TABLE).insert(comment);
  if (error) throw error;
}

export async function getCommentsForArticle(articleId: string): Promise<DbComment[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('articleId', articleId)
    .order('createdAt', { ascending: true });
  if (error) throw error;
  return (data ?? []) as DbComment[];
}
