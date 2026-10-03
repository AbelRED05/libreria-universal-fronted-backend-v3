import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Search, Compass, BookCheck, Sparkles, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';

export const HeroSection: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    books,
    setSelectedBookDetail,
  } = useLibrary();

  const featuredBook = books.find((b) => b.featured) || books[0];

  const handleCategoryQuickClick = (catName: string) => {
    setSelectedCategory(catName);
    const catalogElement = document.getElementById('catalogo-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#241A13] text-[#FAF8F5] pt-12 pb-16 lg:py-20 border-b border-[#3D2B1D]">
      {/* Background Atmosphere Image with Deep Measured Scrim */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
        <img
          src={HERO_IMAGE}
          alt="Interior de Librería Universal"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E140E] via-[#241A13]/90 to-[#18100B]/85 z-0" />

      {/* Decorative hairline grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Campaign Messaging */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest border-b border-[#D4AF37]/30 pb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Santuario de las Letras Universales · Fundada en 1924</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.15] text-balance">
              Donde cada página custodia una vida entera.
            </h1>

            <p className="text-base sm:text-lg text-[#D1C5B6] max-w-2xl font-light leading-relaxed">
              Explore una colección selecta de clásicos inmortales, tratados filosóficos, divulgación científica, novelas gráficas y ensayos que definen el pensamiento humano.
            </p>

            {/* Quick Hero Search Bar */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[#8F7C6B] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por título, autor (García Márquez, Sagan, Homero...)"
                  className="w-full pl-12 pr-28 py-3.5 bg-[#FAF8F5]/10 border border-[#D4AF37]/30 rounded-lg text-sm text-[#FAF8F5] placeholder-[#A89887] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-[#FAF8F5]/15 transition-all"
                />
                <button
                  onClick={() => {
                    const catalogElement = document.getElementById('catalogo-section');
                    if (catalogElement) catalogElement.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute right-2 px-4 py-2 bg-[#C88A2E] hover:bg-[#B37822] text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
                >
                  Explorar
                </button>
              </div>

              {/* Quick Category Jump Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-1">
                <span className="text-xs text-[#A89887] mr-1">Rutas rápidas:</span>
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryQuickClick(cat.name)}
                    className={`text-xs px-2.5 py-1 rounded transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-[#D4AF37] text-[#241A13] font-semibold'
                        : 'bg-[#FAF8F5]/10 text-[#E0D5C7] hover:bg-[#FAF8F5]/20 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Claim-to-Proof Quantitative Adjacency */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#3D2B1D] max-w-lg">
              <div>
                <p className="font-serif text-2xl font-bold text-[#FAF8F5] tabular-nums">2,850+</p>
                <p className="text-xs text-[#A89887]">Títulos en catálogo</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#FAF8F5] tabular-nums">100%</p>
                <p className="text-xs text-[#A89887]">Ediciones originales</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#FAF8F5] tabular-nums">24/48h</p>
                <p className="text-xs text-[#A89887]">Despacho nacional</p>
              </div>
            </div>
          </div>

          {/* Editorial Spotlight Card (Featured Book) */}
          {featuredBook && (
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative bg-[#1A120B]/90 border border-[#D4AF37]/30 rounded-xl p-5 sm:p-6 max-w-sm w-full shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1D] text-xs text-[#D4AF37]">
                  <span className="font-semibold uppercase tracking-wider">Libro Destacado del Mes</span>
                  <span className="font-mono tabular-nums">★ {featuredBook.rating.toFixed(1)}</span>
                </div>

                <div className="mt-4 flex gap-4 items-center">
                  <div className="w-28 shrink-0 shadow-lg rounded-r overflow-hidden aspect-[3/4] bg-[#2E2015]">
                    {featuredBook.imageUrl ? (
                      <img
                        src={featuredBook.imageUrl}
                        alt={featuredBook.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-center items-center p-2 text-center bg-[#2B1B10] text-[#D4AF37]">
                        <span className="text-[10px] font-bold line-clamp-2">{featuredBook.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[11px] text-[#A89887] uppercase tracking-wider font-medium">
                      {featuredBook.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#FAF8F5] leading-snug truncate">
                      {featuredBook.title}
                    </h3>
                    <p className="text-xs text-[#C5B5A4] truncate">{featuredBook.author}</p>
                    <p className="text-xs text-[#9B8977] line-clamp-2 pt-1 font-light">
                      {featuredBook.synopsis}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-[#FAF8F5] tabular-nums">
                        ${featuredBook.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => setSelectedBookDetail(featuredBook)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#E8C86A] transition-colors"
                      >
                        Ver reseña
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
