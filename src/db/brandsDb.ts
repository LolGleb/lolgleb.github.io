// Supabase-backed Brands DB
// Replaces previous IndexedDB/localStorage implementation
import { supabase } from './supabaseClient';

export interface AdminBrand {
  id: string; // uuid
  name: string;
  logo: string; // URL to logo image
  image?: string; // URL to brand cover/hero image
  description?: string; // "About" text
  website?: string;
  tags?: string[]; // Categories
  madeIn?: string[]; // Country of origin (store single selection as array with one item)
  priceRange?: string[]; // e.g., ["$"], ["$$"], etc. (store single selection as array with one item)
  rating?: number; // 1.0 .. 5.0 (0.5 step)
  founded?: number; // Year
  headquarters?: string; // Headquarters city/country
  featured?: boolean;
  trending?: boolean;
  topRated?: boolean;
}

const TABLE = 'brands';

export async function addBrand(brand: AdminBrand): Promise<void> {
  const { error } = await supabase.from(TABLE).upsert(brand);
  if (error) throw error;
}

export async function getAllBrands(): Promise<AdminBrand[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as AdminBrand[];
}

export async function deleteBrand(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export function generateBrandId(): string {
  // Simple UUID v4-like generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getBrandByIdAdmin(id: string): Promise<AdminBrand | undefined> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as AdminBrand) ?? undefined;
}

export async function updateBrand(brand: AdminBrand): Promise<void> {
  const { error } = await supabase.from(TABLE).upsert(brand);
  if (error) throw error;
}
