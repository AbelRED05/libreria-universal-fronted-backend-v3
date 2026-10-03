import React, { useState, useEffect, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import { BookCover } from './BookCover';
import { X, Sparkles, Image as ImageIcon, Upload, Check, Trash2, HelpCircle } from 'lucide-react';

export const BookFormModal: React.FC = () => {
  const {
    isBookFormOpen,
    setIsBookFormOpen,
    editingBook,
    setEditingBook,
    addBook,
    updateBook,
    categories,
    showToast,
  } = useLibrary();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Novelas',
    price: 19.99,
    originalPrice: 24.00,
    imageUrl: '',
    coverTheme: 'navy' as 'navy' | 'emerald' | 'amber' | 'crimson' | 'slate' | 'terracotta',
    synopsis: '',
    stock: 15,
    pages: 320,
    publisher: 'Ediciones Universal',
    year: new Date().getFullYear(),
    isbn: '978-8420655383',
    featured: false,
    bestSeller: false,
    rating: 5.0,
    reviewsCount: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        category: editingBook.category,
        price: editingBook.price,
        originalPrice: editingBook.originalPrice || editingBook.price,
        imageUrl: editingBook.imageUrl,
        coverTheme: editingBook.coverTheme || 'navy',
        synopsis: editingBook.synopsis,
        stock: editingBook.stock,
        pages: editingBook.pages,
        publisher: editingBook.publisher,
        year: editingBook.year,
        isbn: editingBook.isbn,
        featured: editingBook.featured || false,
        bestSeller: editingBook.bestSeller || false,
        rating: editingBook.rating || 5.0,
        reviewsCount: editingBook.reviewsCount || 1,
      });
    } else {
      // Default empty form
      setFormData({
        title: '',
        author: '',
        category: categories[0]?.name || 'Novelas',
        price: 22.50,
        originalPrice: 26.00,
        imageUrl: '',
        coverTheme: 'navy',
        synopsis: '',
        stock: 20,
        pages: 350,
        publisher: 'Editorial Universal',
        year: new Date().getFullYear(),
        isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        featured: false,
        bestSeller: false,
        rating: 5.0,
        reviewsCount: 1,
      });
    }
  }, [editingBook, categories, isBookFormOpen]);

  if (!isBookFormOpen) return null;

  // Handle local file upload (drag or file picker)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor seleccione un archivo de imagen válido (JPG, PNG, WebP)', 'warning');
      return;
    }

    // Limit to reasonable size (~5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen supera los 5MB. Por favor elija una imagen más ligera.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        imageUrl: dataUrl,
      }));
      showToast('¡Imagen cargada y adaptada como libro 3D!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) return;

    setIsSubmitting(true);
    try {
      const saved = editingBook
        ? await updateBook(editingBook.id, formData)
        : await addBook(formData);

      if (saved) {
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsBookFormOpen(false);
    setEditingBook(null);
  };

  const presetImages = [
    { label: 'Novela (Verde Esmeralda)', url: '/src/assets/images/book_cien_anos_soledad_1790638655794.jpg', theme: 'emerald' },
    { label: 'Cosmología & Ciencia', url: '/src/assets/images/book_cosmos_astronomia_1790638666212.jpg', theme: 'navy' },
    { label: 'Filosofía Clásica', url: '/src/assets/images/book_filosofia_clasica_1790638673844.jpg', theme: 'terracotta' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FDFBF7] rounded-2xl max-w-4xl w-full border border-[#2C1E14]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2C1E14]/10 bg-[#FAF8F5] flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#2C1E14]">
            {editingBook ? `Editar Obra: ${editingBook.title}` : 'Añadir Nueva Obra al Catálogo'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#7A6858] hover:text-[#2C1E14] hover:bg-[#EFEAE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Form Fields Column */}
            <div className="md:col-span-8 space-y-4 max-h-[68vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                    Título de la Obra *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej. La Odisea"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                    Autor / Escritor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Ej. Homero"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md font-mono focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md font-mono focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>
              </div>

              {/* COVER IMAGE: URL-backed covers persist in Laravel; local uploads are preview-only. */}
              <div className="space-y-2.5 bg-[#F4EFE6] p-4 rounded-xl border border-[#2C1E14]/15">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#2C1E14] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#C88A2E]" />
                    <span>Imagen de Portada (Adaptada automáticamente a Libro Físico 3D)</span>
                  </label>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Quitar imagen</span>
                    </button>
                  )}
                </div>

                {/* File Upload Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 bg-white hover:bg-[#FAF8F5] border border-dashed border-[#C88A2E] rounded-lg text-xs font-semibold text-[#2C1E14] flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-[#C88A2E]" />
                      <span>Vista previa local (no se guarda)</span>
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.imageUrl.startsWith('data:') ? '(Imagen subida desde archivo)' : formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Pegar URL para guardarla en el catálogo..."
                      className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-lg focus:ring-1 focus:ring-[#C88A2E]"
                    />
                  </div>
                  <p className="text-[10px] text-[#7A6858]">
                    Para que la portada quede guardada en la base de datos, utiliza una URL de imagen.
                  </p>
                </div>

                {/* Preset Book Covers */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#7A6858] font-medium mr-1">O usar portadas de colección:</span>
                  {presetImages.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        imageUrl: preset.url,
                        coverTheme: preset.theme as any
                      })}
                      className="text-[10px] px-2 py-1 bg-white hover:bg-[#EFEAE0] border border-[#2C1E14]/15 rounded transition-colors text-[#2C1E14]"
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="text-[10px] px-2 py-1 bg-[#2C1E14] text-white rounded transition-colors"
                  >
                    Encuadernación de Tela
                  </button>
                </div>
              </div>

              {/* Cover Theme Picker for procedural clothbound */}
              {!formData.imageUrl && (
                <div>
                  <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                    Tono de Encuadernación Vintage
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { id: 'navy', name: 'Azul Marino', bg: 'bg-[#152238]' },
                      { id: 'emerald', name: 'Esmeralda', bg: 'bg-[#1b3d2f]' },
                      { id: 'terracotta', name: 'Terracota', bg: 'bg-[#4A2818]' },
                      { id: 'amber', name: 'Nogal Ámbar', bg: 'bg-[#38260F]' },
                      { id: 'crimson', name: 'Borgoña', bg: 'bg-[#3B141E]' },
                      { id: 'slate', name: 'Grafito', bg: 'bg-[#242A35]' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, coverTheme: t.id as any })}
                        className={`h-7 rounded flex items-center justify-center text-white ${t.bg} border-2 ${
                          formData.coverTheme === t.id ? 'border-[#C88A2E] ring-1 ring-[#C88A2E]' : 'border-transparent'
                        }`}
                        title={t.name}
                      >
                        {formData.coverTheme === t.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis / Introduction */}
              <div>
                <label className="text-xs font-semibold text-[#5A4738] block mb-1">
                  Introducción / Sinopsis Completa del Libro *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Reseña, contexto histórico o introducción narrativa..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E] leading-relaxed"
                />
              </div>

              {/* Editorial Technical Data */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#695545] block mb-1">
                    Editorial
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#2C1E14]/20 rounded"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#695545] block mb-1">
                    Páginas
                  </label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#2C1E14]/20 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#695545] block mb-1">
                    Año
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#2C1E14]/20 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#695545] block mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#2C1E14]/20 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live 3D Book Preview Column */}
            <div className="md:col-span-4 bg-[#F4EFE6] p-4 sm:p-5 rounded-xl border border-[#2C1E14]/10 flex flex-col items-center justify-between">
              <div className="w-full space-y-3">
                <div className="text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C1E14] block">
                    Formato de Libro 3D en Vivo
                  </span>
                  <p className="text-[10px] text-[#7A6858]">
                    Cualquier foto subida se encuaderna con lomo y grosor real
                  </p>
                </div>

                <div className="w-full max-w-[190px] mx-auto py-2">
                  <BookCover
                    title={formData.title || 'Título de Ejemplo'}
                    author={formData.author || 'Autor Célebre'}
                    category={formData.category}
                    imageUrl={formData.imageUrl}
                    theme={formData.coverTheme}
                    size="md"
                  />
                </div>

                <div className="text-center pt-2 space-y-1">
                  <p className="font-serif font-bold text-sm text-[#2C1E14] truncate">
                    {formData.title || 'Título de Ejemplo'}
                  </p>
                  <p className="text-xs text-[#7A6858] truncate">{formData.author || 'Nombre del Autor'}</p>
                  <p className="font-mono font-bold text-sm text-[#2C1E14] tabular-nums">
                    ${formData.price ? formData.price.toFixed(2) : '0.00'}
                  </p>
                  <span className="inline-block text-[10px] text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-mono">
                    {formData.stock} en inventario
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full pt-4 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-[#C88A2E] hover:bg-[#B37822] disabled:opacity-60 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {isSubmitting ? 'Guardando...' : editingBook ? 'Guardar Cambios' : 'Añadir al Catálogo'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2 px-4 bg-[#FAF8F5] border border-[#2C1E14]/20 text-[#2C1E14] text-xs font-medium rounded-lg hover:bg-[#EFEAE0] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
