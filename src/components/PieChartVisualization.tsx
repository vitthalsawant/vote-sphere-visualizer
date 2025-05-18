import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Poll } from "@/types/poll";
import * as THREE from 'three';

interface PieChartVisualizationProps {
  poll: Poll;
}

// Bright and vibrant colors for the pie chart segments
const COLORS = [
  '#FF0000', // Bright Red
  '#00FF00', // Bright Green
  '#0000FF', // Bright Blue
  '#FFFF00', // Bright Yellow
  '#FF00FF', // Bright Magenta
  '#00FFFF', // Bright Cyan
  '#FF8000', // Bright Orange
  '#8000FF', // Bright Purple
  '#00FF80', // Bright Mint
  '#FF0080', // Bright Pink
];

const PieChartSegment = ({ 
  startAngle, 
  endAngle, 
  color, 
  label, 
  percentage, 
  votes,
  index,
  hovered,
  setHovered
}: { 
  startAngle: number, 
  endAngle: number, 
  color: string, 
  label: string,
  percentage: number,
  votes: number,
  index: number,
  hovered: number | null,
  setHovered: (index: number | null) => void
}) => {
  const segments = 32;
  const vertices = [];
  
  // Add center vertex
  vertices.push(0, 0, 0);
  
  // Add vertices around the perimeter
  for (let i = 0; i <= segments; i++) {
    const theta = startAngle + (endAngle - startAngle) * (i / segments);
    const x = Math.cos(theta);
    const y = Math.sin(theta);
    vertices.push(x, y, 0);
  }
  
  // Create faces (triangles)
  const indices = [];
  for (let i = 0; i < segments; i++) {
    indices.push(0, i + 1, i + 2);
  }
  
  // Make the hovered segment pop out
  const isHovered = hovered === index;
  const zOffset = isHovered ? 0.2 : 0;
  
  // Don't render if percentage is 0
  if (percentage === 0) return null;
  
  return (
    <group position={[0, 0, zOffset]}>
      <mesh 
        onPointerOver={() => setHovered(index)}
        onPointerOut={() => setHovered(null)}
      >
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={vertices.length / 3} 
            array={new Float32Array(vertices)} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="index" 
            count={indices.length} 
            array={new Uint16Array(indices)} 
            itemSize={1} 
          />
        </bufferGeometry>
        <meshBasicMaterial color={color} />
      </mesh>
      
      {isHovered && (
        <Html position={[
          Math.cos(startAngle + (endAngle - startAngle) / 2) * 0.7,
          Math.sin(startAngle + (endAngle - startAngle) / 2) * 0.7,
          0.1
        ]}>
          <div className="bg-white p-2 rounded shadow-lg text-sm whitespace-nowrap border border-indigo-100">
            <div><strong>{label}</strong></div>
            <div>{votes} votes ({percentage}%)</div>
          </div>
        </Html>
      )}
    </group>
  );
};

const PieChart3D = ({ poll }: { poll: Poll }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const totalVotes = Object.values(poll.votes || {}).reduce((sum, count) => sum + count, 0);
  
  const segments = poll.options.map((option, index) => {
    const votes = poll.votes?.[index] || 0;
    const percentage = totalVotes > 0 ? Math.round((votes * 100) / totalVotes) : 0;
    return { option, votes, percentage };
  });
  
  let currentAngle = 0;
  const segmentsWithAngles = segments.map((segment, index) => {
    const startAngle = currentAngle;
    const angleSize = (segment.percentage / 100) * Math.PI * 2;
    const endAngle = startAngle + angleSize;
    currentAngle = endAngle;
    
    return {
      ...segment,
      startAngle,
      endAngle,
      color: COLORS[index % COLORS.length],
      index
    };
  });
  
  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      <group rotation={[-Math.PI / 6, 0, 0]}>
        {segmentsWithAngles.map((segment) => (
          <PieChartSegment
            key={segment.index}
            startAngle={segment.startAngle}
            endAngle={segment.endAngle}
            color={segment.color}
            label={segment.option}
            percentage={segment.percentage}
            votes={segment.votes}
            index={segment.index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </group>
      
      <Html position={[0, 1.5, 0]}>
        <div className="text-center">
          <h3 className="font-semibold text-gray-800">Results Visualization</h3>
          <p className="text-sm text-gray-500">Hover segments for details</p>
        </div>
      </Html>
    </group>
  );
};

const PieChartVisualization = ({ poll }: PieChartVisualizationProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <PieChart3D poll={poll} />
      <OrbitControls 
        enableZoom={true}
        minDistance={2}
        maxDistance={5}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default PieChartVisualization;
