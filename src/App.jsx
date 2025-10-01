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
      { 
        name: "RB6", 
        path: "/models/redbull/rb6.glb", 
        year: "2010",
        stats: {
          engine: "Renault RS27-2010 V8",
          power: "~750 HP",
          weight: "620 kg",
          topSpeed: "325 km/h",
          championship: "Constructor's & Driver's Champion",
          driver: "Sebastian Vettel"
        },
        raceStats: {
          wins: 9,
          poles: 15,
          fastestLaps: 10
        }
      },
      { 
        name: "RB7", 
        path: "/models/redbull/rb7.glb", 
        year: "2011",
        stats: {
          engine: "Renault RS27-2011 V8",
          power: "~750 HP",
          weight: "640 kg",
          topSpeed: "330 km/h",
          championship: "Constructor's & Driver's Champion",
          driver: "Sebastian Vettel"
        },
        raceStats: {
          wins: 12,
          poles: 18,
          fastestLaps: 11
        }
      },
      { 
        name: "RB9", 
        path: "/models/redbull/rb9.glb", 
        year: "2013",
        stats: {
          engine: "Renault RS27-2013 V8",
          power: "~750 HP",
          weight: "642 kg",
          topSpeed: "330 km/h",
          championship: "Constructor's & Driver's Champion",
          driver: "Sebastian Vettel"
        },
        raceStats: {
          wins: 13,
          poles: 11,
          fastestLaps: 9
        }
      },
      { 
        name: "RB16", 
        path: "/models/redbull/rb16.glb", 
        year: "2020",
        stats: {
          engine: "Honda RA620H V6 Turbo Hybrid",
          power: "~1000 HP",
          weight: "746 kg",
          topSpeed: "340 km/h",
          championship: "2nd in Constructor's",
          driver: "Max Verstappen"
        },
        raceStats: {
          wins: 2,
          poles: 2,
          fastestLaps: 5
        }
      },
      { 
        name: "RB19", 
        path: "/models/redbull/rb19.glb", 
        year: "2023",
        stats: {
          engine: "Red Bull Powertrains RBPT V6 Turbo Hybrid",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "351 km/h",
          championship: "Constructor's & Driver's Champion",
          driver: "Max Verstappen"
        },
        raceStats: {
          wins: 21,
          poles: 12,
          fastestLaps: 14
        }
      },
      { 
        name: "RB20", 
        path: "/models/redbull/rb20.glb", 
        year: "2024",
        stats: {
          engine: "Red Bull Powertrains RBPT V6 Turbo Hybrid",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "355 km/h",
          championship: "2024 Season",
          driver: "Max Verstappen"
        },
        raceStats: {
          wins: 9,
          poles: 9,
          fastestLaps: 8
        }
      }
    ]
  },
  ferrari: {
    name: "Scuderia Ferrari",
    color: "#DC0000",
    cars: [
      { 
        name: "F1-75", 
        path: "/models/ferrari/f1-75.glb", 
        year: "2022",
        stats: {
          engine: "Ferrari 066/7 V6 Turbo Hybrid",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "350 km/h",
          championship: "2nd in Constructor's",
          driver: "Charles Leclerc"
        },
        raceStats: {
          wins: 4,
          poles: 12,
          fastestLaps: 7
        }
      },
      { 
        name: "SF23", 
        path: "/models/ferrari/sf23.glb", 
        year: "2023",
        stats: {
          engine: "Ferrari 066/10 V6 Turbo Hybrid",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "350 km/h",
          championship: "3rd in Constructor's",
          driver: "Charles Leclerc"
        },
        raceStats: {
          wins: 1,
          poles: 3,
          fastestLaps: 4
        }
      }
    ]
  },
  mclaren: {
    name: "McLaren F1 Team",
    color: "#FF8700",
    cars: [
      { 
        name: "MCL35M", 
        path: "/models/mclaren/mcl35m.glb", 
        year: "2021",
        stats: {
          engine: "Mercedes-AMG F1 M12 E Performance",
          power: "~1000 HP",
          weight: "752 kg",
          topSpeed: "345 km/h",
          championship: "4th in Constructor's",
          driver: "Daniel Ricciardo"
        },
        raceStats: {
          wins: 1,
          poles: 0,
          fastestLaps: 2
        }
      },
      { 
        name: "MCL36", 
        path: "/models/mclaren/mcl36.glb", 
        year: "2022",
        stats: {
          engine: "Mercedes-AMG F1 M13 E Performance",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "343 km/h",
          championship: "4th in Constructor's",
          driver: "Lando Norris"
        },
        raceStats: {
          wins: 0,
          poles: 0,
          fastestLaps: 1
        }
      },
      { 
        name: "MCL60", 
        path: "/models/mclaren/mcl60.glb", 
        year: "2023",
        stats: {
          engine: "Mercedes-AMG F1 M14 E Performance",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "345 km/h",
          championship: "2nd in Constructor's",
          driver: "Lando Norris"
        },
        raceStats: {
          wins: 0,
          poles: 0,
          fastestLaps: 3
        }
      },
      { 
        name: "MP4", 
        path: "/models/mclaren/mp4.glb", 
        year: "2008",
        stats: {
          engine: "Mercedes-Benz FO 108W V8",
          power: "~750 HP",
          weight: "605 kg",
          topSpeed: "320 km/h",
          championship: "Driver's Champion",
          driver: "Lewis Hamilton"
        },
        raceStats: {
          wins: 6,
          poles: 7,
          fastestLaps: 5
        }
      }
    ]
  },
  mercedes: {
    name: "Mercedes-AMG Petronas",
    color: "#00D2BE",
    cars: [
      { 
        name: "W11", 
        path: "/models/mercedes/w11.glb", 
        year: "2020",
        stats: {
          engine: "Mercedes-AMG F1 M11 EQ Performance",
          power: "~1000 HP",
          weight: "746 kg",
          topSpeed: "345 km/h",
          championship: "Constructor's & Driver's Champion",
          driver: "Lewis Hamilton"
        },
        raceStats: {
          wins: 13,
          poles: 15,
          fastestLaps: 9
        }
      },
      { 
        name: "W13", 
        path: "/models/mercedes/w13.glb", 
        year: "2022",
        stats: {
          engine: "Mercedes-AMG F1 M13 E Performance",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "340 km/h",
          championship: "3rd in Constructor's",
          driver: "Lewis Hamilton"
        },
        raceStats: {
          wins: 1,
          poles: 0,
          fastestLaps: 2
        }
      },
      { 
        name: "W14", 
        path: "/models/mercedes/w14.glb", 
        year: "2023",
        stats: {
          engine: "Mercedes-AMG F1 M14 E Performance",
          power: "~1000 HP",
          weight: "798 kg",
          topSpeed: "345 km/h",
          championship: "2nd in Constructor's",
          driver: "Lewis Hamilton"
        },
        raceStats: {
          wins: 0,
          poles: 0,
          fastestLaps: 2
        }
      }
    ]
  }
};

// Sound effect function using Web Audio API
const createHoverSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
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
  const groupRef = useRef();
  const rotationRef = useRef(0);
  
  useEffect(() => {
    if (scene) {
      // Clone the scene to avoid modifying the cached version
      const clonedScene = scene.clone(true);
      
      const bbox = new THREE.Box3().setFromObject(clonedScene);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z) * 1.2;
      
      // Center the model within the group
      clonedScene.position.sub(center);
      clonedScene.rotation.set(0, 0, 0);
      
      // Preserve original materials and colors
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          // Ensure materials are not affected by lighting too much
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
      
      // Clear the group and add the cloned scene
      if (groupRef.current) {
        groupRef.current.clear();
        groupRef.current.add(clonedScene);
      }
      
      onSizeCalculated(maxDim);
    }
  }, [scene, onSizeCalculated]);
  
  // Gentle rotation animation on the group, not the model
  useEffect(() => {
    let animationId;
    const animate = () => {
      if (groupRef.current) {
        rotationRef.current += 0.002;
        groupRef.current.rotation.y = rotationRef.current;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return <group ref={groupRef} />;
}

function CarModel({ modelPath, onSizeCalculated }) {
  return <ModelWrapper modelPath={modelPath} onSizeCalculated={onSizeCalculated} />;
}

export default function App() {
  const [currentTeam, setCurrentTeam] = useState('redbull');
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [modelSize, setModelSize] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const controlsRef = useRef();

  const currentCars = TEAMS[currentTeam].cars;
  const currentCar = currentCars[currentCarIndex];

  const handleTeamChange = (teamKey) => {
    setCurrentTeam(teamKey);
    setCurrentCarIndex(0);
    setModelSize(null);
    setShowInfo(false);
  };

  const handlePrevious = () => {
    setCurrentCarIndex((prev) => (prev === 0 ? currentCars.length - 1 : prev - 1));
    setModelSize(null);
    setShowInfo(false);
  };

  const handleNext = () => {
    setCurrentCarIndex((prev) => (prev === currentCars.length - 1 ? 0 : prev + 1));
    setModelSize(null);
    setShowInfo(false);
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
        background: currentTeam === 'ferrari' ? '#DC0000' : 
                    currentTeam === 'mclaren' ? '#FF8700' : 
                    currentTeam === 'mercedes' ? '#00D2BE' : '#001D46',
        overflow: 'hidden',
        transition: 'background 0.5s ease'
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
                createHoverSound();
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
          <color attach="background" args={[
            currentTeam === 'ferrari' ? '#DC0000' : 
            currentTeam === 'mclaren' ? '#FF8700' : 
            currentTeam === 'mercedes' ? '#00D2BE' : '#001D46'
          ]} />
          
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
            createHoverSound();
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
            createHoverSound();
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

        {/* Show Info Button */}
        <button
          onClick={() => {
            setShowInfo(!showInfo);
            if (controlsRef.current) {
              controlsRef.current.autoRotate = false;
            }
          }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            background: showInfo ? TEAMS[currentTeam].color : 'rgba(0, 0, 0, 0.6)',
            border: `2px solid ${TEAMS[currentTeam].color}`,
            borderRadius: '15px',
            padding: '12px 24px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            createHoverSound();
            e.target.style.background = TEAMS[currentTeam].color;
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            if (!showInfo) {
              e.target.style.background = 'rgba(0, 0, 0, 0.6)';
            }
            e.target.style.transform = 'scale(1)';
          }}
        >
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>

        {/* Car Stats Panel */}
        {showInfo && (
          <div style={{
            position: 'absolute',
            left: '40px',
            bottom: '110px',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `2px solid ${TEAMS[currentTeam].color}`,
            borderRadius: '20px',
            padding: '20px 24px',
            color: 'white',
            fontSize: '14px',
            zIndex: 10,
            minWidth: '280px',
            boxShadow: `0 8px 32px ${TEAMS[currentTeam].color}40`
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: TEAMS[currentTeam].color,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Technical Specifications
            </div>
            {Object.entries(currentCar.stats).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  opacity: 0.8
                }}>
                  {key}:
                </span>
                <span style={{ textAlign: 'right', marginLeft: '12px' }}>
                  {value}
                </span>
              </div>
            ))}
            
            {/* Racing Statistics */}
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginTop: '20px',
              marginBottom: '16px',
              color: TEAMS[currentTeam].color,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Racing Statistics
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                Race Wins:
              </span>
              <span style={{ textAlign: 'right', marginLeft: '12px' }}>
                {currentCar.raceStats.wins}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                Pole Positions:
              </span>
              <span style={{ textAlign: 'right', marginLeft: '12px' }}>
                {currentCar.raceStats.poles}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                Fastest Laps:
              </span>
              <span style={{ textAlign: 'right', marginLeft: '12px' }}>
                {currentCar.raceStats.fastestLaps}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Preload all models
Object.values(TEAMS).forEach(team => {
  team.cars.forEach(car => useGLTF.preload(car.path));
});