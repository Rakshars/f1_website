import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// All car models organized by team
const TEAMS = {
  redbull: {
    name: "Red Bull Racing",
    color: "#0600EF",
    cars: [
      { name: "RB6", path: "/models/redbull/rb6.glb", year: "2010" },
      { name: "RB7", path: "/models/redbull/rb7.glb", year: "2011" },
      { name: "RB9", path: "/models/redbull/rb9.glb", year: "2013" },
      { name: "RB16", path: "/models/redbull/rb16.glb", year: "2020" },
      { name: "RB19", path: "/models/redbull/rb19.glb", year: "2023" },
      { name: "RB20", path: "/models/redbull/rb20.glb", year: "2024" }
    ]
  },
  ferrari: {
    name: "Scuderia Ferrari",
    color: "#DC0000",
    cars: [
      { name: "F1-75", path: "/models/ferrari/f1-75.glb", year: "2022" },
      { name: "SF23", path: "/models/ferrari/sf23.glb", year: "2023" }
    ]
  },
  mclaren: {
    name: "McLaren F1 Team",
    color: "#FF8700",
    cars: [
      { name: "MCL35M", path: "/models/mclaren/mcl35m.glb", year: "2021" },
      { name: "MCL36", path: "/models/mclaren/mcl36.glb", year: "2022" },
      { name: "MCL60", path: "/models/mclaren/mcl60.glb", year: "2023" },
      { name: "MP4", path: "/models/mclaren/mp4.glb", year: "2008" }
    ]
  },
  mercedes: {
    name: "Mercedes-AMG Petronas",
    color: "#00D2BE",
    cars: [
      { name: "W11", path: "/models/mercedes/w11.glb", year: "2020" },
      { name: "W13", path: "/models/mercedes/w13.glb", year: "2022" },
      { name: "W14", path: "/models/mercedes/w14.glb", year: "2023" }
    ]
  }
};

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
      const fov = camera.fov * (Math.PI / 180);
      const distance = Math.abs(modelSize / Math.sin(fov / 2)) * 0.38;
      
      const angle = Math.PI / 4;
      const x = distance * Math.sin(angle);
      const z = distance * Math.cos(angle);
      const y = modelSize * 0.35;
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
      
      camera.near = distance * 0.01;
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
      
      const maxDim = Math.max(size.x, size.y, size.z) * 1.2;
      
      // Center the model
      scene.position.sub(center);
      
      // Reset all rotations to ensure cars face the same direction as Red Bulls
      scene.rotation.set(0, 0, 0);
      
      onSizeCalculated(maxDim);
    }
  }, [scene, onSizeCalculated]);
  
  return <primitive object={scene} />;
}

function CarModel({ modelPath, onSizeCalculated }) {
  return <ModelWrapper modelPath={modelPath} onSizeCalculated={onSizeCalculated} />;
}

export default function App() {
  const [currentTeam, setCurrentTeam] = useState('redbull');
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [modelSize, setModelSize] = useState(null);
  const controlsRef = useRef();

  const currentCars = TEAMS[currentTeam].cars;
  const currentCar = currentCars[currentCarIndex];

  const handleTeamChange = (teamKey) => {
    setCurrentTeam(teamKey);
    setCurrentCarIndex(0);
    setModelSize(null);
  };

  const handlePrevious = () => {
    setCurrentCarIndex((prev) => (prev === 0 ? currentCars.length - 1 : prev - 1));
    setModelSize(null);
  };

  const handleNext = () => {
    setCurrentCarIndex((prev) => (prev === currentCars.length - 1 ? 0 : prev + 1));
    setModelSize(null);
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
        background: '#001D46',
        overflow: 'hidden'
      }}>
        {/* Team Selection Buttons */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 20,
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '12px',
          borderRadius: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          {Object.entries(TEAMS).map(([key, team]) => (
            <button
              key={key}
              onClick={() => handleTeamChange(key)}
              style={{
                background: currentTeam === key ? team.color : 'rgba(255, 255, 255, 0.2)',
                border: currentTeam === key ? `2px solid ${team.color}` : '2px solid transparent',
                borderRadius: '20px',
                padding: '10px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: currentTeam === key ? `0 0 20px ${team.color}50` : 'none'
              }}
              onMouseEnter={(e) => {
                if (currentTeam !== key) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentTeam !== key) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {key === 'redbull' ? 'Red Bull' : 
               key === 'ferrari' ? 'Ferrari' : 
               key === 'mclaren' ? 'McLaren' : 'Mercedes'}
            </button>
          ))}
        </div>

        <Canvas camera={{ position: [0, 1.4, 6], fov: 50 }}>
          <color attach="background" args={["#001D46"]} />
          
          {/* Much brighter ambient light */}
          <ambientLight intensity={1.5} />
          
          {/* Multiple directional lights from different angles */}
          <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 10, -10]} intensity={1.2} />
          <directionalLight position={[0, 10, -10]} intensity={1.0} />
          
          {/* Point lights for fill */}
          <pointLight position={[5, 5, 5]} intensity={1.0} />
          <pointLight position={[-5, 5, -5]} intensity={1.0} />
          <pointLight position={[0, -5, 0]} intensity={0.8} />
          
          {/* Hemisphere light for overall illumination */}
          <hemisphereLight args={['#ffffff', '#444444', 1.0]} />

          <CameraController modelSize={modelSize} />

          <Suspense fallback={<LoaderFallback />}>
            <CarModel 
              key={`${currentTeam}-${currentCarIndex}`}
              modelPath={currentCar.path}
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
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(135deg, ${TEAMS[currentTeam].color}ee, ${TEAMS[currentTeam].color}99)`,
          color: 'white',
          padding: '16px 40px',
          borderRadius: '25px',
          fontSize: '28px',
          fontWeight: 'bold',
          zIndex: 10,
          textAlign: 'center',
          boxShadow: `0 8px 32px ${TEAMS[currentTeam].color}40`,
          border: `2px solid ${TEAMS[currentTeam].color}`
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            {TEAMS[currentTeam].name}
          </div>
          <div>{currentCar.name}</div>
          <div style={{ fontSize: '16px', marginTop: '4px', opacity: 0.9 }}>
            {currentCar.year}
          </div>
        </div>

        {/* Car Counter */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '15px',
          fontSize: '14px',
          zIndex: 10
        }}>
          {currentCarIndex + 1} / {currentCars.length}
        </div>
      </div>
    </div>
  );
}

// Preload all models
Object.values(TEAMS).forEach(team => {
  team.cars.forEach(car => useGLTF.preload(car.path));
});