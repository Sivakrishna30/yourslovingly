import React from 'react';
import type { FrameType, DecorativeMotif, BackgroundTexture } from '../types';

interface DecorativeFrameProps {
  frameType?: FrameType;
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  className?: string;
  children: React.ReactNode;
}

export function DecorativeFrame({
  frameType = 'traditional-marigold-gold',
  primaryColor = '#E52324',
  accentColor = '#FFD100',
  secondaryColor = '#FFFDF9',
  className = '',
  children
}: DecorativeFrameProps) {
  const pColor = primaryColor || '#E52324';
  const aColor = accentColor || '#D4AF37';

  if (frameType === 'none') {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  // 0. GRAND RANGOLI & SACRED MANDALA FRAME
  if (frameType === 'grand-rangoli-mandala') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: `${aColor}`, 
          backgroundColor: secondaryColor || '#FFFDF9',
          boxShadow: `0 25px 60px -12px ${pColor}25, 0 0 0 1px ${aColor}60, inset 0 0 40px ${aColor}10`
        }}
      >
        {/* Top Grand Rangoli Arch Header */}
        <div className="absolute top-0 left-0 right-0 h-20 sm:h-28 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 800 110" preserveAspectRatio="none" className="w-full h-full">
            {/* Top Ornate Arch Band */}
            <path d="M0,0 L800,0 L800,20 C600,60 480,95 400,95 C320,95 200,60 0,20 Z" fill={`${pColor}15`} stroke={aColor} strokeWidth="2" />
            <path d="M100,5 Q400,105 700,5" fill="none" stroke={aColor} strokeWidth="1.5" strokeDasharray="6 4" />
            
            {/* Center Massive Rangoli Crest */}
            <g transform="translate(400, 52)">
              {/* Radiating 12 Lotus Petals */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <path key={deg} d="M0,0 Q-8,-26 0,-36 Q8,-26 0,0" fill={aColor} opacity="0.85" transform={`rotate(${deg})`} />
              ))}
              {/* Inner Petal Ring */}
              {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
                <path key={`in-${deg}`} d="M0,0 Q-5,-18 0,-26 Q5,-18 0,0" fill={pColor} opacity="0.9" transform={`rotate(${deg})`} />
              ))}
              {/* Center Radiant Core */}
              <circle cx="0" cy="0" r="14" fill="#FFD700" stroke={pColor} strokeWidth="2" />
              <circle cx="0" cy="0" r="8" fill={pColor} />
              <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
            </g>

            {/* Hanging Golden Diya Points across the arch */}
            {[160, 260, 540, 640].map((hx, idx) => (
              <g key={idx} transform={`translate(${hx}, 28)`}>
                <line x1="0" y1="0" x2="0" y2="18" stroke={aColor} strokeWidth="1.5" />
                <path d="M-6,18 C-6,26 -2,28 0,30 C2,28 6,26 6,18 Z" fill={aColor} />
                <circle cx="0" cy="18" r="2.5" fill="#FF5500" />
              </g>
            ))}
          </svg>
        </div>

        {/* Big Grand Rangoli Corner Ornaments (Top-Left) */}
        <div className="absolute -top-3 -left-3 w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 pointer-events-none z-10">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            {/* Grand Concentric Rangoli Circles */}
            <circle cx="20" cy="20" r="110" stroke={aColor} strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
            <circle cx="20" cy="20" r="85" stroke={aColor} strokeWidth="1.5" opacity="0.6" />
            <circle cx="20" cy="20" r="60" stroke={pColor} strokeWidth="2" opacity="0.8" />
            {/* Corner Lotus Petals */}
            {[0, 18, 36, 54, 72, 90].map((ang) => (
              <g key={ang} transform={`rotate(${ang} 20 20)`}>
                <path d="M20,20 Q45,35 90,20 Q45,5 20,20 Z" fill={aColor} opacity="0.45" />
                <circle cx="95" cy="20" r="4" fill="#FFD700" />
                <circle cx="70" cy="20" r="2.5" fill={pColor} />
              </g>
            ))}
            {/* Golden Diya in the Corner Node */}
            <circle cx="26" cy="26" r="16" fill={aColor} stroke={pColor} strokeWidth="2" />
            <circle cx="26" cy="26" r="8" fill="#FF5500" />
            <circle cx="26" cy="26" r="3" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Big Grand Rangoli Corner Ornaments (Top-Right) */}
        <div className="absolute -top-3 -right-3 w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 pointer-events-none z-10 transform scale-x-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <circle cx="20" cy="20" r="110" stroke={aColor} strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
            <circle cx="20" cy="20" r="85" stroke={aColor} strokeWidth="1.5" opacity="0.6" />
            <circle cx="20" cy="20" r="60" stroke={pColor} strokeWidth="2" opacity="0.8" />
            {[0, 18, 36, 54, 72, 90].map((ang) => (
              <g key={ang} transform={`rotate(${ang} 20 20)`}>
                <path d="M20,20 Q45,35 90,20 Q45,5 20,20 Z" fill={aColor} opacity="0.45" />
                <circle cx="95" cy="20" r="4" fill="#FFD700" />
                <circle cx="70" cy="20" r="2.5" fill={pColor} />
              </g>
            ))}
            <circle cx="26" cy="26" r="16" fill={aColor} stroke={pColor} strokeWidth="2" />
            <circle cx="26" cy="26" r="8" fill="#FF5500" />
          </svg>
        </div>

        {/* Big Grand Rangoli Corner Ornaments (Bottom-Left) */}
        <div className="absolute -bottom-3 -left-3 w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 pointer-events-none z-10 transform scale-y-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <circle cx="20" cy="20" r="110" stroke={aColor} strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
            <circle cx="20" cy="20" r="85" stroke={aColor} strokeWidth="1.5" opacity="0.6" />
            <circle cx="20" cy="20" r="60" stroke={pColor} strokeWidth="2" opacity="0.8" />
            {[0, 18, 36, 54, 72, 90].map((ang) => (
              <g key={ang} transform={`rotate(${ang} 20 20)`}>
                <path d="M20,20 Q45,35 90,20 Q45,5 20,20 Z" fill={aColor} opacity="0.45" />
                <circle cx="95" cy="20" r="4" fill="#FFD700" />
              </g>
            ))}
            <circle cx="26" cy="26" r="16" fill={aColor} stroke={pColor} strokeWidth="2" />
            <circle cx="26" cy="26" r="8" fill="#FF5500" />
          </svg>
        </div>

        {/* Big Grand Rangoli Corner Ornaments (Bottom-Right) */}
        <div className="absolute -bottom-3 -right-3 w-28 sm:w-40 md:w-48 h-28 sm:h-40 md:h-48 pointer-events-none z-10 transform scale-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <circle cx="20" cy="20" r="110" stroke={aColor} strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
            <circle cx="20" cy="20" r="85" stroke={aColor} strokeWidth="1.5" opacity="0.6" />
            <circle cx="20" cy="20" r="60" stroke={pColor} strokeWidth="2" opacity="0.8" />
            {[0, 18, 36, 54, 72, 90].map((ang) => (
              <g key={ang} transform={`rotate(${ang} 20 20)`}>
                <path d="M20,20 Q45,35 90,20 Q45,5 20,20 Z" fill={aColor} opacity="0.45" />
                <circle cx="95" cy="20" r="4" fill="#FFD700" />
              </g>
            ))}
            <circle cx="26" cy="26" r="16" fill={aColor} stroke={pColor} strokeWidth="2" />
            <circle cx="26" cy="26" r="8" fill="#FF5500" />
          </svg>
        </div>

        {/* Inner Ornate Gold Beaded Border */}
        <div 
          className="absolute inset-3 sm:inset-5 rounded-2xl border-2 pointer-events-none" 
          style={{ borderColor: `${aColor}70`, borderStyle: 'solid' }}
        />
        <div 
          className="absolute inset-5 sm:inset-8 rounded-xl border pointer-events-none opacity-60" 
          style={{ borderColor: `${pColor}40`, borderStyle: 'dashed' }}
        />

        <div className="relative z-10 pt-10 sm:pt-14 pb-4">{children}</div>
      </div>
    );
  }

  // 0.5. ROYAL GRAND ROSE GARDEN & BLOOMING PEONIES FRAME
  if (frameType === 'royal-rose-garden') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: `${aColor}80`, 
          backgroundColor: secondaryColor || '#FFFDF9',
          boxShadow: `0 25px 60px -15px rgba(225, 29, 72, 0.15), 0 0 0 1px ${aColor}50`
        }}
      >
        {/* Massive Blooming Rose Garland Header */}
        <div className="absolute -top-4 -left-4 w-36 sm:w-52 h-36 sm:h-52 pointer-events-none z-10">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            {/* Emerald Leaves */}
            <path d="M40,40 C10,0 20,80 70,60 Z" fill="#2D5A27" opacity="0.8" />
            <path d="M40,40 C80,10 100,60 60,70 Z" fill="#4B7B43" opacity="0.85" />
            <path d="M30,50 C-10,40 10,100 50,80 Z" fill="#1C3B18" opacity="0.75" />
            {/* Giant Main Rose */}
            <g transform="translate(45, 45)">
              <circle cx="0" cy="0" r="28" fill="#F43F5E" opacity="0.9" />
              <circle cx="-4" cy="-4" r="22" fill="#E11D48" opacity="0.9" />
              <circle cx="2" cy="3" r="16" fill="#BE123C" opacity="0.95" />
              <circle cx="0" cy="0" r="9" fill="#9F1239" />
              <circle cx="0" cy="0" r="4" fill="#FFD700" />
            </g>
            {/* Secondary Golden Rosebuds */}
            <circle cx="95" cy="35" r="14" fill="#FB7185" />
            <circle cx="95" cy="35" r="8" fill="#E11D48" />
            <circle cx="35" cy="95" r="14" fill="#FB7185" />
            <circle cx="35" cy="95" r="8" fill="#E11D48" />
            {/* Golden Vine Vines */}
            <path d="M45,45 Q120,40 160,20" stroke={aColor} strokeWidth="2" fill="none" />
            <circle cx="160" cy="20" r="4" fill={aColor} />
            <path d="M45,45 Q40,120 20,160" stroke={aColor} strokeWidth="2" fill="none" />
            <circle cx="20" cy="160" r="4" fill={aColor} />
          </svg>
        </div>

        {/* Top-Right Giant Rose Corner */}
        <div className="absolute -top-4 -right-4 w-36 sm:w-52 h-36 sm:h-52 pointer-events-none z-10 transform scale-x-[-1]">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <path d="M40,40 C10,0 20,80 70,60 Z" fill="#2D5A27" opacity="0.8" />
            <path d="M40,40 C80,10 100,60 60,70 Z" fill="#4B7B43" opacity="0.85" />
            <g transform="translate(45, 45)">
              <circle cx="0" cy="0" r="28" fill="#F43F5E" opacity="0.9" />
              <circle cx="-4" cy="-4" r="22" fill="#E11D48" opacity="0.9" />
              <circle cx="2" cy="3" r="16" fill="#BE123C" opacity="0.95" />
              <circle cx="0" cy="0" r="9" fill="#9F1239" />
              <circle cx="0" cy="0" r="4" fill="#FFD700" />
            </g>
            <circle cx="95" cy="35" r="14" fill="#FB7185" />
            <circle cx="35" cy="95" r="14" fill="#FB7185" />
            <path d="M45,45 Q120,40 160,20" stroke={aColor} strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Bottom Giant Rose Corners */}
        <div className="absolute -bottom-4 -left-4 w-32 sm:w-44 h-32 sm:h-44 pointer-events-none z-10 transform scale-y-[-1]">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <path d="M40,40 C10,0 20,80 70,60 Z" fill="#2D5A27" opacity="0.8" />
            <g transform="translate(45, 45)">
              <circle cx="0" cy="0" r="24" fill="#F43F5E" opacity="0.9" />
              <circle cx="0" cy="0" r="14" fill="#BE123C" />
            </g>
            <circle cx="85" cy="35" r="10" fill="#FB7185" />
          </svg>
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 sm:w-44 h-32 sm:h-44 pointer-events-none z-10 transform scale-[-1]">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <path d="M40,40 C10,0 20,80 70,60 Z" fill="#2D5A27" opacity="0.8" />
            <g transform="translate(45, 45)">
              <circle cx="0" cy="0" r="24" fill="#F43F5E" opacity="0.9" />
              <circle cx="0" cy="0" r="14" fill="#BE123C" />
            </g>
            <circle cx="85" cy="35" r="10" fill="#FB7185" />
          </svg>
        </div>

        {/* Double Inset Gold Border */}
        <div 
          className="absolute inset-3.5 sm:inset-6 rounded-2xl border-2 pointer-events-none" 
          style={{ borderColor: `${aColor}60` }}
        />
        <div className="relative z-10 pt-8 sm:pt-12">{children}</div>
      </div>
    );
  }

  // 0.8. GRAND KOLAM & ALPANA HERITAGE FRAME
  if (frameType === 'grand-kolam-heritage') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: '#991B1B', 
          backgroundColor: secondaryColor || '#FFFBEB',
          boxShadow: `0 25px 60px -15px rgba(153, 27, 27, 0.25), 0 0 0 2px ${aColor}`
        }}
      >
        {/* Top Kolam Arch */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-22 overflow-hidden pointer-events-none z-10 bg-red-900/90 text-amber-200">
          <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 L800,0 L800,15 Q400,65 0,15 Z" fill="#7F1D1D" />
            {/* White Kolam Braided Loop Waves */}
            <path d="M50,15 Q150,55 250,15 Q350,55 450,15 Q550,55 650,15 Q750,55 800,15" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
            <path d="M50,25 Q150,65 250,25 Q350,65 450,25 Q550,65 650,25 Q750,65 800,25" stroke={aColor} strokeWidth="1.5" fill="none" />
            {/* Hanging Auspicious Deepams */}
            {[100, 250, 400, 550, 700].map((kx) => (
              <g key={kx} transform={`translate(${kx}, 25)`}>
                <line x1="0" y1="0" x2="0" y2="15" stroke={aColor} strokeWidth="1.5" />
                <circle cx="0" cy="18" r="5" fill="#FFD700" />
                <circle cx="0" cy="18" r="2" fill="#DC2626" />
              </g>
            ))}
          </svg>
        </div>

        {/* Kolam Corners */}
        <div className="absolute top-2 left-2 w-20 sm:w-28 h-20 sm:h-28 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M10,10 Q50,10 50,50 Q10,50 10,10 Z" stroke="#DC2626" strokeWidth="2" fill="none" />
            <path d="M15,15 Q45,15 45,45 Q15,45 15,15 Z" stroke={aColor} strokeWidth="1.5" fill="none" />
            <circle cx="30" cy="30" r="4" fill="#DC2626" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-20 sm:w-28 h-20 sm:h-28 pointer-events-none transform scale-x-[-1]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M10,10 Q50,10 50,50 Q10,50 10,10 Z" stroke="#DC2626" strokeWidth="2" fill="none" />
            <path d="M15,15 Q45,15 45,45 Q15,45 15,15 Z" stroke={aColor} strokeWidth="1.5" fill="none" />
            <circle cx="30" cy="30" r="4" fill="#DC2626" />
          </svg>
        </div>

        <div className="absolute inset-3 sm:inset-5 rounded-2xl border-2 border-red-800/40 pointer-events-none" />
        <div className="relative z-10 pt-10 sm:pt-14">{children}</div>
      </div>
    );
  }

  // 1. TRADITIONAL MARIGOLD & GOLD TORAN FRAME
  if (frameType === 'traditional-marigold-gold') {
    return (
      <div 
        className={`relative rounded-3xl p-5 sm:p-10 md:p-14 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: `${aColor}60`, 
          backgroundColor: secondaryColor || '#FFFFFF',
          boxShadow: `0 20px 40px -15px ${pColor}15, 0 0 0 1px ${aColor}30`
        }}
      >
        {/* Top Auspicious Marigold & Mango Leaves Garland Toran */}
        <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="w-full h-full">
            {/* Hanging String */}
            <path d="M0,5 Q125,25 250,5 Q375,25 500,5 Q625,25 750,5 Q875,25 1000,5" fill="none" stroke={aColor} strokeWidth="2.5" />
            {/* Mango Leaves & Marigold Flowers across the swags */}
            {[60, 125, 190, 310, 375, 440, 560, 625, 690, 810, 875, 940].map((cx, idx) => (
              <g key={idx} transform={`translate(${cx}, 14)`}>
                {/* Mango Leaf */}
                <path d="M0,-5 C5,8 8,18 0,26 C-8,18 -5,8 0,-5 Z" fill="#2E6930" opacity="0.85" />
                {/* Marigold Flower */}
                <circle cx="0" cy="2" r="6.5" fill="#FF9900" />
                <circle cx="0" cy="2" r="4.5" fill="#FFCC00" />
                <circle cx="0" cy="2" r="2.5" fill="#FF5500" />
              </g>
            ))}
            {/* Auspicious Brass Hanging Bells at nodes */}
            {[0, 250, 500, 750, 1000].map((cx, idx) => (
              <g key={`bell-${idx}`} transform={`translate(${cx}, 5)`}>
                <line x1="0" y1="0" x2="0" y2="12" stroke={aColor} strokeWidth="1.5" />
                <path d="M-4,12 C-4,17 -6,19 -7,21 L7,21 C6,19 4,17 4,12 Z" fill={aColor} />
                <circle cx="0" cy="23" r="2" fill="#B8860B" />
              </g>
            ))}
          </svg>
        </div>

        {/* Traditional Gold Filigree Corner Ornaments */}
        <div className="absolute top-2 left-2 w-16 sm:w-24 h-16 sm:h-24 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M5,5 L45,5 C30,15 15,30 5,45 Z" fill={`${aColor}25`} stroke={aColor} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill={aColor} />
            <path d="M10,25 Q25,25 25,10" stroke={aColor} strokeWidth="1.2" fill="none" />
            <circle cx="28" cy="28" r="2.5" fill={pColor} />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-16 sm:w-24 h-16 sm:h-24 pointer-events-none transform scale-x-[-1]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M5,5 L45,5 C30,15 15,30 5,45 Z" fill={`${aColor}25`} stroke={aColor} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill={aColor} />
            <path d="M10,25 Q25,25 25,10" stroke={aColor} strokeWidth="1.2" fill="none" />
            <circle cx="28" cy="28" r="2.5" fill={pColor} />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-16 sm:w-24 h-16 sm:h-24 pointer-events-none transform scale-y-[-1]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M5,5 L45,5 C30,15 15,30 5,45 Z" fill={`${aColor}25`} stroke={aColor} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill={aColor} />
            <path d="M10,25 Q25,25 25,10" stroke={aColor} strokeWidth="1.2" fill="none" />
            <circle cx="28" cy="28" r="2.5" fill={pColor} />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-16 sm:w-24 h-16 sm:h-24 pointer-events-none transform scale-[-1]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M5,5 L45,5 C30,15 15,30 5,45 Z" fill={`${aColor}25`} stroke={aColor} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill={aColor} />
            <path d="M10,25 Q25,25 25,10" stroke={aColor} strokeWidth="1.2" fill="none" />
            <circle cx="28" cy="28" r="2.5" fill={pColor} />
          </svg>
        </div>

        {/* Inner Double Inset Border */}
        <div 
          className="absolute inset-2.5 sm:inset-4 rounded-2xl border pointer-events-none" 
          style={{ borderColor: `${aColor}40`, borderStyle: 'solid' }}
        />
        <div 
          className="absolute inset-4 sm:inset-6 rounded-xl border pointer-events-none opacity-50" 
          style={{ borderColor: `${pColor}30`, borderStyle: 'dashed' }}
        />

        <div className="relative z-10 pt-4 sm:pt-6">{children}</div>
      </div>
    );
  }

  // 2. ROYAL RAJASTHANI / MUGHAL JHAROKHA ARCH FRAME
  if (frameType === 'royal-rajasthani-mandap' || frameType === 'mughal-jharokha') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: `${aColor}80`, 
          backgroundColor: secondaryColor || '#FFFFFF',
          boxShadow: `0 25px 50px -12px ${pColor}20, 0 0 0 1px ${aColor}40`
        }}
      >
        {/* Top Royal Jharokha Scalloped Arch Crest */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 800 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Outer Scallop Arch */}
            <path 
              d="M0,0 L0,20 C150,20 250,90 400,90 C550,90 650,20 800,20 L800,0 Z" 
              fill={`${pColor}10`} 
              stroke={aColor} 
              strokeWidth="2" 
            />
            {/* Center Royal Lotus Crown Peak */}
            <g transform="translate(400, 48) scale(1.2)">
              <circle cx="0" cy="-10" r="14" fill={aColor} opacity="0.9" />
              <path d="M0,-24 C6,-16 10,-10 0,0 C-10,-10 -6,-16 0,-24 Z" fill="#FFFFFF" />
              <circle cx="0" cy="-10" r="4" fill={pColor} />
            </g>
            {/* Ornate Gold Filigree Tracery */}
            <path 
              d="M100,10 Q200,40 300,50 Q400,70 500,50 Q600,40 700,10" 
              fill="none" 
              stroke={aColor} 
              strokeWidth="1.5" 
              strokeDasharray="4 3" 
            />
          </svg>
        </div>

        {/* Side Royal Pillar Jaali Borders */}
        <div className="absolute top-20 bottom-12 left-2 w-4 pointer-events-none opacity-40 hidden sm:block">
          <svg viewBox="0 0 20 500" preserveAspectRatio="none" className="w-full h-full">
            <line x1="10" y1="0" x2="10" y2="500" stroke={aColor} strokeWidth="1.5" />
            {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((cy) => (
              <circle key={cy} cx="10" cy={cy} r="4" fill={aColor} />
            ))}
          </svg>
        </div>
        <div className="absolute top-20 bottom-12 right-2 w-4 pointer-events-none opacity-40 hidden sm:block">
          <svg viewBox="0 0 20 500" preserveAspectRatio="none" className="w-full h-full">
            <line x1="10" y1="0" x2="10" y2="500" stroke={aColor} strokeWidth="1.5" />
            {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((cy) => (
              <circle key={cy} cx="10" cy={cy} r="4" fill={aColor} />
            ))}
          </svg>
        </div>

        {/* Inner Golden Ornate Inset */}
        <div 
          className="absolute inset-3 sm:inset-5 rounded-2xl border pointer-events-none" 
          style={{ borderColor: `${aColor}50` }}
        />

        <div className="relative z-10 pt-8 sm:pt-12">{children}</div>
      </div>
    );
  }

  // 3. SOUTH INDIAN TEMPLE ARCH & GOPURAM FRAME
  if (frameType === 'south-temple-arch') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-4 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: pColor, 
          backgroundColor: secondaryColor || '#FFFDF5',
          boxShadow: `0 20px 50px -10px ${pColor}30, inset 0 0 0 2px ${aColor}`
        }}
      >
        {/* Top Temple Gopuram Roof & Bells Header */}
        <div className="absolute top-0 left-0 right-0 h-14 sm:h-20 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="w-full h-full">
            {/* Temple Tiered Ridge */}
            <path d="M0,0 L800,0 L800,12 L500,12 L450,35 L400,15 L350,35 L300,12 L0,12 Z" fill={pColor} />
            <path d="M300,12 L400,45 L500,12 Z" fill={aColor} opacity="0.9" />
            {/* Auspicious Kalash Pinnacle */}
            <circle cx="400" cy="10" r="7" fill="#FFD700" stroke={pColor} strokeWidth="1.5" />
            {/* Hanging Temple Bells */}
            {[100, 200, 600, 700].map((bx) => (
              <g key={bx} transform={`translate(${bx}, 12)`}>
                <line x1="0" y1="0" x2="0" y2="18" stroke={aColor} strokeWidth="2" />
                <path d="M-6,18 C-6,26 -8,28 -9,30 L9,30 C8,28 6,26 6,18 Z" fill={aColor} />
                <circle cx="0" cy="33" r="2.5" fill={pColor} />
              </g>
            ))}
          </svg>
        </div>

        {/* Bottom Temple Diya Border */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10 bg-gradient-to-t from-amber-100/60 to-transparent flex items-center justify-center gap-6">
          <span className="text-xs">🪔</span>
          <span className="text-xs">🪷</span>
          <span className="text-xs">🪔</span>
          <span className="text-xs">🪷</span>
          <span className="text-xs">🪔</span>
        </div>

        <div className="relative z-10 pt-8 sm:pt-10 pb-4">{children}</div>
      </div>
    );
  }

  // 4. BOTANICAL PEONY, ROSE & GOLD FRAME (HIGH DEFINITION VECTOR STYLE)
  if (frameType === 'botanical-peony-gold' || frameType === 'vintage-eucalyptus-wreath') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: `${aColor}50`, 
          backgroundColor: secondaryColor || '#FCFBF9',
          boxShadow: `0 20px 45px -10px rgba(0,0,0,0.07), 0 0 0 1px ${aColor}30`
        }}
      >
        {/* Lush Floral Corner Clusters (Top Left) */}
        <div className="absolute -top-3 -left-3 w-28 sm:w-44 h-28 sm:h-44 pointer-events-none z-10">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            {/* Rose Gold Geometric Diamond Bracket */}
            <path d="M10,90 L10,10 L90,10" stroke={aColor} strokeWidth="1.5" fill="none" />
            <path d="M18,75 L18,18 L75,18" stroke={aColor} strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
            
            {/* Peony Petals Group */}
            <g transform="translate(32, 32)">
              {/* Green Eucalyptus Leaves */}
              <path d="M0,0 C-15,-25 5,-40 25,-25 C30,-10 15,10 0,0 Z" fill="#5B7065" opacity="0.8" />
              <path d="M0,0 C-30,-5 -35,20 -15,25 C0,20 10,-5 0,0 Z" fill="#7C9082" opacity="0.85" />
              <path d="M10,10 C25,25 40,15 35,-5 C20,-10 10,0 10,10 Z" fill="#435B4E" opacity="0.75" />
              {/* Watercolor Peony Blossom */}
              <circle cx="0" cy="0" r="18" fill="#F4C2C2" opacity="0.9" />
              <circle cx="-3" cy="-2" r="14" fill="#E898A8" opacity="0.85" />
              <circle cx="2" cy="3" r="10" fill="#D66D85" opacity="0.9" />
              <circle cx="0" cy="0" r="5" fill="#B33951" />
              <circle cx="0" cy="0" r="2" fill="#FFD700" />
            </g>
            {/* Small Rosebud */}
            <circle cx="65" cy="22" r="8" fill="#F8D7DA" />
            <circle cx="65" cy="22" r="5" fill="#E28498" />
            <circle cx="22" cy="65" r="8" fill="#F8D7DA" />
            <circle cx="22" cy="65" r="5" fill="#E28498" />
          </svg>
        </div>

        {/* Lush Floral Corner Clusters (Top Right) */}
        <div className="absolute -top-3 -right-3 w-28 sm:w-44 h-28 sm:h-44 pointer-events-none z-10 transform scale-x-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path d="M10,90 L10,10 L90,10" stroke={aColor} strokeWidth="1.5" fill="none" />
            <path d="M18,75 L18,18 L75,18" stroke={aColor} strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
            <g transform="translate(32, 32)">
              <path d="M0,0 C-15,-25 5,-40 25,-25 C30,-10 15,10 0,0 Z" fill="#5B7065" opacity="0.8" />
              <path d="M0,0 C-30,-5 -35,20 -15,25 C0,20 10,-5 0,0 Z" fill="#7C9082" opacity="0.85" />
              <circle cx="0" cy="0" r="18" fill="#F4C2C2" opacity="0.9" />
              <circle cx="-3" cy="-2" r="14" fill="#E898A8" opacity="0.85" />
              <circle cx="0" cy="0" r="5" fill="#B33951" />
            </g>
            <circle cx="65" cy="22" r="7" fill="#E28498" />
          </svg>
        </div>

        {/* Bottom Floral Corners */}
        <div className="absolute -bottom-3 -left-3 w-24 sm:w-36 h-24 sm:h-36 pointer-events-none z-10 transform scale-y-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path d="M10,80 L10,10 L80,10" stroke={aColor} strokeWidth="1.2" fill="none" />
            <g transform="translate(28, 28)">
              <circle cx="0" cy="0" r="14" fill="#F4C2C2" opacity="0.9" />
              <circle cx="0" cy="0" r="8" fill="#D66D85" />
            </g>
          </svg>
        </div>
        <div className="absolute -bottom-3 -right-3 w-24 sm:w-36 h-24 sm:h-36 pointer-events-none z-10 transform scale-[-1]">
          <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
            <path d="M10,80 L10,10 L80,10" stroke={aColor} strokeWidth="1.2" fill="none" />
            <g transform="translate(28, 28)">
              <circle cx="0" cy="0" r="14" fill="#F4C2C2" opacity="0.9" />
              <circle cx="0" cy="0" r="8" fill="#D66D85" />
            </g>
          </svg>
        </div>

        {/* Delicate Golden Inner Inset Frame */}
        <div 
          className="absolute inset-4 sm:inset-6 rounded-2xl border pointer-events-none" 
          style={{ borderColor: `${aColor}40` }}
        />

        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // 5. ART DECO GOLD GEOMETRIC FRAME
  if (frameType === 'art-deco-geometric') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: aColor, 
          backgroundColor: secondaryColor || '#111418',
          boxShadow: `0 25px 60px -15px ${aColor}30, inset 0 0 0 1px ${aColor}50`
        }}
      >
        {/* Art Deco Stepped Geometric Corners */}
        <div className="absolute top-2 left-2 w-16 h-16 pointer-events-none">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path d="M5,75 L5,5 L75,5" stroke={aColor} strokeWidth="2" />
            <path d="M15,65 L15,15 L65,15" stroke={aColor} strokeWidth="1" />
            <polygon points="5,5 25,5 5,25" fill={aColor} opacity="0.8" />
            <circle cx="35" cy="35" r="3" fill={aColor} />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-16 h-16 pointer-events-none transform scale-x-[-1]">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path d="M5,75 L5,5 L75,5" stroke={aColor} strokeWidth="2" />
            <path d="M15,65 L15,15 L65,15" stroke={aColor} strokeWidth="1" />
            <polygon points="5,5 25,5 5,25" fill={aColor} opacity="0.8" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-16 h-16 pointer-events-none transform scale-y-[-1]">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path d="M5,75 L5,5 L75,5" stroke={aColor} strokeWidth="2" />
            <path d="M15,65 L15,15 L65,15" stroke={aColor} strokeWidth="1" />
            <polygon points="5,5 25,5 5,25" fill={aColor} opacity="0.8" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-16 h-16 pointer-events-none transform scale-[-1]">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path d="M5,75 L5,5 L75,5" stroke={aColor} strokeWidth="2" />
            <path d="M15,65 L15,15 L65,15" stroke={aColor} strokeWidth="1" />
            <polygon points="5,5 25,5 5,25" fill={aColor} opacity="0.8" />
          </svg>
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // 6. PLANT & BANANA LEAVES TRADITIONAL FRAME
  if (frameType === 'banana-leaf-traditional') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: '#15803D', 
          backgroundColor: secondaryColor || '#F0FDF4',
          boxShadow: `0 20px 50px -10px rgba(21, 128, 61, 0.2), inset 0 0 0 2px ${aColor}60`
        }}
      >
        {/* Top Banana Leaf Swag with Jasmine Garlands */}
        <div className="absolute top-0 left-0 right-0 h-14 sm:h-20 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="w-full h-full">
            {/* Banana Leaves Banner */}
            <path d="M0,0 L800,0 L800,20 Q400,50 0,20 Z" fill="#166534" />
            <path d="M50,10 Q200,45 400,45 Q600,45 750,10" fill="none" stroke="#22C55E" strokeWidth="3" />
            {/* Hanging White Jasmine Buds */}
            {[100, 180, 260, 340, 420, 500, 580, 660, 740].map((jx, idx) => (
              <g key={idx} transform={`translate(${jx}, 25)`}>
                <line x1="0" y1="0" x2="0" y2="16" stroke="#FEF08A" strokeWidth="1.5" />
                <circle cx="0" cy="18" r="4.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="1" />
                <circle cx="0" cy="18" r="2" fill="#EAB308" />
              </g>
            ))}
          </svg>
        </div>

        {/* Side Banana Stalk Flourishes */}
        <div className="absolute top-16 bottom-16 left-1 w-6 pointer-events-none opacity-40 hidden sm:block">
          <svg viewBox="0 0 30 400" preserveAspectRatio="none" className="w-full h-full">
            <path d="M15,0 Q25,200 15,400" stroke="#15803D" strokeWidth="2.5" fill="none" />
            {[60, 140, 220, 300, 380].map((ly) => (
              <path key={ly} d={`M15,${ly} Q28,${ly - 15} 25,${ly + 10} Z`} fill="#22C55E" />
            ))}
          </svg>
        </div>
        <div className="absolute top-16 bottom-16 right-1 w-6 pointer-events-none opacity-40 hidden sm:block transform scale-x-[-1]">
          <svg viewBox="0 0 30 400" preserveAspectRatio="none" className="w-full h-full">
            <path d="M15,0 Q25,200 15,400" stroke="#15803D" strokeWidth="2.5" fill="none" />
            {[60, 140, 220, 300, 380].map((ly) => (
              <path key={ly} d={`M15,${ly} Q28,${ly - 15} 25,${ly + 10} Z`} fill="#22C55E" />
            ))}
          </svg>
        </div>

        <div className="absolute inset-3.5 sm:inset-5 rounded-2xl border border-green-300/60 pointer-events-none" />
        <div className="relative z-10 pt-8 sm:pt-10">{children}</div>
      </div>
    );
  }

  // 7. ANIMAL & ROYAL PEACOCK CREST FRAME
  if (frameType === 'royal-peacock-crest-frame') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          borderColor: '#0284C7', 
          backgroundColor: secondaryColor || '#F0F9FF',
          boxShadow: `0 25px 55px -15px rgba(2, 132, 199, 0.25), 0 0 0 1px ${aColor}`
        }}
      >
        {/* Top Majestic Twin Peacocks Arch */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 800 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 L800,0 L800,25 Q400,85 0,25 Z" fill="#0C4A6E" />
            {/* Left Peacock Motif */}
            <g transform="translate(340, 42) scale(0.6)">
              <circle cx="-30" cy="-10" r="14" fill="#0284C7" />
              <path d="M-40,10 C-60,5 -70,-20 -50,-35 C-30,-25 -25,-5 -40,10 Z" fill="#0369A1" />
              <circle cx="-50" cy="-35" r="5" fill="#FACC15" />
            </g>
            {/* Right Peacock Motif */}
            <g transform="translate(460, 42) scale(0.6) scale(-1, 1)">
              <circle cx="-30" cy="-10" r="14" fill="#0284C7" />
              <path d="M-40,10 C-60,5 -70,-20 -50,-35 C-30,-25 -25,-5 -40,10 Z" fill="#0369A1" />
              <circle cx="-50" cy="-35" r="5" fill="#FACC15" />
            </g>
            {/* Center Golden Lotus Gem */}
            <circle cx="400" cy="50" r="8" fill={aColor} />
            <circle cx="400" cy="50" r="4" fill="#0284C7" />
          </svg>
        </div>

        {/* Ornate Inset Double Border */}
        <div className="absolute inset-3 sm:inset-5 rounded-2xl border border-sky-300 pointer-events-none" />
        <div className="relative z-10 pt-8 sm:pt-12">{children}</div>
      </div>
    );
  }

  // 8. BABY PASTEL FLORAL & CLOUDS FRAME
  if (frameType === 'baby-pastel-floral') {
    return (
      <div 
        className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 border-pink-200 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
        style={{ 
          backgroundColor: secondaryColor || '#FFF9FA',
          boxShadow: '0 20px 40px -10px rgba(244, 114, 182, 0.15)'
        }}
      >
        {/* Soft Floating Stars & Floral Wreath Top */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-around pointer-events-none opacity-60">
          <span>🌸</span>
          <span>✨</span>
          <span>🎀</span>
          <span>✨</span>
          <span>🌸</span>
        </div>
        <div className="absolute inset-3 rounded-2xl border border-pink-200/60 pointer-events-none" />
        <div className="relative z-10 pt-4">{children}</div>
      </div>
    );
  }

  // 9. DEFAULT MODERN LUXURY DAMASK / FILIGREE FRAME
  return (
    <div 
      className={`relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={{ 
        borderColor: `${pColor}30`, 
        backgroundColor: secondaryColor || '#FFFFFF',
        boxShadow: `0 20px 45px -15px ${pColor}15`
      }}
    >
      {/* Subtle Inset Double Border */}
      <div 
        className="absolute inset-3 sm:inset-4 rounded-2xl border pointer-events-none" 
        style={{ borderColor: `${aColor}40` }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// -------------------------------------------------------------
// DECORATIVE MOTIF BADGE COMPONENT
// -------------------------------------------------------------
interface DecorativeMotifBadgeProps {
  motif?: DecorativeMotif;
  primaryColor?: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DecorativeMotifBadge({
  motif = 'sacred-lotus',
  primaryColor = '#E52324',
  accentColor = '#FFD100',
  size = 'md'
}: DecorativeMotifBadgeProps) {
  const pColor = primaryColor || '#E52324';
  const aColor = accentColor || '#D4AF37';

  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 sm:w-28 sm:h-28 text-4xl sm:text-5xl',
    lg: 'w-32 h-32 sm:w-36 sm:h-36 text-5xl sm:text-6xl'
  }[size];

  if (motif === 'none') return null;

  // 0. GRAND ORNATE RANGOLI MANDALA MOTIF (Massive multi-layer centerpiece)
  if (motif === 'grand-rangoli-center') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-2xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, #FFFBEB 0%, #FEF3C7 50%, ${pColor} 100%)`,
          boxShadow: `0 12px 30px -5px ${pColor}70, 0 0 0 5px ${aColor}`
        }}
      >
        <svg viewBox="0 0 120 120" className="w-5/6 h-5/6" fill="none">
          {/* Outer Diya Points */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 60 60)`}>
              <circle cx="60" cy="10" r="4" fill="#FF5500" />
              <path d="M58,10 Q60,4 62,10 Z" fill="#FFD700" />
              <line x1="60" y1="14" x2="60" y2="28" stroke={aColor} strokeWidth="1.5" />
            </g>
          ))}
          {/* Outer Lotus Ring */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path key={`pet-${deg}`} d="M60,60 Q52,32 60,20 Q68,32 60,60" fill={aColor} opacity="0.8" transform={`rotate(${deg} 60 60)`} />
          ))}
          {/* Inner Petal Ring */}
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
            <path key={`in-${deg}`} d="M60,60 Q55,40 60,30 Q65,40 60,60" fill={pColor} opacity="0.9" transform={`rotate(${deg} 60 60)`} />
          ))}
          {/* Center Jewel */}
          <circle cx="60" cy="60" r="14" fill="#FFD700" stroke={pColor} strokeWidth="2" />
          <circle cx="60" cy="60" r="8" fill={pColor} />
          <circle cx="60" cy="60" r="3" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 1. SACRED GOLDEN LOTUS (Padma)
  if (motif === 'sacred-lotus') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, ${aColor}30 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}40`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Outer Petals */}
          <path d="M50,20 C40,40 20,45 15,65 C25,75 40,70 50,80 C60,70 75,75 85,65 C80,45 60,40 50,20 Z" fill={aColor} opacity="0.9" />
          {/* Inner Petals */}
          <path d="M50,28 C42,45 30,50 26,65 C35,72 45,68 50,75 C55,68 65,72 74,65 C70,50 58,45 50,28 Z" fill="#FFFFFF" opacity="0.95" />
          {/* Center Bud */}
          <path d="M50,38 C46,50 40,55 38,65 C44,70 50,68 50,72 C50,68 56,70 62,65 C60,55 54,50 50,38 Z" fill={pColor} />
          <circle cx="50" cy="55" r="4" fill={aColor} />
        </svg>
      </div>
    );
  }

  // 2. ROYAL PEACOCK CREST (Mayura)
  if (motif === 'royal-peacock') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, #00A3E0 0%, #002F6C 100%)`,
          boxShadow: `0 10px 25px -5px rgba(0, 47, 108, 0.5), 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Peacock Plumes */}
          {[ -30, -15, 0, 15, 30 ].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle} 50 65)`}>
              <line x1="50" y1="65" x2="50" y2="25" stroke={aColor} strokeWidth="1.5" />
              <circle cx="50" cy="22" r="6" fill="#00A3E0" />
              <circle cx="50" cy="22" r="3.5" fill="#005A36" />
              <circle cx="50" cy="22" r="1.5" fill={aColor} />
            </g>
          ))}
          {/* Peacock Body & Crest */}
          <path d="M50,55 C44,60 42,72 50,78 C58,72 56,60 50,55 Z" fill="#002F6C" stroke={aColor} strokeWidth="1.2" />
          <circle cx="50" cy="50" r="4" fill="#00A3E0" />
          <path d="M50,46 L48,42 M50,46 L50,41 M50,46 L52,42" stroke={aColor} strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 3. TRADITIONAL BRASS DIYA (Deepam)
  if (motif === 'brass-diya') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, #FFCC00 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Glowing Aura Flame */}
          <circle cx="50" cy="38" r="12" fill="#FFFA9E" opacity="0.6" />
          {/* Sacred Flame */}
          <path d="M50,22 C55,32 58,38 50,46 C42,38 45,32 50,22 Z" fill="#FF4500" />
          <path d="M50,27 C53,34 55,38 50,43 C45,38 47,34 50,27 Z" fill="#FFD700" />
          {/* Brass Diya Bowl */}
          <path d="M22,50 C22,68 78,68 78,50 L70,50 C65,60 35,60 30,50 Z" fill={aColor} stroke="#B8860B" strokeWidth="1.5" />
          {/* Diya Base */}
          <path d="M38,64 L62,64 L66,74 L34,74 Z" fill="#B8860B" />
        </svg>
      </div>
    );
  }

  // 4. AUSPICIOUS KALASH & COCONUT
  if (motif === 'auspicious-kalash') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, ${aColor} 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Mango Leaves */}
          <path d="M50,30 C35,20 25,32 35,42 Z" fill="#2E6930" />
          <path d="M50,30 C65,20 75,32 65,42 Z" fill="#2E6930" />
          <path d="M50,20 C42,28 50,40 50,42 C50,40 58,28 50,20 Z" fill="#1E4D20" />
          {/* Coconut */}
          <circle cx="50" cy="34" r="9" fill="#8B4513" />
          {/* Brass Kalash Pot */}
          <path d="M35,44 L65,44 C72,55 72,68 62,75 L38,75 C28,68 28,55 35,44 Z" fill={aColor} stroke="#B8860B" strokeWidth="1.5" />
          {/* Sacred Swastik / Tilak on Pot */}
          <circle cx="50" cy="58" r="4" fill="#E52324" />
        </svg>
      </div>
    );
  }

  // 5. MINIMAL GANESHA LINE ART
  if (motif === 'ganesha-minimal') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, ${aColor}20 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Auspicious Ganesha Stroke */}
          <path d="M38,30 C45,20 60,22 64,32 C66,40 58,45 52,48 C46,52 46,65 52,70 C56,73 62,70 64,65" stroke={aColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="58" cy="34" r="3" fill="#FF5500" />
          <path d="M36,44 C30,48 30,58 38,62" stroke={aColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48,22 L52,28" stroke="#E52324" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // 6. BOTANICAL ROSE WREATH
  if (motif === 'botanical-rose-wreath') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: `0 10px 25px -5px rgba(0,0,0,0.1), 0 0 0 3px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5" fill="none">
          {/* Leaf Circle Ring */}
          <circle cx="50" cy="50" r="34" stroke={aColor} strokeWidth="1.2" strokeDasharray="4 3" />
          {/* Eucalyptus Leaf Sprigs */}
          <path d="M22,35 C15,30 20,20 28,26 Z" fill="#5B7065" />
          <path d="M78,35 C85,30 80,20 72,26 Z" fill="#5B7065" />
          {/* Top Blooming Peony */}
          <circle cx="50" cy="18" r="9" fill="#F4C2C2" />
          <circle cx="50" cy="18" r="5" fill="#D66D85" />
          {/* Bottom Blooming Peony */}
          <circle cx="50" cy="82" r="9" fill="#F4C2C2" />
          <circle cx="50" cy="82" r="5" fill="#D66D85" />
          {/* Monogram Initials Heart */}
          <path d="M50,44 C46,38 38,40 38,48 C38,56 50,62 50,62 C50,62 62,56 62,48 C62,40 54,38 50,44 Z" fill={pColor} opacity="0.85" />
        </svg>
      </div>
    );
  }

  // 7. GILDED WEDDING RINGS
  if (motif === 'gilded-rings') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, ${aColor} 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Interlocking Rings */}
          <circle cx="42" cy="52" r="18" stroke="#FFFFFF" strokeWidth="4" />
          <circle cx="58" cy="48" r="18" stroke={aColor} strokeWidth="4" />
          {/* Diamond Solitaire */}
          <polygon points="58,24 64,30 58,36 52,30" fill="#FFFFFF" stroke={aColor} strokeWidth="1" />
          <circle cx="58" cy="30" r="2" fill="#00E5FF" />
        </svg>
      </div>
    );
  }

  // 8. TEMPLE BELLS (Ghanti)
  if (motif === 'temple-bells') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, ${aColor} 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          <line x1="50" y1="15" x2="50" y2="40" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M32,40 C32,58 26,65 24,70 L76,70 C74,65 68,58 68,40 Z" fill={aColor} stroke="#B8860B" strokeWidth="2" />
          <circle cx="50" cy="74" r="5" fill="#FFD700" />
        </svg>
      </div>
    );
  }

  // 9. CRADLE & BABY
  if (motif === 'cradle-baby') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, #FCE7F3 0%, #EC4899 100%)`,
          boxShadow: `0 10px 25px -5px rgba(236, 72, 153, 0.4), 0 0 0 4px #FDF2F8`
        }}
      >
        <span className="text-3xl sm:text-4xl">🍼</span>
      </div>
    );
  }

  // 10. DOVES & LOVEBIRDS OF PEACE (Animal / Bird)
  if (motif === 'doves-peace') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, ${aColor}30 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Twin Lovebirds with Olive Leaf */}
          <path d="M38,45 C28,40 22,50 32,58 C40,58 45,52 38,45 Z" fill="#FFFFFF" />
          <path d="M62,45 C72,40 78,50 68,58 C60,58 55,52 62,45 Z" fill="#FFFFFF" />
          {/* Heart & Olive Branch in Beak */}
          <path d="M50,42 C47,38 43,40 43,45 C43,50 50,55 50,55 C50,55 57,50 57,45 C57,40 53,38 50,42 Z" fill="#FF4D6D" />
          <line x1="38" y1="50" x2="62" y2="50" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      </div>
    );
  }

  // 11. CHAMPAGNE TOAST CELEBRATION
  if (motif === 'champagne-toast') {
    return (
      <div className={`${sizeClasses} relative rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
        style={{ 
          background: `radial-gradient(circle, ${aColor} 0%, ${pColor} 100%)`,
          boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
          {/* Left Flute */}
          <path d="M36,25 L44,45 L40,45 L40,65 L32,65 L32,68 L48,68 L48,65 L40,65 L40,45" stroke="#FFFFFF" strokeWidth="2" fill="none" transform="rotate(-15 40 45)" />
          {/* Right Flute */}
          <path d="M64,25 L56,45 L60,45 L60,65 L68,65 L68,68 L52,68 L52,65 L60,65 L60,45" stroke="#FFFFFF" strokeWidth="2" fill="none" transform="rotate(15 60 45)" />
          {/* Champagne Sparkles */}
          <circle cx="50" cy="28" r="3" fill="#FFD700" />
          <circle cx="45" cy="20" r="2" fill="#FFFFFF" />
          <circle cx="55" cy="20" r="2" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // Default Emoji Circle
  return (
    <div 
      className={`${sizeClasses} rounded-full flex items-center justify-center shadow-xl transition-transform duration-500 hover:scale-105`}
      style={{ backgroundColor: pColor, color: '#fff', boxShadow: `0 10px 25px -5px ${pColor}50, 0 0 0 4px ${aColor}` }}
    >
      ✨
    </div>
  );
}

// -------------------------------------------------------------
// DECORATIVE DIVIDER COMPONENT
// -------------------------------------------------------------
interface DecorativeDividerProps {
  color?: string;
  styleType?: 'paisley' | 'floral' | 'diamond' | 'classic';
  className?: string;
}

export function DecorativeDivider({
  color = '#D4AF37',
  styleType = 'paisley',
  className = ''
}: DecorativeDividerProps) {
  if (styleType === 'paisley') {
    return (
      <div className={`flex items-center justify-center gap-2 max-w-xs mx-auto py-2 ${className}`}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-60" style={{ color }} />
        <svg viewBox="0 0 40 20" className="w-8 h-4" fill="none">
          <path d="M20,2 C14,8 8,10 4,14 C10,14 16,12 20,8 C24,12 30,14 36,14 C32,10 26,8 20,2 Z" fill={color} />
          <circle cx="20" cy="14" r="2" fill={color} />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-60" style={{ color }} />
      </div>
    );
  }

  if (styleType === 'floral') {
    return (
      <div className={`flex items-center justify-center gap-3 max-w-sm mx-auto py-2 ${className}`}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-50" style={{ color }} />
        <span className="text-sm" style={{ color }}>🌸 ✦ 🌸</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-50" style={{ color }} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-2 max-w-xs mx-auto py-1.5 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-60" style={{ color }} />
      <span className="text-xs" style={{ color }}>✦</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-60" style={{ color }} />
    </div>
  );
}

// -------------------------------------------------------------
// BACKGROUND TEXTURE COMPONENT
// -------------------------------------------------------------
interface BackgroundTextureOverlayProps {
  texture?: BackgroundTexture;
}

export function BackgroundTextureOverlay({ texture = 'none' }: BackgroundTextureOverlayProps) {
  if (!texture || texture === 'none') return null;

  if (texture === 'rangoli-mandala') {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 600 600" className="w-[140%] max-w-none h-auto animate-[spin_120s_linear_infinite]" fill="none">
          {/* Radial Concentric Mandala Rings */}
          <circle cx="300" cy="300" r="280" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="8 6" />
          <circle cx="300" cy="300" r="240" stroke="#E52324" strokeWidth="2" opacity="0.6" />
          <circle cx="300" cy="300" r="200" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="300" cy="300" r="160" stroke="#E52324" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="300" cy="300" r="110" stroke="#D4AF37" strokeWidth="2.5" />
          <circle cx="300" cy="300" r="60" stroke="#E52324" strokeWidth="3" />

          {/* 16 Radiating Lotus Petals */}
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 300 300)`}>
              <path d="M300,300 Q270,160 300,100 Q330,160 300,300" fill="#D4AF37" opacity="0.25" />
              <circle cx="300" cy="95" r="8" fill="#FFD700" opacity="0.7" />
              <circle cx="300" cy="180" r="5" fill="#E52324" opacity="0.6" />
            </g>
          ))}
          {/* Inner 8-Point Diya Star */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={`diya-${deg}`} transform={`rotate(${deg} 300 300)`}>
              <path d="M300,300 Q285,220 300,190 Q315,220 300,300" fill="#E52324" opacity="0.3" />
              <circle cx="300" cy="190" r="4" fill="#FF5500" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (texture === 'royal-kolam') {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="kolam-pat" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30,5 Q55,30 30,55 Q5,30 30,5 Z" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
              <path d="M5,5 Q30,30 55,5" fill="none" stroke="#E52324" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M5,55 Q30,30 55,55" fill="none" stroke="#E52324" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="30" cy="30" r="2.5" fill="#D4AF37" />
              <circle cx="5" cy="5" r="1.5" fill="#E52324" />
              <circle cx="55" cy="5" r="1.5" fill="#E52324" />
              <circle cx="5" cy="55" r="1.5" fill="#E52324" />
              <circle cx="55" cy="55" r="1.5" fill="#E52324" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kolam-pat)" />
        </svg>
      </div>
    );
  }

  if (texture === 'gold-dust') {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="gold-dust-pat" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="15" r="1" fill="#D4AF37" />
              <circle cx="35" cy="40" r="1.5" fill="#D4AF37" />
              <circle cx="50" cy="10" r="0.8" fill="#FFD700" />
              <circle cx="20" cy="50" r="1.2" fill="#D4AF37" />
              <circle cx="55" cy="55" r="1.8" fill="#D4AF37" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-dust-pat)" />
        </svg>
      </div>
    );
  }

  if (texture === 'jali-lattice') {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="jali-pat" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20,0 L40,20 L20,40 L0,20 Z" fill="none" stroke="#B8860B" strokeWidth="1" />
              <circle cx="20" cy="20" r="3" fill="#B8860B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#jali-pat)" />
        </svg>
      </div>
    );
  }

  if (texture === 'floral-damask') {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-15 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="damask-pat" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40,20 C30,30 20,30 20,40 C20,50 30,50 40,60 C50,50 60,50 60,40 C60,30 50,30 40,20 Z" fill="none" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="40" cy="40" r="3" fill="#D4AF37" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#damask-pat)" />
        </svg>
      </div>
    );
  }

  if (texture === 'banana-palm') {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="palm-pat" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50,0 Q65,50 50,100" stroke="#166534" strokeWidth="1.5" fill="none" />
              <path d="M50,20 Q80,10 90,30" stroke="#166534" strokeWidth="1.2" fill="none" />
              <path d="M50,40 Q20,30 10,50" stroke="#166534" strokeWidth="1.2" fill="none" />
              <path d="M50,60 Q80,50 90,70" stroke="#166534" strokeWidth="1.2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#palm-pat)" />
        </svg>
      </div>
    );
  }

  return null;
}
