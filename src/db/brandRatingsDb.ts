import { supabase } from './supabaseClient';

export interface BrandRatingsRow {
  id: string;
  brandId: string;
  userId: string;
  culturalImpact: number; // 1..5
  collabPower: number; // 1..5
  creativity: number; // 1..5
  popularity: number; // 1..5
  loyalty: number; // 1..5
  drops: number; // 1..5
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandAverages {
  culturalImpact: number;
  collabPower: number;
  creativity: number;
  popularity: number;
  loyalty: number;
  drops: number;
}

const TABLE = 'brand_ratings';

export async function getUserBrandRatingRow(userId: string, brandId: string): Promise<BrandRatingsRow | undefined> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('userId', userId)
    .eq('brandId', brandId)
    .maybeSingle();
  if (error) throw error;
  return (data as BrandRatingsRow) ?? undefined;
}

// Upsert a single category rating for a brand+user.
// On insert, all six categories must be provided due to NOT NULL constraints; we default others to 3.
export async function upsertUserBrandRating(
  userId: string,
  brandId: string,
  category: keyof Pick<BrandRatingsRow, 'culturalImpact'|'collabPower'|'creativity'|'popularity'|'loyalty'|'drops'>,
  rating: number
): Promise<void> {
  // Constrain rating 1..5
  const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
  const existing = await getUserBrandRatingRow(userId, brandId);
  if (existing) {
    const update: Partial<BrandRatingsRow> = { [category]: safeRating } as Partial<BrandRatingsRow>;
    const { error } = await supabase
      .from(TABLE)
      .update({ ...update, updatedAt: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
    return;
  }

  // Insert a new row with defaults (3) for other categories
  const payload: Omit<BrandRatingsRow, 'id'> = {
    brandId,
    userId,
    culturalImpact: category === 'culturalImpact' ? safeRating : 3,
    collabPower: category === 'collabPower' ? safeRating : 3,
    creativity: category === 'creativity' ? safeRating : 3,
    popularity: category === 'popularity' ? safeRating : 3,
    loyalty: category === 'loyalty' ? safeRating : 3,
    drops: category === 'drops' ? safeRating : 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const { error } = await supabase.from(TABLE).insert(payload as any);
  if (error) throw error;
}

export async function getBrandAverages(brandId: string): Promise<BrandAverages | undefined> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('culturalImpact, collabPower, creativity, popularity, loyalty, drops')
    .eq('brandId', brandId);
  if (error) throw error;
  const rows = (data ?? []) as BrandRatingsRow[];
  if (!rows.length) return undefined;

  const sum = rows.reduce(
    (acc, r) => {
      acc.culturalImpact += r.culturalImpact;
      acc.collabPower += r.collabPower;
      acc.creativity += r.creativity;
      acc.popularity += r.popularity;
      acc.loyalty += r.loyalty;
      acc.drops += r.drops;
      return acc;
    },
    { culturalImpact: 0, collabPower: 0, creativity: 0, popularity: 0, loyalty: 0, drops: 0 }
  );
  const count = rows.length;
  const avg: BrandAverages = {
    culturalImpact: sum.culturalImpact / count,
    collabPower: sum.collabPower / count,
    creativity: sum.creativity / count,
    popularity: sum.popularity / count,
    loyalty: sum.loyalty / count,
    drops: sum.drops / count,
  };

  // Clamp 1..5 and round to 1 decimal for display stability
  (Object.keys(avg) as (keyof BrandAverages)[]).forEach((k) => {
    const v = (avg as any)[k];
    const clamped = Math.max(1, Math.min(5, v));
    (avg as any)[k] = Math.round(clamped * 10) / 10;
  });

  return avg;
}
