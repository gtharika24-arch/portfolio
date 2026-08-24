import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function NodeSphere() {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const pointsRef = useRef();

  const radius = 1.15;
  const detail = 2;
  const vertices = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    return geometry.vertices;
  }, []);

  const lines = useMemo(() => {
    const segments = [];
    const positions = [];
    for (let i = 0; i < vertices.length; i += 1) {
      for (let j = i + 1; j < vertices.length; j += 1) {
        const a = vertices[i];
        const b = vertices[j];
        const dist = a.distanceTo(b);
        if (dist < 1.8) {
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          segments.push([i, j]);
        }
      }
    }
    return { positions, segments };
  }, [vertices]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.28 + (hovered ? 0.15 : 0);
    groupRef.current.rotation.x = Math.sin(time * 0.25) * 0.12;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(lines.positions), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={hovered ? '#6E5BFF' : '#3FE0C5'} transparent opacity={0.7} />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(vertices.flatMap((v) => [v.x, v.y, v.z])), 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color={hovered ? '#6E5BFF' : '#3FE0C5'} transparent opacity={0.9} />
      </points>
      <mesh>
        <icosahedronGeometry args={[radius, detail]} />
        <meshBasicMaterial color="#12161F" transparent opacity={0.02} wireframe />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-scene">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.6]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 3, 3]} intensity={1.1} color="#6E5BFF" />
        <directionalLight position={[-2, -2, -3]} intensity={0.65} color="#3FE0C5" />
        <NodeSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
