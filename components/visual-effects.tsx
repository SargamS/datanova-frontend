'use client';

import React from "react"

interface FloatingOrb {
  id: number;
  size: 'sm' | 'md' | 'lg';
  color: 'primary' | 'accent' | 'blue' | 'green' | 'yellow';
  delay: number;
}

export function AnimatedOrbs() {
  const orbs: FloatingOrb[] = [
    { id: 1, size: 'lg', color: 'primary', delay: 0 },
    { id: 2, size: 'md', color: 'accent', delay: 1 },
    { id: 3, size: 'sm', color: 'blue', delay: 2 },
  ];

  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-96 h-96',
  };

  const colorClasses = {
    primary: 'bg-primary/25',
    accent: 'bg-accent/25',
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    yellow: 'bg-yellow-500/20',
  };

  return (
    <>
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full blur-3xl pointer-events-none ${
            sizeClasses[orb.size]
          } ${colorClasses[orb.color]} animate-pulse opacity-40`}
          style={{
            animationDelay: `${orb.delay}s`,
          }}
        ></div>
      ))}
    </>
  );
}

export function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export function GlowingLine({
  direction = 'horizontal',
}: {
  direction?: 'horizontal' | 'vertical';
}) {
  return (
    <div
      className={`absolute pointer-events-none ${
        direction === 'horizontal'
          ? 'w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent'
          : 'h-full w-1 bg-gradient-to-b from-transparent via-primary to-transparent'
      } opacity-20 blur-sm`}
    />
  );
}

export function PulsingDot({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="absolute w-3 h-3 bg-primary rounded-full animate-pulse"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export function AnimatedGradientText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent ${className}`}
    >
      {children}
    </span>
  );
}

export function ShimmerEffect() {
  return (
    <div
      className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
      style={{
        animation: 'shimmer 2s infinite',
        backgroundSize: '1000px 100%',
      }}
    />
  );
}
