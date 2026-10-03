import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Order } from '../types';
import { X, CheckCircle2, CreditCard, Truck, Landmark, ShieldCheck, ArrowRight, BookOpen, Lock } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartFinalTotal,
    completeCheckout,
    user,
    isLoggedIn,
    setIsAuthModalOpen,
    setIsProfileOpen,
    showToast,
  } = useLibrary();

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '+34 612 984 551',
    address: 'Calle Cervantes 42, 3º B',
    city: 'Madrid',
    notes: 'Entregar en portería si no respondo al timbre.',
    paymentMethod: 'Tarjeta' as 'Tarjeta' | 'Contraentrega' | 'Transferencia',
    cardNumber: '4532 •••• •••• 8821',
    cardExp: '12/28',
    cardCvc: '439',
  });

  useEffect(() => {
    if (user.name && user.name !== 'Lector Invitado') {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Debe iniciar sesión en su cuenta de cliente para proceder con la compra', 'warning');
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = completeCheckout({
        customerName: form.name,
        email: form.email,
        address: form.address,
        city: form.city,
        paymentMethod: form.paymentMethod,
      });
      setIsSubmitting(false);
      setCompletedOrder(order);
    }, 800);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FDFBF7] rounded-2xl max-w-2xl w-full border border-[#2C1E14]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2C1E14]/10 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C88A2E]" />
            <h2 className="font-serif text-lg font-bold text-[#2C1E14]">
              {!isLoggedIn
                ? 'Identificación Requerida'
                : completedOrder
                ? 'Confirmación de Pedido'
                : 'Finalizar Adquisición de Libros'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#7A6858] hover:text-[#2C1E14] hover:bg-[#EFEAE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If not logged in, block purchase and show prompt */}
        {!isLoggedIn ? (
          <div className="p-8 sm:p-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-[#C88A2E] mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl font-bold text-[#2C1E14]">
                Inicio de Sesión Requerido para Comprar
              </h3>
              <p className="text-xs sm:text-sm text-[#695545] max-w-md mx-auto leading-relaxed">
                Por motivos de seguridad y para registrar las obras en su biblioteca personal, la compra no puede proceder sin haber iniciado sesión en su cuenta de cliente.
              </p>
            </div>

            <div className="bg-[#F4EFE6] p-4 rounded-xl border border-[#2C1E14]/10 max-w-md mx-auto text-left text-xs space-y-2 text-[#5A4738]">
              <div className="flex items-center gap-2 text-[#2C1E14] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#C88A2E]" />
                <span>¿Por qué es necesario identificarse?</span>
              </div>
              <ul className="text-[11px] text-[#7A6858] space-y-1 pl-6 list-disc">
                <li>Garantiza la validez de su comprobante y número de pedido.</li>
                <li>Acumula puntos de lealtad en el Club de Lectores.</li>
                <li>Permite el seguimiento del envío protegido de sus ejemplares.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <button
                onClick={() => {
                  handleClose();
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-[#2C1E14] hover:bg-[#C88A2E] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Iniciar Sesión o Crear Cuenta
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 bg-[#FAF8F5] border border-[#2C1E14]/20 text-[#2C1E14] text-xs font-semibold rounded-lg hover:bg-[#EFEAE0] transition-colors cursor-pointer"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        ) : completedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#2C1E14]">
                ¡Gracias por su compra en Librería Universal!
              </h3>
              <p className="text-xs sm:text-sm text-[#695545] max-w-md mx-auto">
                Su orden ha sido registrada con éxito y nuestro equipo de encuadernación y empaque está preparando sus obras.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#F4EFE6] rounded-xl p-5 border border-[#2C1E14]/10 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#2C1E14]/10 pb-2">
                <span className="text-[#8C7A6B]">Nº de Orden:</span>
                <span className="font-bold text-[#2C1E14] text-sm">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Fecha:</span>
                <span className="text-[#2C1E14]">{completedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Destinatario:</span>
                <span className="text-[#2C1E14] font-semibold">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Dirección:</span>
                <span className="text-[#2C1E14]">{completedOrder.address}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Método de Pago:</span>
                <span className="text-[#2C1E14] font-medium">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-[#2C1E14]/10 pt-2 text-sm font-bold text-[#2C1E14]">
                <span>Total Abonado:</span>
                <span className="text-base text-[#1b3d2f]">${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setIsProfileOpen(true);
                }}
                className="flex-1 py-2.5 px-4 bg-[#FAF8F5] border border-[#2C1E14] text-[#2C1E14] text-xs font-semibold rounded-lg hover:bg-[#EFEAE0] transition-colors"
              >
                Ver en Historial de Pedidos
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 bg-[#2C1E14] text-[#FAF8F5] text-xs font-semibold rounded-lg hover:bg-[#C88A2E] transition-colors"
              >
                Continuar Navegando
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A4738] border-b border-[#2C1E14]/10 pb-1">
                  1. Datos de Envío y Contacto
                </h4>

                <div>
                  <label className="text-[11px] font-medium text-[#695545] block mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#695545] block mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#695545] block mb-1">
                    Teléfono Móvil
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[11px] font-medium text-[#695545] block mb-1">
                      Dirección y Número
                    </label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#695545] block mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A4738] border-b border-[#2C1E14]/10 pb-1">
                  2. Método de Pago
                </h4>

                <div className="space-y-2">
                  <label
                    onClick={() => setForm({ ...form, paymentMethod: 'Tarjeta' })}
                    className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                      form.paymentMethod === 'Tarjeta'
                        ? 'border-[#C88A2E] bg-[#FFFBF0]'
                        : 'border-[#2C1E14]/15 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#C88A2E]" />
                    <div className="text-xs flex-1">
                      <p className="font-semibold text-[#2C1E14]">Tarjeta de Crédito / Débito</p>
                      <p className="text-[#7A6858]">Visa, Mastercard, American Express</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setForm({ ...form, paymentMethod: 'Contraentrega' })}
                    className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                      form.paymentMethod === 'Contraentrega'
                        ? 'border-[#C88A2E] bg-[#FFFBF0]'
                        : 'border-[#2C1E14]/15 bg-white'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#C88A2E]" />
                    <div className="text-xs flex-1">
                      <p className="font-semibold text-[#2C1E14]">Pago Contraentrega</p>
                      <p className="text-[#7A6858]">Efectivo o datáfono al recibir</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setForm({ ...form, paymentMethod: 'Transferencia' })}
                    className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                      form.paymentMethod === 'Transferencia'
                        ? 'border-[#C88A2E] bg-[#FFFBF0]'
                        : 'border-[#2C1E14]/15 bg-white'
                    }`}
                  >
                    <Landmark className="w-5 h-5 text-[#C88A2E]" />
                    <div className="text-xs flex-1">
                      <p className="font-semibold text-[#2C1E14]">Transferencia Bancaria</p>
                      <p className="text-[#7A6858]">Envío de comprobante por correo</p>
                    </div>
                  </label>
                </div>

                {/* Simulated Card inputs if credit card selected */}
                {form.paymentMethod === 'Tarjeta' && (
                  <div className="bg-[#F4EFE6] p-3 rounded-lg space-y-2 border border-[#2C1E14]/10 text-xs">
                    <div>
                      <label className="text-[10px] text-[#7A6858] block mb-0.5">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-[#2C1E14]/20 rounded text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#7A6858] block mb-0.5">Exp (MM/AA)</label>
                        <input
                          type="text"
                          value={form.cardExp}
                          onChange={(e) => setForm({ ...form, cardExp: e.target.value })}
                          className="w-full px-2 py-1.5 bg-white border border-[#2C1E14]/20 rounded text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7A6858] block mb-0.5">CVC</label>
                        <input
                          type="password"
                          value={form.cardCvc}
                          onChange={(e) => setForm({ ...form, cardCvc: e.target.value })}
                          className="w-full px-2 py-1.5 bg-white border border-[#2C1E14]/20 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Row */}
            <div className="bg-[#F4EFE6] p-4 rounded-xl border border-[#2C1E14]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#695545] font-mono space-y-0.5 text-center sm:text-left">
                <p>Obras seleccionadas: <span className="font-bold text-[#2C1E14]">{cart.length}</span></p>
                <p>Total a pagar con envío: <span className="font-bold text-base text-[#2C1E14] font-serif tabular-nums">${cartFinalTotal.toFixed(2)}</span></p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-medium text-[#7A6858] hover:text-[#2C1E14]"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 sm:w-auto px-6 py-2.5 bg-[#C88A2E] hover:bg-[#B37822] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isSubmitting ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <span>Confirmar y Pagar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
