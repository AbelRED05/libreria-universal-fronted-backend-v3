import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, ShieldCheck, FileText } from 'lucide-react';

export const TermsModal: React.FC = () => {
  const { isTermsModalOpen, setIsTermsModalOpen } = useLibrary();

  if (!isTermsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-[#FDFBF7] rounded-2xl max-w-xl w-full border border-[#2C1E14]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#2C1E14]/10 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C88A2E]" />
            <h2 className="font-serif text-lg font-bold text-[#2C1E14]">
              Términos de Servicio &amp; Devoluciones
            </h2>
          </div>
          <button
            onClick={() => setIsTermsModalOpen(false)}
            className="p-1 rounded-md text-[#7A6858] hover:text-[#2C1E14]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-[#5A4738] leading-relaxed">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-sm text-[#2C1E14]">
              1. Condiciones de Venta y Autenticidad
            </h3>
            <p>
              Librería Universal comercializa exclusivamente ejemplares legítimos provistos por casas editoriales certificadas y distribuidores autorizados. Cada compra incluye boleta o factura de venta electrónica.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif font-bold text-sm text-[#2C1E14]">
              2. Políticas de Devolución y Sustitución
            </h3>
            <p>
              El cliente cuenta con un plazo de 30 días continuos para devolver o canjear cualquier tomo si presenta vicios ocultos de impresión, pliegos en blanco o defectos estructurales en el lomo. La librería asume los costes de retorno.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif font-bold text-sm text-[#2C1E14]">
              3. Protección de Datos y Privacidad
            </h3>
            <p>
              Los datos recabados en los formularios de compra y registro se destinan única y estrictamente a la gestión logística de entrega de pedidos y comunicaciones sobre el Club de Lectores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
