'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
}

function generatePetals(count: number): Petal[] {
  const colors = [
    'rgba(212,175,55,0.6)',
    'rgba(241,217,160,0.5)',
    'rgba(246,221,227,0.6)',
    'rgba(212,175,55,0.4)',
    'rgba(253,246,236,0.4)',
  ];
  // Deterministic spread so server and client render identically
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 6.18 + 5) % 100,
    size: 6 + (i % 10),
    delay: (i * 0.53) % 8,
    duration: 10 + (i % 10),
    rotation: (i * 37) % 360,
    color: colors[i % colors.length],
  }));
}

export default function FloatingPetals({ count = 18 }: { count?: number }) {
  const petalsRef = useRef<Petal[]>(generatePetals(count));

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      {petalsRef.current.map((petal) => (
        <PetalItem key={petal.id} petal={petal} />
      ))}
    </div>
  );
}

function PetalItem({ petal }: { petal: Petal }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${petal.x}%`,
        top: '-30px',
        width: petal.size,
        height: petal.size * 1.4,
        borderRadius: '50% 50% 50% 0',
        background: petal.color,
        transform: `rotate(${petal.rotation}deg)`,
        animationName: 'float-up, petal-sway',
        animationDuration: `${petal.duration}s, ${petal.duration * 0.6}s`,
        animationDelay: `${petal.delay}s, ${petal.delay}s`,
        animationTimingFunction: 'linear, ease-in-out',
        animationIterationCount: 'infinite, infinite',
        filter: 'blur(0.3px)',
      }}
    />
  );
}
