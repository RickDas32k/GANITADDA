import { sqlClient, isDbConfigured } from './db';
import { Worksheet, ClassLevel, DifficultyLevel, MaterialType } from './types';
import { INITIAL_MOCK_WORKSHEETS } from './mock-data';

export interface WorksheetFilterOptions {
  classLevel?: ClassLevel | string;
  chapter?: string;
  difficulty?: DifficultyLevel | string;
  materialType?: MaterialType | string;
  search?: string;
  isFree?: boolean;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'popular';
  limit?: number;
  offset?: number;
}

export async function getWorksheets(
  filters: WorksheetFilterOptions = {}
): Promise<Worksheet[]> {
  if (!isDbConfigured()) {
    // In-memory filtered mock store
    let list = [...INITIAL_MOCK_WORKSHEETS];

    if (filters.classLevel && filters.classLevel !== 'all') {
      list = list.filter((w) => (w.class_level || '').toUpperCase() === filters.classLevel?.toUpperCase());
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter((w) => (w.difficulty || '').toLowerCase() === filters.difficulty?.toLowerCase());
    }
    if (filters.materialType && filters.materialType !== 'all') {
      list = list.filter((w) => w.material_type === filters.materialType);
    }
    if (filters.isFree !== undefined) {
      list = list.filter((w) => w.is_free === filters.isFree);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (w) =>
          (w.title || '').toLowerCase().includes(q) ||
          (w.chapter || '').toLowerCase().includes(q) ||
          (w.description || '').toLowerCase().includes(q) ||
          (w.topic || '').toLowerCase().includes(q)
      );
    }

    if (filters.sortBy === 'price_low') {
      list.sort((a, b) => (a.price_paise || 0) - (b.price_paise || 0));
    } else if (filters.sortBy === 'price_high') {
      list.sort((a, b) => (b.price_paise || 0) - (a.price_paise || 0));
    } else if (filters.sortBy === 'popular') {
      list.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    if (filters.limit) {
      const offset = filters.offset || 0;
      return list.slice(offset, offset + filters.limit);
    }

    return list;
  }

  try {
    const sql = sqlClient();
    const rows = (await sql`
      SELECT * FROM worksheets 
      WHERE is_published = true
      ORDER BY created_at DESC
    `) as Worksheet[];

    let list = rows.length > 0 ? rows : [...INITIAL_MOCK_WORKSHEETS];

    if (filters.classLevel && filters.classLevel !== 'all') {
      list = list.filter((w) => (w.class_level || '').toUpperCase() === filters.classLevel?.toUpperCase());
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter((w) => (w.difficulty || '').toLowerCase() === filters.difficulty?.toLowerCase());
    }
    if (filters.materialType && filters.materialType !== 'all') {
      list = list.filter((w) => w.material_type === filters.materialType);
    }
    if (filters.isFree !== undefined) {
      list = list.filter((w) => w.is_free === filters.isFree);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (w) =>
          (w.title || '').toLowerCase().includes(q) ||
          (w.chapter || '').toLowerCase().includes(q) ||
          (w.description || '').toLowerCase().includes(q) ||
          (w.topic || '').toLowerCase().includes(q)
      );
    }

    if (filters.sortBy === 'price_low') {
      list.sort((a, b) => (a.price_paise || 0) - (b.price_paise || 0));
    } else if (filters.sortBy === 'price_high') {
      list.sort((a, b) => (b.price_paise || 0) - (a.price_paise || 0));
    } else if (filters.sortBy === 'popular') {
      list.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
    }

    if (filters.limit) {
      const offset = filters.offset || 0;
      return list.slice(offset, offset + filters.limit);
    }

    return list;
  } catch (err) {
    console.warn('[getWorksheets] Database fallback to initial mock catalog:', err);
    return INITIAL_MOCK_WORKSHEETS;
  }
}

export async function getWorksheetBySlug(slugOrId: string): Promise<Worksheet | null> {
  const all = await getWorksheets();
  const found = all.find((w) => w.slug === slugOrId || w.id === slugOrId);
  return found || null;
}

export async function getFeaturedWorksheets(): Promise<Worksheet[]> {
  const all = await getWorksheets();
  return all.filter((w) => w.is_featured).slice(0, 6);
}

export async function getRelatedWorksheets(
  classLevel: string,
  excludeId: string
): Promise<Worksheet[]> {
  const all = await getWorksheets();
  return all
    .filter((w) => w.class_level === classLevel && w.id !== excludeId)
    .slice(0, 3);
}
