import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// List of all your car models
const CAR_MODELS = [
  { name: "RB6", path: "/models/rb6.glb" },
  { name: "RB7", path: "/models/rb7.glb" },
  { name: "RB9", path: "/models/rb9.glb" },
  { name: "RB16", path: "/models/rb16.glb" },
  { name: "RB19", path: "/models/rb19.glb" },
  { name: "RB20", path: "/models/rb20.glb" }
];

function LoaderFallback() {
  return (
    <Html center>
      <div style={{
        color: '#fff',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '8px'
      }}>
        Loading model…
      </div>
    </Html>
  );
}

function CameraController({ modelSize }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (modelSize) {
      // Calculate optimal distance - very close zoom to fill screen
      const fov = camera.fov * (Math.PI / 180);
      const distance = Math.abs(modelSize / Math.sin(fov / 2)) * 0.38; // Reduced from 0.45 to 0.38 for even more zoom
      
      // Position camera at a diagonal angle (front-side view)
      const angle = Math.PI / 4; // 45 degrees
      const x = distance * Math.sin(angle);
      const z = distance * Math.cos(angle);
      const y = modelSize * 0.35;
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
      
      // Adjust near and far planes to prevent clipping - more conservative values
      camera.near = distance * 0.01; // Dynamic near plane based on distance
      camera.far = distance * 5;
      camera.updateProjectionMatrix();
    }
  }, [modelSize, camera]);
  
  return null;
}

function ModelWrapper({ modelPath, onSizeCalculated }) {
  const { scene } = useGLTF(modelPath);
  
  useEffect(() => {
    if (scene) {
      const bbox = new THREE.Box3().setFromObject(scene);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      
      // Get the maximum dimension with padding for proper scaling
      const maxDim = Math.max(size.x, size.y, size.z) * 1.2; // Added 20% padding
      
      // Center the model
      scene.position.sub(center);
      
      // Notify parent of the size
      onSizeCalculated(maxDim);
    }
  }, [scene, onSizeCalculated]);
  
  return <primitive object={scene} />;
}

function CarModel({ modelPath, onSizeCalculated }) {
  return <ModelWrapper modelPath={modelPath} onSizeCalculated={onSizeCalculated} />;
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(4); // Start with RB19 (index 4)
  const [modelSize, setModelSize] = useState(null);
  const controlsRef = useRef();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAR_MODELS.length - 1 : prev - 1));
    setModelSize(null); // Reset size for new model
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === CAR_MODELS.length - 1 ? 0 : prev + 1));
    setModelSize(null); // Reset size for new model
  };

  const handleSizeCalculated = (size) => {
    setModelSize(size);
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0, 
      padding: 0, 
      width: '100vw',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' 
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#ffffff',
        overflow: 'hidden'
      }}>
        <Canvas camera={{ position: [0, 1.4, 6], fov: 50 }}>
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1.0} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <CameraController modelSize={modelSize} />

          <Suspense fallback={<LoaderFallback />}>
            <CarModel 
              key={currentIndex} 
              modelPath={CAR_MODELS[currentIndex].path}
              onSizeCalculated={handleSizeCalculated}
            />
          </Suspense>

          <OrbitControls 
            ref={controlsRef} 
            enablePan={false} 
            enableZoom={true}
            minDistance={modelSize ? modelSize * 0.5 : 1}
            maxDistance={modelSize ? modelSize * 3 : 20}
          />
        </Canvas>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.8)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.5)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ‹
        </button>

        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.8)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.5)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ›
        </button>

        {/* Model Name Display */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          {CAR_MODELS[currentIndex].name}
        </div>
      </div>
    </div>
  );
}

// Preload all models
CAR_MODELS.forEach(car => useGLTF.preload(car.path));