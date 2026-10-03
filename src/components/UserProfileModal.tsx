import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, User, Package, Award, Clock, ShoppingBag, LogOut, CheckCircle2, ChevronDown, ChevronUp, Check, Sparkles } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    user,
    role,
    updateUser,
    orders,
    logoutUser,
    setIsAuthModalOpen,
    setIsCartOpen,
    categories,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    favoriteGenre: user.favoriteGenre,
  });

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      favoriteGenre: user.favoriteGenre,
    });
  }, [user, isEditing]);

  const selectedGenres = formData.favoriteGenre
    ? formData.favoriteGenre.split(',').map((g) => g.trim()).filter(Boolean)
    : [];

  const handleToggleGenre = (genreName: string) => {
    let updated: string[];
    if (selectedGenres.includes(genreName)) {
      updated = selectedGenres.filter((g) => g !== genreName);
    } else {
      updated = [...selectedGenres, genreName];
    }
    setFormData((prev) => ({
      ...prev,
      favoriteGenre: updated.join(', '),
    }));
  };

  if (!isProfileOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
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
            <User className="w-5 h-5 text-[#C88A2E]" />
            <h2 className="font-serif text-lg font-bold text-[#2C1E14]">
              Cuenta de Lector
            </h2>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-1 rounded-md text-[#7A6858] hover:text-[#2C1E14] hover:bg-[#EFEAE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#2C1E14]/10 bg-[#F4EFE6] px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#2C1E14] text-[#2C1E14]'
                : 'border-transparent text-[#7A6858] hover:text-[#2C1E14]'
            }`}
          >
            Datos Personales &amp; Membresía
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#2C1E14] text-[#2C1E14]'
                : 'border-transparent text-[#7A6858] hover:text-[#2C1E14]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Mis Pedidos ({orders.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* Member Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#2C1E14] to-[#422C1D] text-white shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                    Club de Lectores Ilustres
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#FAF8F5] mt-1">
                    {user.name}
                  </h3>
                  <p className="text-xs text-[#D1C5B6]">
                    Miembro desde: {user.memberSince} · Rol: {user.role === 'admin' ? 'Administrador' : 'Comprador'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs text-[#F3E5AB]">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-mono font-bold tabular-nums">{user.loyaltyPoints}</span> pts
                  </div>
                  <p className="text-[10px] text-[#A89887] mt-1">Canjeables por libros</p>
                </div>
              </div>

              {/* Profile Details or Edit Form */}
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#5A4738] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C88A2E]" />
                          <span>Géneros Literarios Favoritos</span>
                        </label>
                        <span className="text-[11px] text-[#7A6858] font-mono">
                          {selectedGenres.length} seleccionados
                        </span>
                      </div>

                      <p className="text-[11px] text-[#7A6858]">
                        Seleccione de las categorías disponibles en la librería para personalizar sus gustos:
                      </p>

                      {/* Interactive Category Selector Pills linked to store categories */}
                      <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#2C1E14]/15 bg-[#FAF8F5] max-h-40 overflow-y-auto">
                        {categories.map((cat) => {
                          const isSelected = selectedGenres.includes(cat.name);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleToggleGenre(cat.name)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                                isSelected
                                  ? 'bg-[#2C1E14] text-[#F3E5AB] border border-[#D4AF37] shadow-xs'
                                  : 'bg-white text-[#5A4738] border border-[#2C1E14]/15 hover:border-[#C88A2E] hover:text-[#2C1E14]'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                                  isSelected ? 'bg-[#D4AF37] text-[#2C1E14]' : 'border border-[#2C1E14]/30'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span>{cat.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#7A6858] hover:text-[#2C1E14]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2C1E14] text-white text-xs font-semibold rounded-lg hover:bg-[#C88A2E] transition-colors cursor-pointer"
                    >
                      Guardar Datos
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs bg-[#F4EFE6] p-4 rounded-xl border border-[#2C1E14]/10">
                    <div>
                      <span className="text-[#8C7A6B] block">Correo:</span>
                      <span className="text-[#2C1E14] font-medium">{user.email || 'No especificado'}</span>
                    </div>
                    <div>
                      <span className="text-[#8C7A6B] block">Teléfono de contacto:</span>
                      <span className="text-[#2C1E14] font-medium">{user.phone || 'No especificado'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#8C7A6B] block mb-1">Preferencias de lectura:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {user.favoriteGenre && user.favoriteGenre.split(',').map((g) => g.trim()).filter(Boolean).length > 0 ? (
                          user.favoriteGenre.split(',').map((g) => g.trim()).filter(Boolean).map((genre, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#2C1E14] text-[#F3E5AB] border border-[#D4AF37]/30 shadow-2xs"
                            >
                              {genre}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#7A6858] italic text-xs">Sin géneros seleccionados</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[#8C7A6B] block">Dirección por defecto:</span>
                      <span className="text-[#2C1E14] font-medium">Calle Cervantes 42, Madrid</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-[#2C1E14]/10">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-semibold text-[#C88A2E] hover:text-[#9A6216]"
                    >
                      Editar Información Personal
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="text-xs text-[#8C7A6B] hover:text-[#2C1E14] flex items-center gap-1 font-medium transition-colors"
                      >
                        <span>Cambiar Cuenta</span>
                      </button>

                      <button
                        onClick={() => {
                          logoutUser();
                          setIsProfileOpen(false);
                        }}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Orders Tab */
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-[#8C7A6B] space-y-2">
                  <Package className="w-10 h-10 mx-auto text-[#C5B5A4]" />
                  <p className="text-sm font-medium">No tiene pedidos registrados aún.</p>
                </div>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-[#2C1E14]/10 shadow-xs overflow-hidden"
                    >
                      <div
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#2C1E14]">
                              {order.id}
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A6858]">
                            Fecha: {order.date} · {order.items.length} obras · Total: ${order.total.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#7A6858]">
                          <span className="font-mono font-bold text-[#2C1E14] text-sm tabular-nums">
                            ${order.total.toFixed(2)}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expanded Order Items */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-[#2C1E14]/10 bg-[#FAF8F5]/50 space-y-2 text-xs">
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center py-1">
                                <div>
                                  <p className="font-semibold text-[#2C1E14]">{item.bookTitle}</p>
                                  <p className="text-[11px] text-[#7A6858]">
                                    {item.author} (x{item.quantity})
                                  </p>
                                </div>
                                <span className="font-mono tabular-nums text-[#2C1E14]">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-[#2C1E14]/10 text-[11px] text-[#7A6858] flex justify-between">
                            <span>Envío a: {order.address}, {order.city}</span>
                            <span>Pago: {order.paymentMethod}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
