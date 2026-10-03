import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import { BookCover } from './BookCover';
import {
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  BookOpen,
  DollarSign,
  AlertTriangle,
  Layers,
  Search,
  Check,
  X,
  ExternalLink,
  Shield,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    books,
    deleteBook,
    updateBook,
    categories,
    addCategory,
    deleteCategory,
    setRole,
    setActiveView,
    setIsBookFormOpen,
    setEditingBook,
    resetDefaultCatalog,
    showToast,
  } = useLibrary();

  const [adminTab, setAdminTab] = useState<'inventory' | 'categories'>('inventory');
  const [adminSearch, setAdminSearch] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Inline editing state for quick price and stock adjustments
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlinePrice, setInlinePrice] = useState<number>(0);
  const [inlineStock, setInlineStock] = useState<number>(0);

  // Deletion confirmation modal
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  // Statistics
  const totalBooksCount = books.length;
  const inventoryTotalValue = books.reduce((acc, book) => acc + book.price * (book.totalCopies ?? book.stock), 0);
  const lowStockBooks = books.filter((b) => b.stock <= 5);
  const totalCategoriesCount = categories.length;

  // Filtered books for table
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(adminSearch.toLowerCase()) ||
      b.isbn.includes(adminSearch);
    const matchesCat = categoryFilter === 'all' || b.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleStartInlineEdit = (book: Book) => {
    setInlineEditingId(book.id);
    setInlinePrice(book.price);
    setInlineStock(book.stock);
  };

  const handleSaveInlineEdit = async (id: string) => {
    const saved = await updateBook(id, { price: inlinePrice, stock: inlineStock });
    if (saved) setInlineEditingId(null);
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingId(null);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const created = await addCategory(newCatName, newCatDesc);
    if (created) {
      setNewCatName('');
      setNewCatDesc('');
    }
  };

  const handleOpenAddBook = () => {
    setEditingBook(null);
    setIsBookFormOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    setEditingBook(book);
    setIsBookFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#241A13] text-white p-6 sm:p-8 rounded-2xl border border-[#3D2B1D] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Panel de Control Administrativo</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5]">
            Gestión de Inventario &amp; Catálogo
          </h1>
          <p className="text-xs sm:text-sm text-[#D1C5B6]">
            Administre libros, modifique precios, supervise el stock y añada nuevas categorías a la biblioteca.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setRole('client');
              setActiveView('shop');
            }}
            className="px-4 py-2.5 bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Ver Tienda (Modo Cliente)</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAddBook}
            className="px-4 py-2.5 bg-[#C88A2E] hover:bg-[#B37822] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nuevo Libro</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#2C1E14]/10 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium uppercase tracking-wider">Total Catálogo</span>
            <BookOpen className="w-4 h-4 text-[#C88A2E]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E14] mt-2 tabular-nums">
            {totalBooksCount}
          </p>
          <p className="text-[11px] text-[#7A6858] mt-1">Obras registradas</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#2C1E14]/10 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium uppercase tracking-wider">Valor Inventario</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E14] mt-2 tabular-nums">
            ${inventoryTotalValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-[#7A6858] mt-1">Valoración total en stock</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#2C1E14]/10 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium uppercase tracking-wider">Bajo Stock / Agotados</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockBooks.length > 0 ? 'text-amber-600' : 'text-gray-400'}`} />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E14] mt-2 tabular-nums">
            {lowStockBooks.length}
          </p>
          <p className="text-[11px] text-[#7A6858] mt-1">Requieren reposición</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#2C1E14]/10 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-medium uppercase tracking-wider">Categorías Activas</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E14] mt-2 tabular-nums">
            {totalCategoriesCount}
          </p>
          <p className="text-[11px] text-[#7A6858] mt-1">Géneros disponibles</p>
        </div>
      </div>

      {/* Tabs: Inventory Table vs Category Management */}
      <div className="flex items-center justify-between border-b border-[#2C1E14]/15 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('inventory')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              adminTab === 'inventory'
                ? 'bg-[#2C1E14] text-white shadow-xs'
                : 'text-[#695545] hover:text-[#2C1E14] hover:bg-[#F2ECE1]'
            }`}
          >
            Inventario de Libros (CRUD)
          </button>
          <button
            onClick={() => setAdminTab('categories')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              adminTab === 'categories'
                ? 'bg-[#2C1E14] text-white shadow-xs'
                : 'text-[#695545] hover:text-[#2C1E14] hover:bg-[#F2ECE1]'
            }`}
          >
            Gestión de Categorías ({categories.length})
          </button>
        </div>

        <button
          onClick={resetDefaultCatalog}
          className="text-xs text-[#8C7A6B] hover:text-[#2C1E14] flex items-center gap-1 font-medium transition-colors"
          title="Restaurar libros y categorías predeterminadas de prueba"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restaurar Catálogo Demo</span>
        </button>
      </div>

      {/* Tab 1: INVENTORY TABLE */}
      {adminTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Buscar por título, autor o ISBN..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-[#695545]">Filtrar género:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-[#2C1E14]/10 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#2C1E14]/10 text-[#695545] font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-16">Portada</th>
                    <th className="py-3 px-4">Título y Autor</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Precio ($)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C1E14]/5">
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#8C7A6B]">
                        No se encontraron libros que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => {
                      const isInline = inlineEditingId === book.id;
                      const isLow = book.stock <= 5;
                      const isOut = book.stock === 0;

                      return (
                        <tr key={book.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          {/* Mini Cover */}
                          <td className="py-2.5 px-4">
                            <div className="w-10 aspect-[3/4] shadow-xs rounded-r">
                              <BookCover
                                title={book.title}
                                author={book.author}
                                category={book.category}
                                imageUrl={book.imageUrl}
                                theme={book.coverTheme}
                                size="sm"
                              />
                            </div>
                          </td>

                          {/* Title & Author */}
                          <td className="py-2.5 px-4 max-w-xs">
                            <p className="font-serif font-bold text-[#2C1E14] text-xs truncate">
                              {book.title}
                            </p>
                            <p className="text-[#7A6858] text-[11px] truncate">
                              {book.author}
                            </p>
                            <p className="text-[#A08F80] text-[10px] font-mono mt-0.5">
                              ISBN: {book.isbn}
                            </p>
                          </td>

                          {/* Category */}
                          <td className="py-2.5 px-4">
                            <span className="text-xs text-[#5A4738] font-medium">
                              {book.category}
                            </span>
                          </td>

                          {/* Price (Inline Editable) */}
                          <td className="py-2.5 px-4 font-mono">
                            {isInline ? (
                              <input
                                type="number"
                                step="0.01"
                                min="1"
                                value={inlinePrice}
                                onChange={(e) => setInlinePrice(parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 bg-white border border-[#C88A2E] rounded text-xs"
                              />
                            ) : (
                              <span className="font-bold text-[#2C1E14] tabular-nums">
                                ${book.price.toFixed(2)}
                              </span>
                            )}
                          </td>

                          {/* Stock (Inline Editable) */}
                          <td className="py-2.5 px-4 font-mono">
                            {isInline ? (
                              <input
                                type="number"
                                min="0"
                                value={inlineStock}
                                onChange={(e) => setInlineStock(parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-white border border-[#C88A2E] rounded text-xs"
                              />
                            ) : (
                              <span className="tabular-nums font-semibold">{book.stock} unid.</span>
                            )}
                          </td>

                          {/* Stock status */}
                          <td className="py-2.5 px-4">
                            {isOut ? (
                              <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                                Agotado
                              </span>
                            ) : isLow ? (
                              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                                Bajo stock
                              </span>
                            ) : (
                              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                                Disponible
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-4 text-right whitespace-nowrap">
                            {isInline ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveInlineEdit(book.id)}
                                  className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                  title="Guardar ajuste de precio y stock"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={handleCancelInlineEdit}
                                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                  title="Cancelar"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleStartInlineEdit(book)}
                                  className="px-2 py-1 text-[11px] font-medium text-[#7A6858] hover:text-[#2C1E14] bg-[#FAF8F5] hover:bg-[#EFEAE0] rounded border border-[#2C1E14]/10 transition-colors"
                                  title="Ajustar precio y stock rápidamente"
                                >
                                  Precio/Stock
                                </button>
                                <button
                                  onClick={() => handleOpenEditBook(book)}
                                  className="p-1.5 text-[#7A6858] hover:text-[#C88A2E] hover:bg-[#FAF8F5] rounded transition-colors"
                                  title="Editar información completa de la obra"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setBookToDelete(book)}
                                  className="p-1.5 text-[#8C7A6B] hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Eliminar obra del catálogo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#2C1E14]/10 text-xs text-[#7A6858] flex justify-between items-center">
              <span>
                Mostrando <strong className="text-[#2C1E14]">{filteredBooks.length}</strong> de{' '}
                <strong className="text-[#2C1E14]">{books.length}</strong> títulos en inventario
              </span>
              <span className="font-mono text-[11px]">Control de Inventario V1.4</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CATEGORY MANAGEMENT */}
      {adminTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Add Category */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#2C1E14]/10 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#2C1E14]/10">
              <FolderPlus className="w-5 h-5 text-[#C88A2E]" />
              <h3 className="font-serif text-base font-bold text-[#2C1E14]">
                Añadir Nueva Categoría
              </h3>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej. Poesía, Teatro, Biografías..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                  Descripción Breve
                </label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Temática o contexto de los libros de este género..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#2C1E14] hover:bg-[#C88A2E] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Categoría</span>
              </button>
            </form>
          </div>

          {/* Right List: Existing Categories */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#2C1E14]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2C1E14]/10">
              <h3 className="font-serif text-base font-bold text-[#2C1E14]">
                Categorías Existentes ({categories.length})
              </h3>
              <span className="text-xs text-[#8C7A6B]">
                Solo se pueden eliminar categorías sin libros asociados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const bookCount = books.filter(
                  (b) => b.category.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-lg border border-[#2C1E14]/10 bg-[#FAF8F5] flex flex-col justify-between space-y-2 hover:border-[#C88A2E]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#2C1E14] text-xs sm:text-sm">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-[#7A6858] line-clamp-2 mt-0.5">
                          {cat.description}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono font-bold bg-[#EFEAE0] text-[#2C1E14] px-2 py-0.5 rounded shrink-0 tabular-nums">
                        {bookCount} {bookCount === 1 ? 'libro' : 'libros'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#2C1E14]/10 flex items-center justify-between">
                      <span className="text-[10px] text-[#8C7A6B] font-mono">ID: {cat.id}</span>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        disabled={bookCount > 0}
                        className={`text-[11px] font-medium flex items-center gap-1 transition-colors ${
                          bookCount > 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-700 hover:text-red-900'
                        }`}
                        title={
                          bookCount > 0
                            ? `Contiene ${bookCount} libros. Reasígnelos primero.`
                            : 'Eliminar categoría'
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-xl max-w-md w-full p-6 border border-[#2C1E14]/15 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#2C1E14]">
                ¿Eliminar esta obra del catálogo?
              </h3>
              <p className="text-xs text-[#695545]">
                Está a punto de borrar <strong className="text-[#2C1E14]">"{bookToDelete.title}"</strong> de {bookToDelete.author}. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBookToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const deleted = await deleteBook(bookToDelete.id);
                  if (deleted) setBookToDelete(null);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-red-700 hover:bg-red-800 text-white transition-colors"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
