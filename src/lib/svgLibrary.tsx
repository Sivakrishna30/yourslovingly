import React from 'react';

export type SvgProps = React.SVGProps<SVGSVGElement>;

// 1. Traditional Brass Diya
export const DiyaIcon = (props: SvgProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Base */}
    <path d="M30 80 Q50 95 70 80 L65 75 Q50 85 35 75 Z" fill="currentColor" opacity="0.9" />
    <path d="M45 80 L45 60 M55 80 L55 60" stroke="currentColor" strokeWidth="2" />
    {/* Bowl */}
    <path d="M20 60 Q50 80 80 60 Q85 55 90 50 Q50 65 10 50 Q15 55 20 60 Z" fill="currentColor" />
    {/* Flame inner and outer */}
    <path d="M50 20 Q65 40 50 55 Q35 40 50 20 Z" fill="#F59E0B" />
    <path d="M50 30 Q58 42 50 50 Q42 42 50 30 Z" fill="#FEF08A" />
    {/* Sparks/Rays */}
    <line x1="50" y1="5" x2="50" y2="15" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <line x1="30" y1="15" x2="40" y2="25" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <line x1="70" y1="15" x2="60" y2="25" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 2. Botanical Rose Motif
export const BotanicalRose = (props: SvgProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M40 70 Q50 90 60 70" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M50 75 Q30 85 25 70 Q35 65 50 75" fill="#10B981" opacity="0.6" />
    <path d="M50 70 Q70 80 75 65 Q65 60 50 70" fill="#10B981" opacity="0.6" />
    <circle cx="50" cy="45" r="20" fill="#F43F5E" opacity="0.8" />
    <path d="M50 30 Q65 30 65 45 Q65 60 50 60 Q35 60 35 45 Q35 30 50 30 Z" stroke="#BE123C" strokeWidth="1" fill="none" />
    <path d="M42 38 Q50 32 58 38 Q62 45 58 52 Q50 58 42 52 Q38 45 42 38 Z" fill="#FDA4AF" />
    <circle cx="50" cy="45" r="5" fill="#FFF1F2" />
  </svg>
);

// 3. Auspicious Kalash
export const AuspiciousKalash = (props: SvgProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Leaves */}
    <path d="M50 35 Q30 15 20 30 Q35 40 50 40 Z" fill="#059669" />
    <path d="M50 35 Q70 15 80 30 Q65 40 50 40 Z" fill="#059669" />
    <path d="M50 35 Q50 10 40 20 Q45 35 50 40 Z" fill="#10B981" />
    <path d="M50 35 Q50 10 60 20 Q55 35 50 40 Z" fill="#10B981" />
    {/* Coconut */}
    <ellipse cx="50" cy="30" rx="12" ry="18" fill="#78350F" />
    <path d="M45 20 L45 25 M50 18 L50 25 M55 20 L55 25" stroke="#451A03" strokeWidth="1" />
    {/* Pot */}
    <path d="M35 40 L65 40 L70 50 Q85 75 50 90 Q15 75 30 50 Z" fill="currentColor" />
    <path d="M35 40 L65 40 L68 45 L32 45 Z" fill="#B45309" opacity="0.5" />
    {/* Swastik / Om symbol representation abstract */}
    <path d="M45 65 L55 65 M50 60 L50 70" stroke="#FFF" strokeWidth="2" />
  </svg>
);

// 4. Abstract Peacock Motif
export const RoyalPeacock = (props: SvgProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Plumes */}
    <path d="M50 50 Q80 20 90 50 Q80 80 50 50" fill="#0EA5E9" opacity="0.4" />
    <path d="M50 50 Q70 10 85 35 Q70 60 50 50" fill="#3B82F6" opacity="0.5" />
    <path d="M50 50 Q90 30 75 15 Q60 30 50 50" fill="#0284C7" opacity="0.6" />
    {/* Plume eyes */}
    <circle cx="80" cy="50" r="4" fill="#F59E0B" />
    <circle cx="75" cy="35" r="4" fill="#F59E0B" />
    <circle cx="70" cy="25" r="4" fill="#F59E0B" />
    {/* Body */}
    <path d="M40 70 Q55 80 60 60 Q65 40 50 30 Q45 25 35 30 Q40 40 30 50 Q20 60 40 70 Z" fill="currentColor" />
    <circle cx="45" cy="32" r="2" fill="#FFF" />
    {/* Crest */}
    <path d="M42 28 Q40 20 45 15 M45 28 Q45 20 50 15 M48 28 Q50 20 55 15" stroke="currentColor" strokeWidth="1" />
  </svg>
);

// 5. Classic Mandala / Rangoli
export const MandalaRangoli = (props: SvgProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    
    {/* 8-point petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <g key={angle} transform={`rotate(${angle} 50 50)`}>
        <path d="M50 30 Q60 20 50 5 Q40 20 50 30" fill="currentColor" opacity="0.4" />
        <path d="M50 30 Q55 25 50 15 Q45 25 50 30" fill="currentColor" />
      </g>
    ))}
  </svg>
);

// 6. Geometric Border Corner
export const GeometricCorner = (props: SvgProps) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10 90 L10 10 L90 10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path d="M20 90 L20 20 L90 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M30 90 L30 30 L90 30" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
    <circle cx="20" cy="20" r="4" fill="currentColor" />
    <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.6" />
    <circle cx="10" cy="10" r="5" fill="currentColor" opacity="0.2" />
  </svg>
);
