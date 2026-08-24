import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Particles() {
  const pointsRef = useRef();

  const particleCount = 220;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 3 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.x = Math.sin(time * 0.06) * 0.08;
    pointsRef.current.rotation.y = time * 0.03;
    pointsRef.current.rotation.z = Math.cos(time * 0.05) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3FE0C5"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="particle-layer" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#6E5BFF" />
        <Particles />
      </Canvas>
    </div>
  );
}
