import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { ShoppingBag, User as UserIcon, Shield, BookOpen, Menu, X, LogIn, LayoutDashboard, Store } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    user,
    isLoggedIn,
    cartTotalCount,
    setIsCartOpen,
    setIsProfileOpen,
    setIsAuthModalOpen,
    activeView,
    setActiveView,
    setIsFAQModalOpen,
    resetFilters,
  } = useLibrary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'shop' | 'admin') => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (view === 'shop') {
      window.scrollTo({ top: 520, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#2C1E14]/10 transition-colors">
      {/* Slim Promotional Trust Bar */}
      <div className="bg-[#2C1E14] text-[#F3E5AB] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="hidden sm:inline">Envío gratuito a todo el país en compras superiores a $40</span>
        <span className="sm:hidden">Envío gratis en compras &gt; $40</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <span className="text-[#D4AF37]">Cupón 10%: UNIVERSAL10</span>
      </div>

      {/* Main Top Bar (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Brand Element */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveView('shop');
              resetFilters();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-md bg-[#2C1E14] text-[#D4AF37] flex items-center justify-center shadow-inner group-hover:bg-[#3D2B1D] transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#2C1E14] block leading-tight">
                Librería Universal
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#7C6652] block font-medium">
                Biblioteca &amp; Editorial
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A3B32]">
          <button
            onClick={() => handleNavClick('shop')}
            className={`transition-colors hover:text-[#C88A2E] ${
              activeView === 'shop' ? 'text-[#C88A2E] font-semibold' : ''
            }`}
          >
            Catálogo General
          </button>
          <a
            href="#destacados"
            onClick={() => {
              setActiveView('shop');
              setTimeout(() => {
                document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="transition-colors hover:text-[#C88A2E]"
          >
            Obras Destacadas
          </a>
          {role === 'admin' && (
            <button
              onClick={() => setActiveView(activeView === 'admin' ? 'shop' : 'admin')}
              className="transition-colors flex items-center gap-1.5 text-[#C88A2E] font-semibold bg-amber-50/80 px-2.5 py-1 rounded-md border border-[#C88A2E]/30 hover:bg-amber-100"
            >
              {activeView === 'admin' ? (
                <>
                  <Store className="w-4 h-4 text-[#C88A2E]" />
                  <span>Ver Tienda</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-4 h-4 text-[#C88A2E]" />
                  <span>Panel Admin</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setIsFAQModalOpen(true)}
            className="transition-colors hover:text-[#C88A2E]"
          >
            Preguntas Frecuentes
          </button>
        </nav>

        {/* Zone 3: Primary Actions (User / Admin session + Cart) */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          
          {/* Admin Role Status Badge (shown when logged in as admin) */}
          {role === 'admin' && (
            <div className="hidden sm:flex items-center gap-1.5 bg-[#2C1E14] text-[#D4AF37] px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="truncate max-w-[120px]">Admin: {user.name}</span>
            </div>
          )}

          {/* User Account / Login Button */}
          {isLoggedIn ? (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 text-[#4A3B32] hover:text-[#2C1E14] hover:bg-[#F2ECE1] rounded-lg transition-colors flex items-center gap-1.5"
              title="Mi Perfil y Pedidos"
            >
              <div className="w-6 h-6 rounded-full bg-[#2C1E14] text-[#D4AF37] flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden xl:inline text-xs font-medium max-w-[100px] truncate">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-[#2C1E14] bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#2C1E14]/20 rounded-lg transition-colors flex items-center gap-1.5"
              title="Iniciar Sesión (Cliente o Administrador)"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
          )}

          {/* Shopping Cart Button with Dynamic Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#2C1E14] bg-[#F2ECE1] hover:bg-[#E7DFC8] rounded-lg transition-colors flex items-center gap-2"
            title="Ver Carrito de Compras"
          >
            <ShoppingBag className="w-5 h-5 text-[#2C1E14]" />
            <span className="text-xs font-semibold tabular-nums text-[#2C1E14] hidden sm:inline">
              Carrito
            </span>
            {cartTotalCount > 0 && (
              <span className="bg-[#C88A2E] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4A3B32] hover:text-[#2C1E14] rounded-lg"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#2C1E14]/10 bg-[#FBF9F4] px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('shop')}
              className="w-full text-left px-3 py-2 rounded-md font-medium text-[#2C1E14] hover:bg-[#F2ECE1]"
            >
              Catálogo General
            </button>
            <a
              href="#destacados"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-3 py-2 rounded-md font-medium text-[#2C1E14] hover:bg-[#F2ECE1]"
            >
              Obras Destacadas
            </a>
            {role === 'admin' && (
              <button
                onClick={() => {
                  setActiveView(activeView === 'admin' ? 'shop' : 'admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md font-medium text-[#C88A2E] hover:bg-amber-50 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                {activeView === 'admin' ? 'Ver Tienda de Libros' : 'Panel de Administración'}
              </button>
            )}
            <button
              onClick={() => {
                setIsFAQModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md font-medium text-[#2C1E14] hover:bg-[#F2ECE1]"
            >
              Preguntas Frecuentes
            </button>
          </div>

          <div className="pt-2 border-t border-[#2C1E14]/10">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-white rounded-lg border border-[#2C1E14]/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#2C1E14]">{user.name}</p>
                    <p className="text-[10px] text-[#7A6858]">{user.email || 'Lector'}</p>
                  </div>
                  <span className="text-[10px] bg-[#2C1E14] text-[#D4AF37] px-2 py-0.5 rounded font-mono font-semibold uppercase">
                    {role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs bg-[#2C1E14] text-white rounded-lg text-center font-medium"
                >
                  Mi Perfil y Pedidos
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 text-xs bg-[#2C1E14] text-white rounded-lg text-center font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>Iniciar Sesión / Identificarse</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
