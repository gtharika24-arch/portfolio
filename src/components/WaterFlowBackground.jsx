import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying float vElevation;
  varying vec2 vUv;

  float wave(vec2 pos, float freq, float speed, float amp, float phase){
    return sin(pos.x * freq + uTime * speed + phase) * amp
         + cos(pos.y * freq * 0.8 - uTime * speed * 0.7 + phase) * amp;
  }

  void main(){
    vUv = uv;
    vec3 pos = position;

    float e = 0.0;
    e += wave(pos.xy, 1.2, 0.6, 0.18, 0.0);
    e += wave(pos.xy, 2.6, 0.35, 0.09, 1.5);
    e += wave(pos.xy, 4.1, 0.9, 0.05, 3.0);

    pos.z += e;
    vElevation = e;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform vec3 uColorHighlight;
  varying float vElevation;
  varying vec2 vUv;

  void main(){
    float t = smoothstep(-0.22, 0.22, vElevation);
    vec3 color = mix(uColorDeep, uColorShallow, t);

    float crest = smoothstep(0.16, 0.30, vElevation);
    color = mix(color, uColorHighlight, crest * 0.8);

    float vignette = smoothstep(0.0, 0.5, 1.0 - distance(vUv, vec2(0.5)));
    float alpha = 0.85 * vignette + 0.1;

    gl_FragColor = vec4(color, alpha);
  }
`;

function FlowingPlane() {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color('#141210') },
    uColorShallow: { value: new THREE.Color('#3a3226') },
    uColorHighlight: { value: new THREE.Color('#C9A24B') },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[14, 10, 120, 120]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function WaterFlowBackground() {
  return (
    <Canvas
      camera={{ position: [0, 2.4, 5.2], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />
      <FlowingPlane />
    </Canvas>
  );
}
