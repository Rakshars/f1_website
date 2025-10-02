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
      const clonedScene = scene.clone(true);
      
      const bbox = new THREE.Box3().setFromObject(clonedScene);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z) * 1.2;
      
      clonedScene.position.sub(center);
      clonedScene.rotation.set(0, 0, 0);
      
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.needsUpdate = true;
                mat.metalness = mat.metalness || 0.3;
                mat.roughness = mat.roughness || 0.7;
              });
            } else {
              child.material.needsUpdate = true;
              child.material.metalness = child.material.metalness || 0.3;
              child.material.roughness = child.material.roughness || 0.7;
            }
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });
      
      if (groupRef.current) {
        groupRef.current.clear();
        groupRef.current.add(clonedScene);
      }
      
      onSizeCalculated(maxDim);
    }
  }, [scene, onSizeCalculated]);
  
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
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [trackData, setTrackData] = useState(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [trackError, setTrackError] = useState(null);
  const controlsRef = useRef();
  const [driverStandings, setDriverStandings] = useState(null);
  const [constructorStandings, setConstructorStandings] = useState(null);
  const [loadingStandings, setLoadingStandings] = useState(false);

  const currentCars = TEAMS[currentTeam].cars;
  const currentCar = currentCars[currentCarIndex];

  // Available years for F1 data
  const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

  // F1 tracks with Jolpica API meeting IDs
  const tracks = [
    { id: '1246', name: 'Bahrain International Circuit' },
    { id: '1247', name: 'Jeddah Corniche Circuit' },
    { id: '1248', name: 'Albert Park Circuit' },
    { id: '1249', name: 'Suzuka International Racing Course' },
    { id: '1250', name: 'Shanghai International Circuit' },
    { id: '1251', name: 'Miami International Autodrome' },
    { id: '1252', name: 'Autodromo Enzo e Dino Ferrari' },
    { id: '1253', name: 'Circuit de Monaco' },
    { id: '1208', name: 'Circuit Gilles Villeneuve' },
    { id: '1254', name: 'Red Bull Ring' },
    { id: '1255', name: 'Silverstone Circuit' },
    { id: '1256', name: 'Hungaroring' },
    { id: '1257', name: 'Circuit de Spa-Francorchamps' },
    { id: '1258', name: 'Circuit Zandvoort' },
    { id: '1259', name: 'Autodromo Nazionale di Monza' },
    { id: '1260', name: 'Baku City Circuit' },
    { id: '1261', name: 'Marina Bay Street Circuit' },
    { id: '1262', name: 'Circuit of the Americas' },
    { id: '1263', name: 'Autódromo Hermanos Rodríguez' },
    { id: '1264', name: 'Autódromo José Carlos Pace' },
    { id: '1265', name: 'Las Vegas Strip Circuit' },
    { id: '1266', name: 'Losail International Circuit' },
    { id: '1267', name: 'Yas Marina Circuit' }
  ];

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

  const fetchTrackData = async (meetingId, year) => {
    if (!meetingId || !year) return;
    
    setLoadingTrack(true);
    setTrackError(null);
    
    try {
      const apiUrl = `https://api.jolpi.ca/ergast/f1/${year}/circuits.json`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Unable to fetch data');
      }
      
      const data = await response.json();
      
      if (data && data.MRData && data.MRData.CircuitTable && data.MRData.CircuitTable.Circuits) {
        const circuits = data.MRData.CircuitTable.Circuits;
        
        // Try to find race results for this circuit
        const resultsUrl = `https://api.jolpi.ca/ergast/f1/${year}/results.json?limit=1000`;
        const resultsResponse = await fetch(resultsUrl);
        
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          
          if (resultsData && resultsData.MRData && resultsData.MRData.RaceTable && resultsData.MRData.RaceTable.Races) {
            const races = resultsData.MRData.RaceTable.Races;
            
            // Find matching race by circuit name
            const trackInfo = tracks.find(t => t.id === meetingId);
            const matchingRace = races.find(race => 
              race.Circuit.circuitName.toLowerCase().includes(trackInfo.name.toLowerCase().split(' ')[0]) ||
              trackInfo.name.toLowerCase().includes(race.Circuit.circuitName.toLowerCase().split(' ')[0])
            );
            
            if (matchingRace) {
              const circuit = matchingRace.Circuit;
              const winner = matchingRace.Results && matchingRace.Results[0];
              
              setTrackData({
                name: circuit.circuitName,
                location: `${circuit.Location.locality}, ${circuit.Location.country}`,
                coordinates: `${circuit.Location.lat}, ${circuit.Location.long}`,
                raceName: matchingRace.raceName,
                raceDate: matchingRace.date,
                round: matchingRace.round,
                season: matchingRace.season,
                winner: winner ? {
                  name: `${winner.Driver.givenName} ${winner.Driver.familyName}`,
                  team: winner.Constructor.name,
                  time: winner.Time?.time || 'N/A',
                  grid: winner.grid,
                  points: winner.points
                } : null
              });
              return;
            }
          }
        }
        
        // Fallback if no race found
        const trackInfo = tracks.find(t => t.id === meetingId);
        setTrackError(`No race data found for ${trackInfo?.name || 'this circuit'} in ${year}. This track may not have been on the F1 calendar that year.`);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error fetching track data:', error);
      
      const trackInfo = tracks.find(t => t.id === meetingId);
      setTrackError(
        `Unable to load race data from the Jolpica F1 API. This could be due to:\n\n` +
        `• API service being temporarily unavailable\n` +
        `• No race at ${trackInfo?.name || 'this circuit'} in ${year}\n` +
        `• Network connectivity issues\n\n` +
        `Try selecting a different year or circuit.`
      );
      
      setTrackData(null);
    } finally {
      setLoadingTrack(false);
    }
  };

  const fetchChampionshipStandings = async (year) => {
    if (!year) return;
    
    setLoadingStandings(true);
    
    try {
      // Fetch driver standings
      const driversResponse = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`);
      if (driversResponse.ok) {
        const driversData = await driversResponse.json();
        if (driversData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
          setDriverStandings(driversData.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        }
      }
      
      // Fetch constructor standings
      const constructorsResponse = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/constructorStandings.json`);
      if (constructorsResponse.ok) {
        const constructorsData = await constructorsResponse.json();
        if (constructorsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) {
          setConstructorStandings(constructorsData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
        }
      }
    } catch (error) {
      console.error('Error fetching championship standings:', error);
    } finally {
      setLoadingStandings(false);
    }
  };

  const handleTrackChange = (e) => {
    const trackId = e.target.value;
    setSelectedTrack(trackId);
    if (trackId && selectedYear) {
      fetchTrackData(trackId, selectedYear);
    } else {
      setTrackData(null);
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (selectedTrack && year) {
      fetchTrackData(selectedTrack, year);
    }
    // Fetch championship standings for the selected year
    fetchChampionshipStandings(year);
  };

  useEffect(() => {
  // Load standings for initial year on mount
  fetchChampionshipStandings(selectedYear);
}, []);

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      width: '100%',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* 3D Viewer Section - Full Screen */}
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: currentTeam === 'ferrari' ? '#DC0000' : 
                    currentTeam === 'mclaren' ? '#FF8700' : 
                    currentTeam === 'mercedes' ? '#00D2BE' : '#001D46',
        overflow: 'hidden',
        transition: 'background 0.5s ease',
        margin: 0,
        padding: 0,
        left: 0,
        right: 0
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

        <Canvas camera={{ position: [0, 1.4, 6], fov: 50 }} style={{ width: '100%', height: '100%' }}>
          <color attach="background" args={[
            currentTeam === 'ferrari' ? '#DC0000' : 
            currentTeam === 'mclaren' ? '#FF8700' : 
            currentTeam === 'mercedes' ? '#00D2BE' : '#001D46'
          ]} />
          
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <directionalLight position={[-10, 10, -10]} intensity={1.2} />
          <directionalLight position={[0, 10, -10]} intensity={1.0} />
          <pointLight position={[5, 5, 5]} intensity={1.0} />
          <pointLight position={[-5, 5, -5]} intensity={1.0} />
          <pointLight position={[0, -5, 0]} intensity={0.8} />
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
          background: `linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7))`,
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
            boxShadow: `0 8px 32px ${TEAMS[currentTeam].color}40`,
            maxHeight: '70vh',
            overflowY: 'auto'
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

      {/* Track Data Section */}
      <div style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        padding: '60px 20px',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            F1 Circuit Data
          </h2>
          
          <p style={{
            color: '#999',
            textAlign: 'center',
            fontSize: '18px',
            marginBottom: '50px'
          }}>
            Select a circuit to view detailed information
          </p>

          {/* Track and Year Selectors */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '15px 25px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '150px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              {years.map(year => (
                <option key={year} value={year} style={{ background: '#1a1a1a', color: 'white' }}>
                  {year} Season
                </option>
              ))}
            </select>

            <select
              value={selectedTrack}
              onChange={handleTrackChange}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                padding: '15px 25px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '350px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <option value="" style={{ background: '#1a1a1a', color: 'white' }}>
                Select a Circuit
              </option>
              {tracks.map(track => (
                <option key={track.id} value={track.id} style={{ background: '#1a1a1a', color: 'white' }}>
                  {track.name}
                </option>
              ))}
            </select>
          </div>

          {/* Track Data Display */}
          {trackData && !loadingTrack && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              padding: '40px',
              maxWidth: '800px',
              margin: '0 auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                {trackData.name}
              </h3>
              
              <p style={{
                color: '#999',
                fontSize: '18px',
                textAlign: 'center',
                marginBottom: '40px'
              }}>
                {trackData.raceName} - Round {trackData.round}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    color: '#999',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    Location
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {trackData.location}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    color: '#999',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    Coordinates
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {trackData.coordinates}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    color: '#999',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    Race Date
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {new Date(trackData.raceDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    color: '#999',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    Season
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {trackData.season}
                  </div>
                </div>
              </div>

              {trackData.winner && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '20px',
                  padding: '30px',
                  marginTop: '30px'
                }}>
                  <div style={{
                    color: '#FFD700',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '16px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    Race Winner
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}>
                    {trackData.winner.name}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    marginTop: '20px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        color: '#999',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        marginBottom: '6px'
                      }}>
                        Team
                      </div>
                      <div style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {trackData.winner.team}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        color: '#999',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        marginBottom: '6px'
                      }}>
                        Time
                      </div>
                      <div style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {trackData.winner.time}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        color: '#999',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        marginBottom: '6px'
                      }}>
                        Grid Position
                      </div>
                      <div style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        P{trackData.winner.grid}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loadingTrack && (
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '18px',
              padding: '40px'
            }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTop: '4px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '20px' }}>Loading circuit data...</p>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          )}

          {/* Error State */}
            {trackError && (
              <div style={{
                background: 'rgba(220, 0, 0, 0.2)',
                border: '2px solid rgba(220, 0, 0, 0.5)',
                borderRadius: '15px',
                padding: '30px',
                color: '#ff6666',
                fontSize: '16px',
                maxWidth: '700px',
                margin: '40px auto 0 auto',  // CHANGED THIS LINE
                lineHeight: '1.6',
                whiteSpace: 'pre-line'
              }}>
              {trackError}
            </div>
          )}

          

          {/* Info Text */}
          {!selectedTrack && !loadingTrack && (
            <div style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '16px',
              marginTop: '40px'
            }}>
              <p>Select a circuit from the dropdown above to view detailed information</p>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                Data provided by Jolpica F1 API
              </p>
            </div>
          )}

          {/* Championship Standings Tables */}
          <div style={{
            marginTop: '100px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '40px'
          }}>
            {/* Driver Standings */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              padding: '30px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '25px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                {selectedYear} Driver Standings
              </h3>
              
              {loadingStandings ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  Loading standings...
                </div>
              ) : driverStandings ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'left', textTransform: 'uppercase', fontSize: '12px' }}>Pos</th>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'left', textTransform: 'uppercase', fontSize: '12px' }}>Driver</th>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'left', textTransform: 'uppercase', fontSize: '12px' }}>Team</th>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'center', textTransform: 'uppercase', fontSize: '12px' }}>Points</th>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'center', textTransform: 'uppercase', fontSize: '12px' }}>Wins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverStandings.map((driver, index) => (
                        <tr key={index} style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{
                            padding: '16px 8px',
                            color: index < 3 ? '#FFD700' : 'white',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {driver.position}
                          </td>
                          <td style={{ padding: '16px 8px', color: 'white', fontWeight: 'bold' }}>
                            {driver.Driver.givenName} {driver.Driver.familyName}
                          </td>
                          <td style={{ padding: '16px 8px', color: '#999' }}>
                            {driver.Constructors[0].name}
                          </td>
                          <td style={{
                            padding: '16px 8px',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {driver.points}
                          </td>
                          <td style={{ padding: '16px 8px', color: '#999', textAlign: 'center' }}>
                            {driver.wins}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  No driver standings available
                </div>
              )}
            </div>

            {/* Constructor Standings */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              padding: '30px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '25px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                {selectedYear} Constructor Standings
              </h3>
              
              {loadingStandings ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  Loading standings...
                </div>
              ) : constructorStandings ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'left', textTransform: 'uppercase', fontSize: '12px' }}>Pos</th>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'left', textTransform: 'uppercase', fontSize: '12px' }}>Team</th>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'center', textTransform: 'uppercase', fontSize: '12px' }}>Points</th>
                        <th style={{ padding: '12px 8px', color: '#999', textAlign: 'center', textTransform: 'uppercase', fontSize: '12px' }}>Wins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {constructorStandings.map((constructor, index) => (
                        <tr key={index} style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{
                            padding: '16px 8px',
                            color: index < 3 ? '#FFD700' : 'white',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {constructor.position}
                          </td>
                          <td style={{ padding: '16px 8px', color: 'white', fontWeight: 'bold' }}>
                            {constructor.Constructor.name}
                          </td>
                          <td style={{
                            padding: '16px 8px',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {constructor.points}
                          </td>
                          <td style={{ padding: '16px 8px', color: '#999', textAlign: 'center' }}>
                            {constructor.wins}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  No constructor standings available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preload all models
Object.values(TEAMS).forEach(team => {
  team.cars.forEach(car => useGLTF.preload(car.path));
});