'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Gold material properties
const GOLD_PROPS = {
  color: '#D4AF37',
  metalness: 0.95,
  roughness: 0.05,
  envMapIntensity: 1.2,
};

// Rotating ring band
function RingBand() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <torusGeometry args={[1.1, 0.22, 64, 128]} />
      <meshStandardMaterial {...GOLD_PROPS} />
    </mesh>
  );
}

// Gem stone (diamond-like)
function Gemstone() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 1.1]} castShadow>
      <octahedronGeometry args={[0.32, 2]} />
      <meshPhysicalMaterial
        color="#E8F4FF"
        metalness={0.0}
        roughness={0.0}
        transmission={0.95}
        thickness={1.2}
        ior={2.42}
        envMapIntensity={3}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
}

// Prong settings (4 small cylinders holding the gem)
function Prongs() {
  const meshRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.08;
    }
  });

  const prongPositions: [number, number, number][] = [
    [0.18, 0.18, 0.95],
    [-0.18, 0.18, 0.95],
    [0.18, -0.18, 0.95],
    [-0.18, -0.18, 0.95],
  ];

  return (
    <group ref={meshRef}>
      {prongPositions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.025, 0.018, 0.28, 8]} />
          <meshStandardMaterial {...GOLD_PROPS} />
        </mesh>
      ))}
    </group>
  );
}

// Sparkle particle cloud
function SparkleParticles({ count = 280 }: { count?: number }) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.2 + Math.random() * 1.8;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.06;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#F1D9A0"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

// Inner 3D scene
function RingSceneInner() {
  return (
    <>
      <ambientLight intensity={0.5} color="#FDF6EC" />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#F1D9A0" castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#D4AF37" />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#FFF8F0" />
      <pointLight position={[2, 2, -2]} intensity={0.6} color="#D4AF37" />

      <RingBand />
      <Gemstone />
      <Prongs />
      <SparkleParticles />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        dampingFactor={0.08}
        enableDamping
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

function LoadingShimmer() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-40 h-40 rounded-full skeleton"
        style={{ border: '2px solid rgba(212,175,55,0.3)' }}
      />
    </div>
  );
}

export default function RingScene() {
  return (
    <motion.div
      className="w-full flex items-center justify-center"
      style={{ height: 'min(55vw, 360px)', maxHeight: 360, minHeight: 220 }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, type: 'spring', stiffness: 80, damping: 20 }}
    >
      <Suspense fallback={<LoadingShimmer />}>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <RingSceneInner />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}
