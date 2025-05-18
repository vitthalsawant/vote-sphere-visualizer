
import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Poll } from "@/types/poll";
import * as THREE from 'three'; // Add THREE import

interface PieChartVisualizationProps {
  poll: Poll;
}

// Colors for the pie chart segments
const COLORS = [
  '#8B5CF6', // Purple (primary)
  '#3B82F6', // Blue 
  '#2DD4BF', // Teal
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#8B5CF6', // Purple (repeat if needed)
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
  // Create the pie segment geometry
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
  const zOffset = isHovered ? 0.1 : 0;
  
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
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Show label when segment is hovered */}
      {isHovered && (
        <Html position={[
          Math.cos(startAngle + (endAngle - startAngle) / 2) * 0.7,
          Math.sin(startAngle + (endAngle - startAngle) / 2) * 0.7,
          0.1
        ]}>
          <div className="bg-white p-2 rounded shadow-lg text-sm whitespace-nowrap">
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
  
  // Calculate total votes and percentages
  const totalVotes = Object.values(poll.votes || {}).reduce((sum, count) => sum + count, 0);
  
  // Create segments data
  const segments = poll.options.map((option, index) => {
    const votes = poll.votes?.[index] || 0;
    const percentage = totalVotes > 0 ? Math.round((votes * 100) / totalVotes) : 0;
    return { option, votes, percentage };
  });
  
  // Calculate angles for each segment
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
      {/* Add slight tilt to the pie chart */}
      <group rotation={[-Math.PI / 6, 0, 0]}>
        {/* Render each pie segment */}
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
      
      {/* Chart title */}
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
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
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
