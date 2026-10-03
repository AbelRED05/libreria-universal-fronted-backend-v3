import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { X, Star, ShoppingBag, Truck, ShieldCheck, Bookmark, ArrowRight, Check, Lock } from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBookDetail,
    setSelectedBookDetail,
    addToCart,
    setIsCartOpen,
    setIsCheckoutOpen,
    isLoggedIn,
    setIsAuthModalOpen,
    showToast,
  } = useLibrary();

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!selectedBookDetail) return null;

  const book = selectedBookDetail;
  const isOutOfStock = book.stock <= 0;

  const handleAddToCart = () => {
    const success = addToCart(book, quantity);
    if (success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1800);
    }
  };

  const handleBuyNow = () => {
    const success = addToCart(book, quantity);
    if (success) {
      if (!isLoggedIn) {
        showToast('Debe iniciar sesión en su cuenta de cliente para proceder con la compra', 'warning');
        setSelectedBookDetail(null);
        setIsAuthModalOpen(true);
        return;
      }
      setSelectedBookDetail(null);
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FDFBF7] rounded-2xl max-w-3xl w-full border border-[#2C1E14]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedBookDetail(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FAF8F5] text-[#2C1E14] hover:bg-[#EFEAE0] transition-colors shadow-sm"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Big Cover Preview */}
          <div className="md:col-span-5 bg-[#F4EFE6] p-6 sm:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#2C1E14]/10">
            <div className="w-full max-w-[240px] shadow-2xl rounded-r-lg transform transition-transform hover:scale-[1.02]">
              <BookCover
                title={book.title}
                author={book.author}
                category={book.category}
                imageUrl={book.imageUrl}
                theme={book.coverTheme}
                size="lg"
              />
            </div>

            {/* Editorial Guarantee Callouts */}
            <div className="w-full mt-6 pt-4 border-t border-[#2C1E14]/10 space-y-2 text-xs text-[#695545]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C88A2E] shrink-0" />
                <span>Envío protegido en empaque libre de ácido</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C88A2E] shrink-0" />
                <span>Garantía de edición auténtica y revisión editorial</span>
              </div>
            </div>
          </div>

          {/* Right Column: Book Details & Synopsis */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#C88A2E] font-semibold">
                  {book.category}
                </span>
                <span className="text-xs text-[#7A6858] font-mono">
                  Año {book.year}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E14] leading-tight">
                  {book.title}
                </h2>
                <p className="text-sm sm:text-base text-[#695545] font-medium mt-1">
                  Por {book.author}
                </p>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-mono font-bold text-[#2C1E14] tabular-nums">
                    {book.rating.toFixed(1)}
                  </span>
                  <span className="text-[#8C7A6B]">
                    ({book.reviewsCount} reseñas verificadas)
                  </span>
                </div>
                <span aria-hidden="true" className="text-[#2C1E14]/20">·</span>
                <span
                  className={`font-medium ${
                    isOutOfStock
                      ? 'text-red-700'
                      : book.stock <= 5
                      ? 'text-amber-800'
                      : 'text-emerald-800'
                  }`}
                >
                  {isOutOfStock ? 'Agotado' : `${book.stock} ejemplares disponibles`}
                </span>
              </div>

              {/* Price */}
              <div className="py-2 border-y border-[#2C1E14]/10 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#2C1E14] tabular-nums">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <span className="text-sm text-[#8C7A6B] line-through tabular-nums">
                    Precio regular: ${book.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Full Synopsis */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A4738]">
                  Sinopsis / Introducción de la obra
                </h4>
                <p className="text-sm text-[#4A3B32] leading-relaxed font-light whitespace-pre-line max-h-40 overflow-y-auto pr-2">
                  {book.synopsis}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F4EFE6] p-3 rounded-lg border border-[#2C1E14]/10 font-mono">
                <div>
                  <span className="text-[#8C7A6B] block">Editorial:</span>
                  <span className="text-[#2C1E14] font-medium truncate block">{book.publisher || 'Universal'}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Páginas:</span>
                  <span className="text-[#2C1E14] font-medium">{book.pages || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">ISBN:</span>
                  <span className="text-[#2C1E14] font-medium">{book.isbn}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Formato:</span>
                  <span className="text-[#2C1E14] font-medium">Tapa dura / Tela</span>
                </div>
              </div>
            </div>

            {/* Action Bar: Quantity & Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#5A4738]">Cantidad:</span>
                <div className="flex items-center border border-[#2C1E14]/20 rounded-md bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-2.5 py-1 text-sm text-[#2C1E14] hover:bg-[#F2ECE1] disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                    disabled={quantity >= book.stock || isOutOfStock}
                    className="px-2.5 py-1 text-sm text-[#2C1E14] hover:bg-[#F2ECE1] disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : addedAnimation
                      ? 'bg-[#1b3d2f] text-white shadow-md'
                      : 'bg-[#FAF8F5] border border-[#2C1E14] text-[#2C1E14] hover:bg-[#2C1E14] hover:text-white shadow-sm'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Añadido al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Añadir al Carrito</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3 px-4 rounded-lg text-xs font-semibold bg-[#C88A2E] hover:bg-[#B37822] text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isLoggedIn ? (
                    <>
                      <span>Comprar Ahora</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Iniciar Sesión para Comprar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
