import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles, Lock } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
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
    setIsCheckoutOpen,
    setActiveView,
    isLoggedIn,
    setIsAuthModalOpen,
    showToast,
  } = useLibrary();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      showToast('Debe iniciar sesión en su cuenta de cliente para proceder con la compra', 'warning');
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingThreshold = 40;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#2C1E14]/15 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#2C1E14]/10 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2C1E14] text-[#D4AF37] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2C1E14] leading-tight">
                Bolsa de Libros
              </h2>
              <p className="text-xs text-[#7A6858] font-mono tabular-nums">
                {cartTotalCount} {cartTotalCount === 1 ? 'ejemplar' : 'ejemplares'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-[#8C7A6B] hover:text-red-700 px-2 py-1 transition-colors"
                title="Vaciar todo el carrito"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-md text-[#7A6858] hover:text-[#2C1E14] hover:bg-[#EFEAE0] transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-2.5 bg-[#F4EFE6] border-b border-[#2C1E14]/10 text-xs">
          {amountToFreeShipping > 0 ? (
            <p className="text-[#695545]">
              Agrega <span className="font-bold text-[#2C1E14] tabular-nums">${amountToFreeShipping.toFixed(2)}</span> más para obtener <span className="font-semibold text-[#1b3d2f]">Envío Gratuito</span>
            </p>
          ) : (
            <p className="text-[#1b3d2f] font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              ¡Felicidades! Tienes Envío Estándar Gratuito
            </p>
          )}
          <div className="w-full bg-[#E5DDD0] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#C88A2E] h-full transition-all duration-300"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#A08F80]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#2C1E14]">
                  Su bolsa de libros está vacía
                </h3>
                <p className="text-xs text-[#7A6858] max-w-xs">
                  Recorra nuestros anaqueles virtuales y añada obras maestras de la literatura y el pensamiento.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('shop');
                }}
                className="mt-2 px-4 py-2 bg-[#2C1E14] text-white text-xs font-semibold rounded-lg hover:bg-[#C88A2E] transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.book.id}
                className="flex gap-3.5 p-3 rounded-lg bg-white border border-[#2C1E14]/10 shadow-xs"
              >
                {/* Book Thumbnail */}
                <div className="w-16 shrink-0 aspect-[3/4]">
                  <BookCover
                    title={item.book.title}
                    author={item.book.author}
                    category={item.book.category}
                    imageUrl={item.book.imageUrl}
                    theme={item.book.coverTheme}
                    size="sm"
                  />
                </div>

                {/* Info & Controls */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-serif text-sm font-bold text-[#2C1E14] truncate">
                      {item.book.title}
                    </h4>
                    <p className="text-xs text-[#7A6858] truncate">{item.book.author}</p>
                    <p className="font-mono text-xs font-bold text-[#2C1E14] tabular-nums pt-1">
                      ${item.book.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Steppers & Remove */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#2C1E14]/20 rounded bg-[#FAF8F5]">
                      <button
                        onClick={() => updateCartQuantity(item.book.id, -1)}
                        className="px-2 py-0.5 text-xs text-[#2C1E14] hover:bg-[#EFEAE0]"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-mono font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.book.id, 1)}
                        disabled={item.quantity >= item.book.stock}
                        className="px-2 py-0.5 text-xs text-[#2C1E14] hover:bg-[#EFEAE0] disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.book.id)}
                      className="p-1 text-[#8C7A6B] hover:text-red-700 transition-colors"
                      title="Eliminar libro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coupon and Summary Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#2C1E14]/10 bg-[#FAF8F5] space-y-3.5">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Cupón {appliedCoupon.code} (-{appliedCoupon.percent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-emerald-700 hover:text-red-600 font-semibold"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Cupón (ej. UNIVERSAL10)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C88A2E] uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#2C1E14] hover:bg-[#4A3B32] text-white text-xs font-semibold rounded-md transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 pl-1">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#5A4738] font-mono">
              <div className="flex justify-between">
                <span>Subtotal ({cartTotalCount} unid.):</span>
                <span className="tabular-nums">${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Descuento aplicado:</span>
                  <span className="tabular-nums">-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Costos de envío:</span>
                <span className="tabular-nums">
                  {cartShipping === 0 ? 'Gratis' : `$${cartShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2C1E14]/10 text-sm font-bold text-[#2C1E14] font-serif">
                <span>Total a Pagar:</span>
                <span className="font-mono tabular-nums text-base">
                  ${cartFinalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Login Warning if not logged in */}
            {!isLoggedIn && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#C88A2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Identificación de Cliente Requerida</p>
                  <p className="text-[11px] text-amber-800 leading-tight mt-0.5">
                    Debe iniciar sesión en su cuenta para procesar el pedido y registrar las obras adquiridas.
                  </p>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-[#C88A2E] hover:bg-[#B37822] text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoggedIn ? (
                <>
                  <span>Continuar al Pago Seguro</span>
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
        )}
      </div>
    </div>
  );
};
