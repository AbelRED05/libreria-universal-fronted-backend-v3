import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, Truck } from 'lucide-react';

export const FAQModal: React.FC = () => {
  const { isFAQModalOpen, setIsFAQModalOpen } = useLibrary();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isFAQModalOpen) return null;

  const faqs = [
    {
      q: '¿Cómo se garantiza la calidad de las ediciones físicas?',
      a: 'Todas nuestras obras provienen de sellos editoriales de prestigio (Gredos, Sudamericana, Phaidon, Alianza, Dark Horse, etc.). Cada volumen es examinado meticulosamente en cuanto a encuadernación, gramaje de papel y fidelidad tipográfica antes de ingresar al inventario.'
    },
    {
      q: '¿Cuáles son los tiempos y costos de envío?',
      a: 'Ofrecemos envío gratuito en todas las compras a partir de $40. Para pedidos menores, el coste fijo es de $4.50. Los despachos urbanos toman de 24 a 48 horas hábiles, embalados en cartón rígido reciclado para proteger esquinas y lomos.'
    },
    {
      q: '¿Qué métodos de pago son admitidos?',
      a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, AMEX), pago contraentrega en efectivo o datáfono al momento de la entrega, y transferencias bancarias directas.'
    },
    {
      q: '¿Cómo funciona la política de cambios y devoluciones?',
      a: 'Dispone de 30 días naturales desde la recepción de su pedido para solicitar un cambio o reembolso completo si la obra presenta alguna imperfección de imprenta o defecto en su encuadernación.'
    },
    {
      q: '¿Qué es el Club de Lectores y cómo acumulo puntos?',
      a: 'Por cada compra realizada en Librería Universal acumula puntos de fidelidad (2 puntos por cada dólar gastado). Estos puntos pueden ser canjeados directamente como saldo a favor en futuras adquisiciones literarias.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-[#FDFBF7] rounded-2xl max-w-xl w-full border border-[#2C1E14]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#2C1E14]/10 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C88A2E]" />
            <h2 className="font-serif text-lg font-bold text-[#2C1E14]">
              Preguntas Frecuentes
            </h2>
          </div>
          <button
            onClick={() => setIsFAQModalOpen(false)}
            className="p-1 rounded-md text-[#7A6858] hover:text-[#2C1E14]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-[#2C1E14]/10 bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#2C1E14] hover:bg-[#FAF8F5]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C88A2E] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C7A6B] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-[#695545] leading-relaxed border-t border-[#2C1E14]/5 pt-2 font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
