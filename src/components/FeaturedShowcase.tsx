import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { Sparkles, Star, ShoppingBag, ArrowRight } from 'lucide-react';

export const FeaturedShowcase: React.FC = () => {
  const { books, addToCart, setSelectedBookDetail } = useLibrary();

  // Filter 3 highlighted works with generated imagery
  const showcaseBooks = books.filter((b) => b.imageUrl && b.imageUrl.length > 0).slice(0, 3);

  if (showcaseBooks.length === 0) return null;

  return (
    <section id="destacados" className="py-14 bg-[#F4EFE6] border-b border-[#2C1E14]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C88A2E]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selección Curada de la Dirección</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E14] text-balance">
            Tesoros Literarios Imprescindibles
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6858] font-light">
            Obras cumbre en encuadernaciones de alta fidelidad, con notas al texto y prólogos conmemorativos.
          </p>
        </div>

        {/* 3-Column Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {showcaseBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl border border-[#2C1E14]/10 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Book Cover Container */}
                <div
                  onClick={() => setSelectedBookDetail(book)}
                  className="cursor-pointer overflow-hidden rounded-md bg-[#FAF8F5] p-3 flex justify-center group-hover:bg-[#F2ECE1] transition-colors"
                >
                  <div className="w-36 shadow-xl rounded-r transform group-hover:scale-105 transition-transform duration-200">
                    <BookCover
                      title={book.title}
                      author={book.author}
                      category={book.category}
                      imageUrl={book.imageUrl}
                      theme={book.coverTheme}
                      size="md"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#C88A2E] font-semibold uppercase tracking-wider text-[11px]">
                      {book.category}
                    </span>
                    <div className="flex items-center text-[#D4AF37] font-mono">
                      <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                      <span>{book.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedBookDetail(book)}
                    className="font-serif text-lg font-bold text-[#2C1E14] hover:text-[#9A6216] cursor-pointer transition-colors leading-snug line-clamp-1"
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#695545] font-medium">{book.author}</p>
                  <p className="text-xs text-[#8C7A6B] line-clamp-2 font-light pt-1">
                    {book.synopsis}
                  </p>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="pt-4 mt-4 border-t border-[#2C1E14]/5 flex items-center justify-between">
                <div>
                  <span className="font-serif text-xl font-bold text-[#2C1E14] tabular-nums">
                    ${book.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-800 block font-medium">
                    {book.stock} en stock
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookDetail(book)}
                    className="p-2 text-xs font-medium text-[#7A6858] hover:text-[#2C1E14] transition-colors"
                    title="Ver detalles"
                  >
                    Reseña
                  </button>
                  <button
                    onClick={() => addToCart(book, 1)}
                    className="px-3 py-1.5 bg-[#2C1E14] hover:bg-[#C88A2E] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
