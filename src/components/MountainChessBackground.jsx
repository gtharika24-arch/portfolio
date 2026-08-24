import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ridgeHeight(x, z, seed = 0) {
  const r1 = 1 - Math.abs(Math.sin(x * 0.35 + seed));
  const r2 = 1 - Math.abs(Math.sin(x * 0.9 + seed * 1.7 + 1.2));
  return r1 * 1.4 + r2 * 0.5 - z * 0.15;
}

const vertexShader = `
  uniform float uTime;
  uniform float uSeed;
  uniform float uZOffset;
  varying float vElevation;
  varying vec2 vUv;

  void main(){
    vUv = uv;
    vec3 pos = position;
    float x = pos.x;
    float z = pos.y + uZOffset;

    float r1 = 1.0 - abs(sin(x * 0.35 + uSeed));
    float r2 = 1.0 - abs(sin(x * 0.9 + uSeed * 1.7 + 1.2));
    float elevation = r1 * 1.4 + r2 * 0.5 - abs(z) * 0.15;
    elevation += sin(x * 1.4 + uTime * 0.05) * 0.03;

    pos.z = elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  varying float vElevation;

  void main(){
    float t = smoothstep(-0.3, 1.6, vElevation);
    vec3 color = mix(uColorLow, uColorHigh, t);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function Ridge({ zOffset, seed, colorLow, colorHigh, opacity = 1 }) {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSeed: { value: seed },
    uZOffset: { value: zOffset },
    uColorLow: { value: new THREE.Color(colorLow) },
    uColorHigh: { value: new THREE.Color(colorHigh) },
  }), [seed, zOffset, colorLow, colorHigh]);

  useFrame((state) => { uniforms.uTime.value = state.clock.getElapsedTime(); });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, zOffset]}>
      <planeGeometry args={[22, 6, 140, 20]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function useCoinTexture(glyph) {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#C9A24B';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8a7550';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#1c1916';
    ctx.font = 'bold 64px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(glyph, size / 2, size / 2 + 4);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, [glyph]);
}

function ChessCoin({ glyph, seed, speed, laneZ }) {
  const ref = useRef();
  const texture = useCoinTexture(glyph);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const x = ((t * speed + seed * 4) % 20) - 10;
    const groundY = ridgeHeight(x, laneZ, 0);
    ref.current.position.set(x, groundY - 1.4 + 0.12, laneZ);
    ref.current.rotation.x += 0.09;
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
      <meshStandardMaterial metalness={0.5} roughness={0.4} color="#C9A24B" />
      <mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.21, 24]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </mesh>
  );
}

const coinConfigs = [
  { glyph: '♞', seed: 0, speed: 0.62, laneZ: 0.95 },
  { glyph: '♟', seed: 1, speed: 0.84, laneZ: 1.45 },
  { glyph: '♛', seed: 2, speed: 0.48, laneZ: 0.35 },
  { glyph: '♜', seed: 3, speed: 0.73, laneZ: 1.05 },
  { glyph: '♝', seed: 4, speed: 0.57, laneZ: 1.75 },
  { glyph: '♚', seed: 5, speed: 0.66, laneZ: 0.65 },
  { glyph: '♔', seed: 6, speed: 0.79, laneZ: 1.25 },
  { glyph: '♟', seed: 7, speed: 0.53, laneZ: 0.15 },
  { glyph: '♞', seed: 8, speed: 0.91, laneZ: 1.6 },
  { glyph: '♛', seed: 9, speed: 0.44, laneZ: 0.85 },
  { glyph: '♜', seed: 10, speed: 0.71, laneZ: 1.95 },
  { glyph: '♝', seed: 11, speed: 0.59, laneZ: 0.25 },
  { glyph: '♚', seed: 12, speed: 0.88, laneZ: 1.15 },
  { glyph: '♔', seed: 13, speed: 0.49, laneZ: 1.35 },
  { glyph: '♟', seed: 14, speed: 0.77, laneZ: 0.55 },
];

export default function MountainChessBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 5.5], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 3]} intensity={1} color="#C9A24B" />

      <Ridge zOffset={-6} seed={0.4} colorLow="#141210" colorHigh="#4a3a24" opacity={0.55} />
      <Ridge zOffset={-3} seed={1.9} colorLow="#0f0d0b" colorHigh="#6b4f26" opacity={0.75} />
      <Ridge zOffset={0} seed={3.1} colorLow="#0a0908" colorHigh="#8a6a2f" opacity={1} />

      {coinConfigs.map((coin) => (
        <ChessCoin key={`${coin.glyph}-${coin.seed}`} glyph={coin.glyph} seed={coin.seed} speed={coin.speed} laneZ={coin.laneZ} />
      ))}
    </Canvas>
  );
}
