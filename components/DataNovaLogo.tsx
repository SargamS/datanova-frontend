import React from 'react';

export function DataNovaLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="datanova-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="45" fill="url(#datanova-gradient)" />
      
      {/* Inner Design - Star/Sparkle */}
      <path 
        d="M50 20 L55 40 L75 45 L55 50 L50 70 L45 50 L25 45 L45 40 Z" 
        fill="white" 
        opacity="0.9"
      />
      
      {/* Small sparkles */}
      <circle cx="30" cy="30" r="3" fill="white" opacity="0.8" />
      <circle cx="70" cy="30" r="2.5" fill="white" opacity="0.7" />
      <circle cx="70" cy="70" r="3" fill="white" opacity="0.8" />
      <circle cx="30" cy="70" r="2.5" fill="white" opacity="0.7" />
    </svg>
  );
}

export function DataNovaLogoWithText({ 
  logoSize = 32, 
  className = "",
  showText = true 
}: { 
  logoSize?: number; 
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <DataNovaLogo size={logoSize} />
      {showText && (
        <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          DataNova
        </span>
      )}
    </div>
  );
}
