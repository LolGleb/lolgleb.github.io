// Supabase-backed Brand Submissions DB
import { supabase } from './supabaseClient';
import { AdminBrand, addBrand, generateBrandId } from './brandsDb';

export type SubmissionStatus = 'pending' | 'approved' | 'declined';

export interface BrandSubmission {
  id: string; // uuid
  name: string; // brand name
  description?: string; // about
  website?: string;
  tags?: string[]; // categories
  madeIn?: string[]; // countries
  priceRange?: string[]; // $, $$, $$$
  authorId: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string; // ISO
  status: SubmissionStatus; // default: pending
  moderationComment?: string;
  // When approved, store created brand id
  publishedBrandId?: string;
}

const TABLE = 'brand_submissions';

export function generateSubmissionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function addBrandSubmission(sub: BrandSubmission): Promise<void> {
  const { error } = await supabase.from(TABLE).insert(sub);
  if (error) throw error;
}

export async function getPendingBrandSubmissions(): Promise<BrandSubmission[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('status', 'pending')
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BrandSubmission[];
}

export async function updateBrandSubmission(updated: BrandSubmission): Promise<void> {
  const { error } = await supabase.from(TABLE).upsert(updated);
  if (error) throw error;
}

export async function deleteBrandSubmission(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function approveBrandSubmission(sub: BrandSubmission): Promise<AdminBrand> {
  const brand: AdminBrand = {
    id: generateBrandId(),
    name: sub.name,
    logo: '', // Admin can upload/edit later
    image: undefined,
    description: sub.description,
    website: sub.website,
    tags: sub.tags,
    madeIn: sub.madeIn,
    priceRange: sub.priceRange,
    featured: false,
    trending: false,
    topRated: false,
  };
  await addBrand(brand);
  const updated: BrandSubmission = { ...sub, status: 'approved', publishedBrandId: brand.id };
  await updateBrandSubmission(updated);
  return brand;
}

export async function declineBrandSubmission(sub: BrandSubmission, comment: string): Promise<void> {
  const updated: BrandSubmission = { ...sub, status: 'declined', moderationComment: (comment || '').trim() };
  await updateBrandSubmission(updated);
}
