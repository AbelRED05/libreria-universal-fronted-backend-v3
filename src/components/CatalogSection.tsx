import React, { useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { SidebarFilters } from './SidebarFilters';
import { BookCard } from './BookCard';
import { Sparkles, SlidersHorizontal, BookX, ArrowUpDown } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    books,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    inStockOnly,
    resetFilters,
  } = useLibrary();

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchCategory = book.category.toLowerCase().includes(q);
          const matchIsbn = book.isbn.includes(q);
          if (!matchTitle && !matchAuthor && !matchCategory && !matchIsbn) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (book.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Price filter
        if (book.price > priceRange[1]) {
          return false;
        }

        // Stock filter
        if (inStockOnly && book.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        // 'featured'
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.reviewsCount - a.reviewsCount;
      });
  }, [books, searchQuery, selectedCategory, priceRange, sortBy, inStockOnly]);

  return (
    <section id="catalogo-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Section Header */}
      <div className="pb-8 border-b border-[#2C1E14]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#C88A2E] uppercase tracking-widest block">
            Colección Bibliográfica
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C1E14] mt-1 text-balance">
            {selectedCategory === 'all'
              ? 'Catálogo General de Obras'
              : `Catálogo de ${selectedCategory}`}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6858] mt-1 max-w-xl">
            Ediciones revisadas, volúmenes de colección y textos fundamentales para mentes curiosas.
          </p>
        </div>

        <div className="text-xs text-[#7A6858] font-mono tabular-nums self-start md:self-end">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'título disponible' : 'títulos disponibles'}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Books Grid */}
      <div className="pt-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <SidebarFilters totalResults={filteredBooks.length} />

        {/* Books Grid Area */}
        <div className="flex-1 w-full">
          {filteredBooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#2C1E14]/10 p-12 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-[#F4EFE6] rounded-full flex items-center justify-center text-[#8C7A6B] mx-auto">
                <BookX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#2C1E14]">
                  No se encontraron obras coincidentes
                </h3>
                <p className="text-xs text-[#7A6858]">
                  Intente ajustar el término de búsqueda, ampliar el rango de precio o seleccionar otra categoría.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#2C1E14] text-white text-xs font-semibold rounded-lg hover:bg-[#C88A2E] transition-colors"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
