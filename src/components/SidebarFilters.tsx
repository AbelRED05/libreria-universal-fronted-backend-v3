import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Search, Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SidebarFiltersProps {
  totalResults: number;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({ totalResults }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    resetFilters,
    books,
  } = useLibrary();

  // Calculate book count for each category
  const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.name] = books.filter(
      (b) => b.category.toLowerCase() === cat.name.toLowerCase()
    ).length;
    return acc;
  }, {});

  const isFiltered =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    priceRange[1] < 80 ||
    priceRange[0] > 0 ||
    inStockOnly ||
    sortBy !== 'featured';

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6 bg-[#FDFBF7] lg:border-r border-[#2C1E14]/10 lg:pr-6 pb-8">
      {/* Header and Filter Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2C1E14]/10">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C88A2E]" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[#2C1E14]">
            Filtros &amp; Búsqueda
          </h2>
        </div>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#C88A2E] hover:text-[#9A6216] font-medium flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* 1. Real-time Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#5A4738] uppercase tracking-wider block">
          Buscar por título o autor
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej: García Márquez, Cosmos..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#2C1E14]/15 rounded-md text-[#2C1E14] placeholder-[#A08F80] focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/50 focus:border-[#C88A2E] transition-all"
          />
        </div>
      </div>

      {/* 2. Sorting Select */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#5A4738] uppercase tracking-wider block">
          Ordenar resultados
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full py-2 px-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#2C1E14]/15 rounded-md text-[#2C1E14] focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/50 focus:border-[#C88A2E]"
        >
          <option value="featured">Destacados y recomendados</option>
          <option value="rating">Mejor calificados (★)</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="title-asc">Título: Alfabético (A - Z)</option>
        </select>
      </div>

      {/* 3. Category Filter List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#5A4738] uppercase tracking-wider block">
            Categorías
          </label>
          <span className="text-[11px] text-[#8C7A6B] tabular-nums font-mono">
            {categories.length} géneros
          </span>
        </div>

        <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
          {/* All categories button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm flex items-center justify-between transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#2C1E14] text-white font-medium shadow-xs'
                : 'text-[#4A3B32] hover:bg-[#F2ECE1]'
            }`}
          >
            <span>Todas las categorías</span>
            <span
              className={`text-xs tabular-nums ${
                selectedCategory === 'all' ? 'text-white/80' : 'text-[#8C7A6B]'
              }`}
            >
              {books.length}
            </span>
          </button>

          {/* Individual categories */}
          {categories.map((cat) => {
            const count = categoryCounts[cat.name] || 0;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#2C1E14] text-white font-medium shadow-xs'
                    : 'text-[#4A3B32] hover:bg-[#F2ECE1]'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span
                  className={`text-xs tabular-nums ${
                    isSelected ? 'text-white/80' : 'text-[#8C7A6B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range Slider */}
      <div className="space-y-2.5 pt-2 border-t border-[#2C1E14]/10">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-[#5A4738] uppercase tracking-wider">
            Precio Máximo
          </label>
          <span className="font-mono font-bold text-[#2C1E14] tabular-nums">
            Hasta ${priceRange[1].toFixed(2)}
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="80"
          step="2"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
          className="w-full accent-[#C88A2E] cursor-pointer h-1.5 bg-[#E4DC CE] rounded-lg"
        />

        <div className="flex justify-between text-[11px] text-[#8C7A6B] font-mono tabular-nums">
          <span>Min: $10.00</span>
          <span>Max: $80.00</span>
        </div>
      </div>

      {/* 5. In-Stock Only Toggle */}
      <div className="pt-2 border-t border-[#2C1E14]/10">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-[#4A3B32] select-none hover:text-[#2C1E14]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-[#C88A2E] accent-[#C88A2E] border-gray-300 focus:ring-[#C88A2E]"
          />
          <span>Mostrar solo libros con stock disponible</span>
        </label>
      </div>

      {/* Result Counter Adjacency */}
      <div className="p-3 bg-[#F4EFE6] rounded-md border border-[#2C1E14]/5 text-xs text-[#5A4738] flex items-center justify-between">
        <span>Catálogo filtrado:</span>
        <span className="font-semibold text-[#2C1E14] tabular-nums font-mono">
          {totalResults} {totalResults === 1 ? 'libro' : 'libros'}
        </span>
      </div>
    </aside>
  );
};
