import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ScrollControls, useScroll, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";

function LoaderFallback() {
  return (
    <Html center>
      <div className="loader">Loading model…</div>
    </Html>
  );
}

/* Simple Model loader that centers itself using Stage-like logic.
   Replace "/models/redbull.glb" with your path if different. */
function ModelWrapper() {
  const { scene } = useGLTF("/models/redbull.glb");
  // tiny centering: compute bbox and shift to origin
  const root = new THREE.Group();
  if (scene) {
    const bbox = new THREE.Box3().setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    root.add(scene);
  }
  return <primitive object={root} />;
}

/* Example CarModel that could hold wheel-attach logic.
   For now we just display the model centered. */
function CarModel() {
  return <ModelWrapper />;
}

export default function App() {
  // Keep OrbitControls ref if you need to tweak target later
  const controlsRef = useRef();

  // Canvas is inside .sticky-canvas (100vh). ScrollControls uses the page scroll,
  // so we must ensure there's content below to scroll.
  return (
    <div className="page-root">
      <div className="sticky-canvas">
        <Canvas camera={{ position: [0, 1.4, 6], fov: 50 }}>
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1.0} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Suspense fallback={<LoaderFallback />}>
            {/* pages defines how much scroll maps to offset 0->1.
                1.6 pages is a good default — increase to lengthen scroll. */}
            <ScrollControls pages={1.6} damping={4}>
              <CarModel />
            </ScrollControls>
          </Suspense>

          <OrbitControls ref={controlsRef} enablePan={false} enableZoom={true} />
        </Canvas>
      </div>

      {/* Content below creates the scroll area. Adjust height as needed. */}
      <div className="below-content">
        <h1>Scroll to attach wheels</h1>
        <p>Scroll down — wheels will move into place and attach to the car.</p>
        <div style={{ height: "140vh" }} />
      </div>
    </div>
  );
}

useGLTF.preload("/models/redbull.glb");
