import { Book, Category } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || '';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem('univ_token_v1');

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = 'No se pudo completar la solicitud';

    try {
      const payload = await response.json();
      const validationMessage = payload?.errors
        ? Object.values(payload.errors as Record<string, string[]>).flat().join(' ')
        : '';
      message = validationMessage || payload?.message || payload?.error || message;
    } catch {
      // Ignore JSON parse failures and keep the default message.
    }

    throw new Error(message);
  }

  const payload = await response.json();

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export function normalizeBook(raw: Partial<Book> & Record<string, unknown>): Book {
  return {
    id: String(raw.id ?? 'book-' + Math.random().toString(36).slice(2)),
    title: String(raw.title ?? ''),
    author: String(raw.author ?? ''),
    category: String(raw.category ?? 'General'),
    price: Number(raw.price ?? 0),
    originalPrice: raw.originalPrice !== undefined ? Number(raw.originalPrice) : undefined,
    imageUrl: String(raw.imageUrl ?? raw.cover_image ?? ''),
    coverTheme: (raw.coverTheme as Book['coverTheme']) ?? (raw.cover_theme as Book['coverTheme']) ?? 'navy',
    synopsis: String(raw.synopsis ?? raw.description ?? ''),
    stock: Number(raw.stock ?? raw.available_copies ?? 0),
    totalCopies: Number(raw.total_copies ?? raw.stock ?? raw.available_copies ?? 0),
    rating: Number(raw.rating ?? 0),
    reviewsCount: Number(raw.reviewsCount ?? raw.reviews_count ?? 0),
    pages: Number(raw.pages ?? 0),
    publisher: String(raw.publisher ?? ''),
    year: Number(raw.year ?? raw.publication_year ?? new Date().getFullYear()),
    isbn: String(raw.isbn ?? ''),
    featured: Boolean(raw.featured ?? raw.is_featured ?? false),
    bestSeller: Boolean(raw.bestSeller ?? raw.is_bestseller ?? false),
  };
}

export function normalizeCategory(raw: Partial<Category> & Record<string, unknown>): Category {
  return {
    id: String(raw.id ?? 'cat-' + Math.random().toString(36).slice(2)),
    name: String(raw.name ?? 'Sin categoría'),
    description: String(raw.description ?? ''),
    count: typeof raw.count === 'number' ? raw.count : undefined,
  };
}
