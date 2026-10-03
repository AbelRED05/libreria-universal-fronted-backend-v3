import React, { useState } from 'react';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart, setSelectedBookDetail } = useLibrary();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = addToCart(book, 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  const isOutOfStock = book.stock <= 0;

  return (
    <article
      onClick={() => setSelectedBookDetail(book)}
      className="group relative bg-[#FFFFFF] rounded-xl border border-[#2C1E14]/10 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#C88A2E]/40 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Visual: Book Cover & Badges */}
      <div className="relative">
        <div className="overflow-hidden rounded-md bg-[#F4EFE6] flex items-center justify-center p-2 group-hover:bg-[#EFEAE0] transition-colors">
          <div className="w-full max-w-[190px] mx-auto transform group-hover:scale-[1.02] transition-transform duration-200">
            <BookCover
              title={book.title}
              author={book.author}
              category={book.category}
              imageUrl={book.imageUrl}
              theme={book.coverTheme}
            />
          </div>
        </div>

        {/* Subtle status tag if out of stock or low stock */}
        {isOutOfStock ? (
          <span className="absolute top-3 left-3 bg-[#381616] text-[#FFBDBD] text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
            Agotado
          </span>
        ) : book.stock <= 5 ? (
          <span className="absolute top-3 left-3 bg-[#422C1D] text-[#F3E5AB] text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
            ¡Solo {book.stock} unid.!
          </span>
        ) : book.bestSeller ? (
          <span className="absolute top-3 left-3 bg-[#2C1E14] text-[#D4AF37] text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
            Más Vendido
          </span>
        ) : null}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBookDetail(book);
          }}
          className="absolute bottom-3 right-3 p-2 bg-[#2C1E14]/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[#C88A2E]"
          title="Vista rápida del libro"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Content & Metadata Area */}
      <div className="pt-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Unboxed Metadata (Zero-Pill Rule) */}
          <div className="flex items-center gap-1.5 text-xs text-[#7A6858]">
            <span className="font-medium text-[#C88A2E]">{book.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{book.publisher || 'Edición Especial'}</span>
          </div>

          {/* Book Title */}
          <h3 className="font-serif text-base font-bold text-[#2C1E14] leading-snug group-hover:text-[#9A6216] transition-colors line-clamp-2">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-[#5C4A3C] font-normal truncate">
            {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <div className="flex items-center text-[#D4AF37]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-mono font-medium text-[#2C1E14] tabular-nums">
              {book.rating.toFixed(1)}
            </span>
            <span className="text-[#8C7A6B] tabular-nums">
              ({book.reviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-4 mt-3 border-t border-[#2C1E14]/5 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold text-[#2C1E14] tabular-nums">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-xs text-[#8C7A6B] line-through tabular-nums">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#8C7A6B]">
              {isOutOfStock ? 'Sin existencias' : `${book.stock} en librería`}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : justAdded
                  ? 'bg-[#1b3d2f] text-white shadow-sm'
                  : 'bg-[#2C1E14] text-[#FAF8F5] hover:bg-[#C88A2E] shadow-sm active:scale-95'
              }`}
              title="Añadir al carrito"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Añadido</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
