import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Category, CartItem, Order, UserProfile, UserRole } from '../types';
import { INITIAL_BOOKS, INITIAL_CATEGORIES, INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';
import { apiFetch, normalizeBook, normalizeCategory } from '../lib/api';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface LibraryContextType {
  // Books & Categories
  books: Book[];
  categories: Category[];
  addBook: (bookData: Omit<Book, 'id'>) => Promise<boolean>;
  updateBook: (id: string, bookData: Partial<Book>) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
  addCategory: (name: string, description?: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<void>;
  resetDefaultCatalog: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => boolean;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartFinalTotal: number;

  // Checkout & Orders
  orders: Order[];
  completeCheckout: (details: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'Tarjeta' | 'Contraentrega' | 'Transferencia';
  }) => Order | null;

  // User & Roles
  user: UserProfile;
  role: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;

  // Navigation & Modals
  activeView: 'shop' | 'admin';
  setActiveView: (view: 'shop' | 'admin') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isFAQModalOpen: boolean;
  setIsFAQModalOpen: (open: boolean) => void;
  isTermsModalOpen: boolean;
  setIsTermsModalOpen: (open: boolean) => void;
  selectedBookDetail: Book | null;
  setSelectedBookDetail: (book: Book | null) => void;
  editingBook: Book | null;
  setEditingBook: (book: Book | null) => void;
  isBookFormOpen: boolean;
  setIsBookFormOpen: (open: boolean) => void;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  resetFilters: () => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const mapApiUser = (rawUser: Record<string, unknown>): UserProfile => ({
  name: String(rawUser.name ?? ''),
  email: String(rawUser.email ?? ''),
  phone: String(rawUser.phone ?? ''),
  role: rawUser.role === 'admin' || rawUser.role === 'librarian' ? 'admin' : 'client',
  memberSince: String(rawUser.memberSince ?? rawUser.member_since ?? 'Reciente'),
  loyaltyPoints: Number(rawUser.loyaltyPoints ?? rawUser.loyalty_points ?? 0),
  favoriteGenre: String(rawUser.favoriteGenre ?? rawUser.favorite_genre ?? ''),
});

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage hydrated states
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const stored = localStorage.getItem('univ_books_v1');
      return stored ? JSON.parse(stored) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('univ_cats_v1');
      return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('univ_cart_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [role, setRoleState] = useState<UserRole>('client');

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('univ_user_v1');
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('univ_orders_v1');
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Views & Modals
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadCatalogFromApi = async () => {
      try {
        const [rawBooks, rawCategories] = await Promise.all([
          apiFetch<Array<Record<string, unknown>>>('/api/v1/books?all=true'),
          apiFetch<Array<Record<string, unknown>>>('/api/v1/categories'),
        ]);

        if (!isMounted) return;

        if (Array.isArray(rawBooks)) {
          setBooks(rawBooks.map((book) => normalizeBook(book)));
        }

        if (Array.isArray(rawCategories)) {
          setCategories(rawCategories.map((category) => normalizeCategory(category)));
        }
      } catch {
        // If the Laravel API is not running yet, keep the seeded mock catalog and let the app work locally.
      }
    };

    void loadCatalogFromApi();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('univ_token_v1');

    if (!token) {
      setIsLoggedIn(false);
      setRoleState('client');
      setActiveView('shop');
      return;
    }

    const restoreSession = async () => {
      try {
        const rawUser = await apiFetch<Record<string, unknown>>('/api/v1/auth/me');
        if (!isMounted) return;

        const restoredUser = mapApiUser(rawUser);
        setUser(restoredUser);
        setRoleState(restoredUser.role);
        setActiveView(restoredUser.role === 'admin' ? 'admin' : 'shop');
        setIsLoggedIn(true);
      } catch {
        if (!isMounted) return;
        localStorage.removeItem('univ_token_v1');
        setIsLoggedIn(false);
        setRoleState('client');
        setActiveView('shop');
        showToast('No se pudo restaurar la sesión. Inicia sesión nuevamente.', 'warning');
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('univ_books_v1', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('univ_cats_v1', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('univ_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('univ_role_v1', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('univ_user_v1', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('univ_orders_v1', JSON.stringify(orders));
  }, [orders]);

  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin' && (!isLoggedIn || role !== 'admin')) {
      showToast('Inicia sesión con una cuenta administradora para acceder a esta vista', 'warning');
      return;
    }

    setRoleState(newRole);
    setUser((prev) => ({ ...prev, role: newRole }));
    if (newRole === 'admin') {
      setActiveView('admin');
      showToast('Modo Administrador activado: Control de inventario y catálogo disponible', 'info');
    } else {
      setActiveView('shop');
      showToast('Modo Cliente activado: Vista de comprador y biblioteca', 'info');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 80]);
    setSortBy('featured');
    setInStockOnly(false);
  };

  const resetDefaultCatalog = () => {
    setBooks(INITIAL_BOOKS);
    setCategories(INITIAL_CATEGORIES);
    showToast('Catálogo e inventario restaurados a los valores iniciales', 'info');
  };

  // CRUD Books
  const serializeBook = (bookData: Partial<Book>) => {
    const selectedCategory = categories.find((category) => category.name === bookData.category);
    return {
      title: bookData.title,
      author: bookData.author,
      category: bookData.category,
      category_id: selectedCategory ? Number(selectedCategory.id) : undefined,
      price: bookData.price,
      original_price: bookData.originalPrice ?? null,
      imageUrl: bookData.imageUrl || '',
      cover_theme: bookData.coverTheme ?? 'navy',
      description: bookData.synopsis ?? '',
      stock: bookData.stock ?? 0,
      total_copies: bookData.totalCopies ?? bookData.stock ?? 0,
      available_copies: bookData.stock ?? 0,
      pages: bookData.pages ?? 0,
      publisher: bookData.publisher ?? '',
      year: bookData.year ?? new Date().getFullYear(),
      isbn: bookData.isbn ?? '',
      featured: bookData.featured ?? false,
      bestSeller: bookData.bestSeller ?? false,
      rating: bookData.rating ?? 5,
      reviews_count: bookData.reviewsCount ?? 0,
    };
  };

  const addBook = async (bookData: Omit<Book, 'id'>): Promise<boolean> => {
    if (bookData.imageUrl.startsWith('data:') || bookData.imageUrl.length > 500) {
      showToast('La imagen debe ser una URL de hasta 500 caracteres. La carga directa de archivos aún no está habilitada.', 'warning');
      return false;
    }

    try {
      const rawBook = await apiFetch<Record<string, unknown>>('/api/v1/books', {
        method: 'POST',
        body: JSON.stringify(serializeBook(bookData)),
      });
      const newBook = normalizeBook(rawBook);
      setBooks((prev) => [newBook, ...prev]);
      showToast(`"${newBook.title}" añadido con éxito al catálogo`);
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? `No se pudo crear el libro: ${error.message}` : 'No se pudo crear el libro',
        'warning'
      );
      return false;
    }
  };

  const updateBook = async (id: string, bookData: Partial<Book>): Promise<boolean> => {
    if (bookData.imageUrl?.startsWith('data:') || (bookData.imageUrl?.length ?? 0) > 500) {
      showToast('La imagen debe ser una URL de hasta 500 caracteres. La carga directa de archivos aún no está habilitada.', 'warning');
      return false;
    }

    const currentBook = books.find((book) => book.id === id);
    if (!currentBook) {
      showToast('No se encontró el libro que se desea actualizar', 'warning');
      return false;
    }

    try {
      const rawBook = await apiFetch<Record<string, unknown>>(`/api/v1/books/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(serializeBook({
          ...currentBook,
          ...bookData,
          totalCopies: bookData.stock ?? currentBook.totalCopies ?? currentBook.stock,
        })),
      });
      const updatedBook = normalizeBook(rawBook);
      setBooks((prev) => prev.map((book) => (book.id === id ? updatedBook : book)));
      setCart((prev) => prev.map((item) =>
        item.book.id === id ? { ...item, book: updatedBook } : item
      ));
      showToast('Libro actualizado correctamente');
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? `No se pudo actualizar el libro: ${error.message}` : 'No se pudo actualizar el libro',
        'warning'
      );
      return false;
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    const bookToDelete = books.find((b) => b.id === id);
    if (!bookToDelete) {
      showToast('No se encontró el libro que se desea eliminar', 'warning');
      return false;
    }

    try {
      await apiFetch<null>(`/api/v1/books/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (error) {
      showToast(
        error instanceof Error ? `No se pudo eliminar el libro: ${error.message}` : 'No se pudo eliminar el libro',
        'warning'
      );
      return false;
    }

    setBooks((prev) => prev.filter((b) => b.id !== id));
    setCart((prev) => prev.filter((item) => item.book.id !== id));
    showToast(`Libro "${bookToDelete.title}" eliminado del catálogo`, 'warning');
    return true;
  };

  // Categories
  const addCategory = async (name: string, description?: string): Promise<boolean> => {
    const cleanName = name.trim();
    if (!cleanName) return false;
    if (categories.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      showToast('Esta categoría ya existe', 'warning');
      return false;
    }

    try {
      const createdCategory = await apiFetch<Record<string, unknown>>('/api/v1/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: cleanName,
          description: description?.trim() || `Colección selecta de ${cleanName.toLowerCase()}`,
        }),
      });
      const newCategory = normalizeCategory(createdCategory);
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      showToast(
        error instanceof Error ? `No se pudo crear la categoría: ${error.message}` : 'No se pudo crear la categoría',
        'warning'
      );
      return false;
    }

    showToast(`Categoría "${cleanName}" agregada con éxito`);
    return true;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    // Don't allow deletion if books exist in category
    const count = books.filter((b) => b.category.toLowerCase() === cat.name.toLowerCase()).length;
    if (count > 0) {
      showToast(`No se puede eliminar "${cat.name}" porque tiene ${count} libro(s) asignados`, 'warning');
      return;
    }

    try {
      await apiFetch<null>(`/api/v1/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (error) {
      showToast(
        error instanceof Error ? `No se pudo eliminar la categoría: ${error.message}` : 'No se pudo eliminar la categoría',
        'warning'
      );
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast(`Categoría "${cat.name}" eliminada`);
  };

  // Cart operations
  const addToCart = (book: Book, quantity: number = 1): boolean => {
    if (book.stock <= 0) {
      showToast(`"${book.title}" no cuenta con stock disponible`, 'warning');
      return false;
    }

    let success = false;
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        if (existing.quantity + quantity > book.stock) {
          showToast(`Límite de stock alcanzado (${book.stock} disponibles)`, 'warning');
          return prev;
        }
        success = true;
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > book.stock) {
          showToast(`Solo hay ${book.stock} unidades en stock`, 'warning');
          return prev;
        }
        success = true;
        return [...prev, { book, quantity }];
      }
    });

    if (success) {
      showToast(`¡"${book.title}" agregado al carrito!`);
    }
    return success;
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
    showToast('Libro removido del carrito', 'info');
  };

  const updateCartQuantity = (bookId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.book.id === bookId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((i) => i.book.id !== bookId);
      }
      if (newQty > item.book.stock) {
        showToast(`Stock máximo alcanzado (${item.book.stock} unidades)`, 'warning');
        return prev;
      }
      return prev.map((i) => (i.book.id === bookId ? { ...i, quantity: newQty } : i));
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'UNIVERSAL10') {
      setAppliedCoupon({ code: 'UNIVERSAL10', percent: 10 });
      showToast('¡Cupón aplicado! 10% de descuento concedido');
      return { success: true, message: '10% de descuento aplicado' };
    }
    if (clean === 'LECTOR20') {
      setAppliedCoupon({ code: 'LECTOR20', percent: 20 });
      showToast('¡Cupón especial Lector aplicado! 20% de descuento');
      return { success: true, message: '20% de descuento aplicado' };
    }
    return { success: false, message: 'Código de cupón inválido o expirado' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'info');
  };

  // Calculations
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = Number(cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0).toFixed(2));
  const cartDiscount = appliedCoupon
    ? Number(((cartSubtotal * appliedCoupon.percent) / 100).toFixed(2))
    : 0;
  // Free shipping above 40
  const cartShipping = cartSubtotal > 40 || cartTotalCount === 0 ? 0 : 4.50;
  const cartFinalTotal = Number(Math.max(0, cartSubtotal - cartDiscount + cartShipping).toFixed(2));

  // Checkout
  const completeCheckout = (details: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'Tarjeta' | 'Contraentrega' | 'Transferencia';
  }): Order | null => {
    if (cart.length === 0) return null;
    if (!isLoggedIn) {
      showToast('Debe iniciar sesión en su cuenta de cliente para proceder con la compra', 'warning');
      return null;
    }

    // Deduct stock in catalog
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        const cartItem = cart.find((i) => i.book.id === book.id);
        if (cartItem) {
          return {
            ...book,
            stock: Math.max(0, book.stock - cartItem.quantity)
          };
        }
        return book;
      })
    );

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: cart.map((item) => ({
        bookId: item.book.id,
        bookTitle: item.book.title,
        author: item.book.author,
        imageUrl: item.book.imageUrl,
        quantity: item.quantity,
        price: item.book.price
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: cartShipping,
      total: cartFinalTotal,
      status: 'Procesando',
      customerName: details.customerName,
      email: details.email,
      address: details.address,
      city: details.city,
      paymentMethod: details.paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    // Add loyalty points
    const earnedPoints = Math.round(cartFinalTotal * 2);
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + earnedPoints,
      name: details.customerName || prev.name,
      email: details.email || prev.email
    }));

    clearCart();
    setAppliedCoupon(null);
    setIsCartOpen(false);
    showToast(`¡Pedido ${orderId} realizado con éxito! Gracias por su compra`);
    return newOrder;
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Perfil actualizado correctamente');
  };

  const finishAuthentication = (token: string, rawUser: Record<string, unknown>) => {
    const authenticatedUser = mapApiUser(rawUser);
    localStorage.setItem('univ_token_v1', token);
    setUser(authenticatedUser);
    setRoleState(authenticatedUser.role);
    setActiveView(authenticatedUser.role === 'admin' ? 'admin' : 'shop');
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    showToast(`¡Bienvenido(a), ${authenticatedUser.name}!`, 'success');
  };

  const loginUser = async (email: string, password: string) => {
    const result = await apiFetch<{
      token: string;
      user: Record<string, unknown>;
    }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    finishAuthentication(result.token, result.user);
  };

  const registerUser = async (name: string, email: string, password: string) => {
    const result = await apiFetch<{
      token: string;
      user: Record<string, unknown>;
    }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    finishAuthentication(result.token, result.user);
  };

  const logoutUser = async () => {
    try {
      await apiFetch<null>('/api/v1/auth/logout', { method: 'POST' });
    } catch (error) {
      showToast(
        error instanceof Error ? `No se pudo cerrar la sesión en el servidor: ${error.message}` : 'No se pudo cerrar la sesión en el servidor',
        'warning'
      );
    }

    const guestUser: UserProfile = {
      name: 'Lector Invitado',
      email: '',
      phone: '',
      role: 'client',
      memberSince: 'Hoy',
      loyaltyPoints: 0,
      favoriteGenre: 'Novelas',
    };
    setUser(guestUser);
    setRoleState('client');
    setActiveView('shop');
    setIsLoggedIn(false);
    localStorage.removeItem('univ_token_v1');
    showToast('Has cerrado sesión. Navegando como Lector Invitado.', 'info');
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        categories,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        deleteCategory,
        resetDefaultCatalog,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartFinalTotal,

        orders,
        completeCheckout,

        user,
        role,
        isLoggedIn,
        setRole,
        updateUser,
        loginUser,
        registerUser,
        logoutUser,

        activeView,
        setActiveView,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isFAQModalOpen,
        setIsFAQModalOpen,
        isTermsModalOpen,
        setIsTermsModalOpen,
        selectedBookDetail,
        setSelectedBookDetail,
        editingBook,
        setEditingBook,
        isBookFormOpen,
        setIsBookFormOpen,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        resetFilters,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
