import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Check,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsFAQModalOpen, setIsTermsModalOpen, showToast, categories, setSelectedCategory, setActiveView } = useLibrary();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    showToast('¡Gracias por unirse a nuestro Boletín Literario! Recibirá recomendaciones exclusivas.');
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const handleSocialClick = (network: string) => {
    showToast(`Conectando con ${network} de Librería Universal`, 'info');
  };

  const handleCategoryClick = (catName: string) => {
    setActiveView('shop');
    setSelectedCategory(catName);
    const elem = document.getElementById('catalogo-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C130D] text-[#D1C5B6] border-t border-[#3D2B1D] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Identity & Story (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#D4AF37] text-[#1C130D] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-[#FAF8F5] block leading-tight">
                  Librería Universal
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium">
                  Biblioteca &amp; Casa Editorial
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A89887] leading-relaxed font-light">
              Dedicada desde 1924 a la difusión del saber humanístico, la divulgación científica y la preservación de las letras universales. Ofrecemos ediciones de impecable factura y asesoría bibliográfica personalizada.
            </p>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#A89887] font-semibold block mb-2">
                Encuéntrenos en redes
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSocialClick('Instagram')}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5]/10 hover:bg-[#D4AF37] hover:text-[#1C130D] flex items-center justify-center transition-colors"
                  aria-label="Instagram de Librería Universal"
                >
                  <Instagram className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick('Facebook')}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5]/10 hover:bg-[#D4AF37] hover:text-[#1C130D] flex items-center justify-center transition-colors"
                  aria-label="Facebook de Librería Universal"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick('X / Twitter')}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5]/10 hover:bg-[#D4AF37] hover:text-[#1C130D] flex items-center justify-center transition-colors"
                  aria-label="Twitter de Librería Universal"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick('WhatsApp')}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5]/10 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="WhatsApp de Librería Universal"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Physical Store & Contact Information (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#FAF8F5] uppercase tracking-wider">
              Sede Central &amp; Atención
            </h4>

            <ul className="space-y-2.5 text-xs text-[#B8A99A]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Av. de las Letras 1492, Barrio Histórico, 28014 Madrid</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+34 912 345 678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>contacto@libreriauniversal.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-[#FAF8F5]">Horario de Biblioteca:</span>
                  <span>Lunes a Sábado: 09:00 - 20:30 h</span>
                  <span className="block text-[11px] text-[#8C7A6B]">Domingos y Festivos: 10:00 - 15:00 h</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Secondary Navigation & Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#FAF8F5] uppercase tracking-wider">
              Exploración
            </h4>

            <ul className="space-y-1.5 text-xs text-[#B8A99A]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-[#3D2B1D]">
                <button
                  onClick={() => setIsFAQModalOpen(true)}
                  className="hover:text-[#D4AF37] transition-colors font-medium text-[#FAF8F5]"
                >
                  Preguntas Frecuentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Términos &amp; Envíos
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#FAF8F5] uppercase tracking-wider">
              Boletín Bibliográfico
            </h4>
            <p className="text-xs text-[#A89887] leading-relaxed">
              Suscríbase para recibir ensayos críticos, noticias sobre lanzamientos editoriales y cupones de temporada.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="su.correo@ejemplo.com"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5]/10 border border-[#D4AF37]/30 rounded-md text-[#FAF8F5] placeholder-[#8C7A6B] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1.5 bg-[#C88A2E] hover:bg-[#B37822] text-white rounded text-xs transition-colors flex items-center gap-1 font-medium"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Inscrito en el Club de Lectores!</span>
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Unboxed Legal Links */}
        <div className="pt-8 border-t border-[#3D2B1D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7A6B]">
          <p>© 1924–2026 Librería Universal S.A. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="hover:text-[#D1C5B6] transition-colors"
            >
              Políticas de Devolución
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="hover:text-[#D1C5B6] transition-colors"
            >
              Privacidad y Seguridad
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsFAQModalOpen(true)}
              className="hover:text-[#D1C5B6] transition-colors"
            >
              Guía de Compra
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
