export type UserRole = 'client' | 'admin';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  coverTheme?: 'emerald' | 'amber' | 'navy' | 'crimson' | 'slate' | 'terracotta';
  synopsis: string;
  stock: number;
  totalCopies?: number;
  rating: number;
  reviewsCount: number;
  pages: number;
  publisher: string;
  year: number;
  isbn: string;
  featured?: boolean;
  bestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count?: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  bookId: string;
  bookTitle: string;
  author: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Completado' | 'En camino' | 'Procesando';
  customerName: string;
  email: string;
  address: string;
  city: string;
  paymentMethod: 'Tarjeta' | 'Contraentrega' | 'Transferencia';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  memberSince: string;
  loyaltyPoints: number;
  favoriteGenre: string;
}
