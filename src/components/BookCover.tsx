import React, { useState } from 'react';
import { Book as BookIcon } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  category: string;
  imageUrl?: string;
  theme?: 'emerald' | 'amber' | 'navy' | 'crimson' | 'slate' | 'terracotta';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const themeStyles = {
  emerald: {
    bg: 'bg-[#1b3d2f]',
    accent: '#D4AF37',
    border: 'border-[#2d5a47]',
    spine: 'bg-[#12281e]',
    text: 'text-[#F3E5AB]',
    subtitle: 'text-[#A3C9A8]',
    emboss: 'rgba(212, 175, 55, 0.35)'
  },
  navy: {
    bg: 'bg-[#152238]',
    accent: '#C5A059',
    border: 'border-[#233554]',
    spine: 'bg-[#0d1624]',
    text: 'text-[#E6E8E6]',
    subtitle: 'text-[#8892B0]',
    emboss: 'rgba(197, 160, 89, 0.35)'
  },
  terracotta: {
    bg: 'bg-[#4A2818]',
    accent: '#E6A15C',
    border: 'border-[#6B3B24]',
    spine: 'bg-[#331B10]',
    text: 'text-[#FCEADE]',
    subtitle: 'text-[#D08C60]',
    emboss: 'rgba(230, 161, 92, 0.35)'
  },
  crimson: {
    bg: 'bg-[#3B141E]',
    accent: '#D4AF37',
    border: 'border-[#5C202F]',
    spine: 'bg-[#260C13]',
    text: 'text-[#FAD2E1]',
    subtitle: 'text-[#C97B8F]',
    emboss: 'rgba(212, 175, 55, 0.35)'
  },
  amber: {
    bg: 'bg-[#38260F]',
    accent: '#F3C969',
    border: 'border-[#5A3F1B]',
    spine: 'bg-[#24180A]',
    text: 'text-[#FFF2D7]',
    subtitle: 'text-[#E0A96D]',
    emboss: 'rgba(243, 201, 105, 0.35)'
  },
  slate: {
    bg: 'bg-[#242A35]',
    accent: '#A0B2C6',
    border: 'border-[#384252]',
    spine: 'bg-[#181D25]',
    text: 'text-[#F0F4F8]',
    subtitle: 'text-[#8A9BAE]',
    emboss: 'rgba(160, 178, 198, 0.35)'
  }
};

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  category,
  imageUrl,
  theme = 'navy',
  className = '',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);
  const selectedTheme = themeStyles[theme] || themeStyles.navy;

  const hasValidImage = imageUrl && imageUrl.trim().length > 0 && !imageError;

  // Sizing dimensions for the 3D book thickness effect
  const isSm = size === 'sm';
  const isLg = size === 'lg' || size === 'xl';

  return (
    <div
      className={`relative select-none transition-transform duration-300 group-hover:scale-[1.02] flex items-center justify-center ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Physical Hardcover Assembly */}
      <div
        className="relative w-full aspect-[1/1.42] rounded-r-[5px] rounded-l-[3px] transition-all duration-300"
        style={{
          boxShadow: isSm
            ? '2px 4px 10px rgba(28, 19, 13, 0.35), 0 1px 3px rgba(0,0,0,0.2)'
            : isLg
            ? '8px 16px 36px rgba(28, 19, 13, 0.45), 2px 4px 12px rgba(0,0,0,0.25)'
            : '5px 10px 24px rgba(28, 19, 13, 0.35), 1px 3px 8px rgba(0,0,0,0.2)',
        }}
      >
        {/* PHYSICAL 3D PAGE BLOCK (Visible Pages Thickness on Right Edge) */}
        <div
          className="absolute -right-[7px] top-[4px] bottom-[5px] w-[9px] rounded-r-[2px] pointer-events-none z-0"
          style={{
            background: 'repeating-linear-gradient(to right, #F5EFE0, #F5EFE0 1px, #E5DEC9 1px, #E5DEC9 2px)',
            boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.25), 2px 2px 4px rgba(0,0,0,0.2)',
            transform: 'skewY(-0.8deg)',
          }}
        />

        {/* PHYSICAL 3D PAGE BLOCK (Bottom Page Thickness) */}
        <div
          className="absolute -bottom-[5px] left-[7px] right-[2px] h-[6px] rounded-b-[2px] pointer-events-none z-0"
          style={{
            background: 'repeating-linear-gradient(to bottom, #F5EFE0, #F5EFE0 1px, #E0D7C2 1px, #E0D7C2 2px)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2), 1px 2px 3px rgba(0,0,0,0.15)',
          }}
        />

        {/* BOOK FRONT COVER CASING (The Hardcover Front Board) */}
        <div className="relative w-full h-full rounded-r-[4px] rounded-l-[2px] overflow-hidden bg-[#241A13] border-t border-r border-b border-[#2C1E14]/30 z-10">
          
          {hasValidImage ? (
            /* UPLOADED IMAGE FORMATTED AS A REAL 3D BOOK COVER */
            <div className="relative w-full h-full overflow-hidden bg-[#1C130D]">
              {/* The Actual User Uploaded Image (Fitted seamlessly to the book board) */}
              <img
                src={imageUrl}
                alt={`Portada de ${title} por ${author}`}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />

              {/* Physical Hardcover Beveled Border Emulation */}
              <div className="absolute inset-[3px] border border-white/20 pointer-events-none rounded-r-[3px]" />
              <div className="absolute inset-[4px] border border-black/25 pointer-events-none rounded-r-[2px]" />

              {/* Diagonal Satin / Gloss Lighting Reflection on Book Jacket */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background:
                    'linear-gradient(115deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)',
                }}
              />

              {/* Subtle Paper / Cloth Grain Texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-15 mix-blend-color-burn"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1px)',
                  backgroundSize: '3px 3px',
                }}
              />

              {/* Bottom Subtle Typography Ribbon / Legibility Scrim */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-6 pb-2.5 px-3 pointer-events-none">
                <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold truncate drop-shadow-sm">
                  {category}
                </p>
                <p className="text-white/95 font-serif font-bold text-[11px] sm:text-xs leading-tight truncate drop-shadow-sm">
                  {title}
                </p>
                <p className="text-white/70 text-[9px] sm:text-[10px] truncate">
                  {author}
                </p>
              </div>
            </div>
          ) : (
            /* PROCEDURAL VINTAGE CLOTHBOUND HARDCOVER */
            <div
              className={`relative w-full h-full p-3 sm:p-4 flex flex-col justify-between ${selectedTheme.bg} ${selectedTheme.border} border-t border-r border-b overflow-hidden`}
            >
              {/* Outer Embossed Gold Border */}
              <div className="absolute inset-2 border border-dashed border-[#D4AF37]/40 pointer-events-none rounded-sm" />
              <div className="absolute inset-[11px] border border-[#D4AF37]/25 pointer-events-none" />

              {/* Subtle Cloth Weave Pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, #000, #000 1px, transparent 1px, transparent 2px)',
                  backgroundSize: '3px 3px',
                }}
              />

              {/* Top Category Label */}
              <div className="relative z-10 pt-1 text-center">
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold block drop-shadow-xs">
                  {category}
                </span>
                <div className="w-8 h-[1px] bg-[#D4AF37]/50 mx-auto mt-1" />
              </div>

              {/* Center Title & Author (Embossed foil look) */}
              <div className="relative z-10 text-center px-1 my-auto space-y-1.5">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] mx-auto shadow-inner bg-black/15">
                  <BookIcon className="w-3.5 h-3.5" />
                </div>
                <h4
                  className={`font-serif font-bold leading-tight ${selectedTheme.text} line-clamp-3 text-balance ${
                    isSm ? 'text-xs' : isLg ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                  }`}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {title}
                </h4>
                <p
                  className={`text-[10px] sm:text-[11px] font-medium tracking-wide ${selectedTheme.subtitle} line-clamp-1`}
                >
                  {author}
                </p>
              </div>

              {/* Bottom Colophon */}
              <div className="relative z-10 pb-1 text-center">
                <div className="w-8 h-[1px] bg-[#D4AF37]/50 mx-auto mb-1" />
                <span className="text-[8px] tracking-widest uppercase text-[#D4AF37]/80 font-mono">
                  LIBRERÍA UNIVERSAL
                </span>
              </div>
            </div>
          )}

          {/* PHYSICAL BOOK SPINE CYLINDER & HINGE GROOVE (Runs on the left side) */}
          {/* Leftmost spine shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-3 z-30 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none" />
          
          {/* Spine curvature highlight (Simulates rounded book spine) */}
          <div className="absolute left-[3px] top-0 bottom-0 w-[2px] z-30 bg-white/20 pointer-events-none" />
          
          {/* Hinge Joint Gutter / Crease (The groove where the hardcover bends) */}
          <div
            className="absolute left-[11px] top-0 bottom-0 w-[3px] z-30 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.15) 50%, rgba(0,0,0,0.3) 100%)',
              boxShadow: 'inset 0 0 2px rgba(0,0,0,0.6)',
            }}
          />

          {/* Headband / Endband stitching hint (top and bottom left corner) */}
          <div className="absolute top-0 left-0 w-3.5 h-[2px] bg-[#D4AF37] z-40 opacity-70" />
          <div className="absolute bottom-0 left-0 w-3.5 h-[2px] bg-[#D4AF37] z-40 opacity-70" />

          {/* Subtle Outer Bevel Rim */}
          <div className="absolute inset-0 rounded-r-[4px] border border-white/10 pointer-events-none z-30" />
        </div>
      </div>
    </div>
  );
};
