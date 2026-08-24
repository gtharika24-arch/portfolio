import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Suspense } from "react";

function StarField() {
  return (
    <Stars
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}

export default function StarsBackground() {
  return (
    <div className="bg">
      <Suspense fallback={null}>
        <Canvas
          style={{ position: "fixed", top: 0, left: 0 }}
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: true, alpha: true }}
        >
          <StarField />
        </Canvas>
      </Suspense>
    </div>
  );
}