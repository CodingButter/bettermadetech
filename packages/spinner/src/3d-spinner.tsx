import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SpinnerProps, SpinnerSegment } from './types';

interface WheelSegmentProps {
  segment: SpinnerSegment;
  index: number;
  totalSegments: number;
  radius: number;
  depth: number;
  primaryColor: string;
  secondaryColor: string;
}

// A custom wheel segment component
function WheelSegment({ 
  segment, 
  index, 
  totalSegments, 
  radius, 
  depth, 
  primaryColor, 
  secondaryColor 
}: WheelSegmentProps) {
  const angle = (Math.PI * 2) / totalSegments;
  const startAngle = index * angle;
  const endAngle = (index + 1) * angle;
  const isEvenSegment = index % 2 === 0;
  const color = isEvenSegment ? primaryColor : secondaryColor;
  
  // Create geometry for the segment
  const segmentShape = new THREE.Shape();
  segmentShape.moveTo(0, 0);
  segmentShape.arc(0, 0, radius, startAngle, endAngle, false);
  segmentShape.lineTo(0, 0);
  
  // Text position calculations
  const textAngle = startAngle + angle / 2;
  const textX = (radius * 0.75) * Math.cos(textAngle);
  const textY = (radius * 0.75) * Math.sin(textAngle);
  const textRotation = textAngle + Math.PI / 2;
  
  return (
    <group>
      {/* Segment */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry 
          args={[
            segmentShape, 
            { 
              depth: depth, 
              bevelEnabled: false
            }
          ]} 
        />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Text */}
      <group position={[textX, textY, depth / 2 + 0.01]} rotation={[0, 0, textRotation]}>
        <Text
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1}
        >
          {segment.label}
        </Text>
      </group>
    </group>
  );
}

interface SpinningWheelProps {
  segments: SpinnerSegment[];
  isSpinning: boolean;
  duration: number;
  rotation: number;
  setRotation: (rotation: number) => void;
  finalRotation: number;
  primaryColor: string;
  secondaryColor: string;
}

// The main wheel component that spins
function SpinningWheel({ 
  segments, 
  isSpinning, 
  duration, 
  rotation, 
  setRotation, 
  finalRotation,
  primaryColor,
  secondaryColor
}: SpinningWheelProps) {
  const wheelRef = useRef<THREE.Group>(null);
  const [speed, setSpeed] = useState<number>(0);
  const [targetRotation, setTargetRotation] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Set up spinning animation
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      setIsAnimating(true);
      setTargetRotation(finalRotation);
      
      // Gradually decrease speed as we approach final rotation
      const initialSpeed = 5; // Initial speed
      setSpeed(initialSpeed);
      
      // After duration, stop the animation
      setTimeout(() => {
        setIsAnimating(false);
        setSpeed(0);
      }, duration * 1000);
    }
  }, [isSpinning, finalRotation, isAnimating, duration]);
  
  // Animation loop
  useFrame(() => {
    if (isAnimating) {
      // Calculate remaining rotation
      const remaining = targetRotation - rotation;
      
      // Decelerate as we approach the target
      const newSpeed = Math.max(0.01, speed * 0.99);
      setSpeed(newSpeed);
      
      // Update rotation
      const step = Math.min(remaining, newSpeed);
      setRotation(rotation + step);
    }
  });
  
  const wheelRadius = 2;
  const wheelDepth = 0.2;
  
  return (
    <group ref={wheelRef} rotation={[0, 0, rotation]}>
      {/* Center hub */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, wheelDepth + 0.05, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Wheel segments */}
      {segments.map((segment, index) => (
        <WheelSegment
          key={segment.id}
          segment={segment}
          index={index}
          totalSegments={segments.length}
          radius={wheelRadius}
          depth={wheelDepth}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      ))}
    </group>
  );
}

// Marker/pointer component
function Pointer() {
  return (
    <mesh position={[0, 2.3, 0.3]}>
      <coneGeometry args={[0.2, 0.4, 32]} />
      <meshStandardMaterial color="#f97316" />
    </mesh>
  );
}

// Main 3D Spinner component
export function Spinner3D({
  segments,
  duration = 5,
  primaryColor = '#4f46e5',
  secondaryColor = '#f97316',
  isSpinning = false,
  onSpinEnd,
  className,
  showWinner = false,
}: SpinnerProps) {
  const [rotation, setRotation] = useState<number>(0);
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  const [finalRotation, setFinalRotation] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate final rotation and winner when spinning starts
  useEffect(() => {
    if (isSpinning) {
      // Calculate random winner and final rotation
      const randomSegment = Math.floor(Math.random() * segments.length);
      const segmentAngle = (Math.PI * 2) / segments.length;
      
      // Base rotation (current) plus multiple full rotations plus position to winner
      const fullRotations = 3 + Math.floor(Math.random() * 7);
      const targetRotation = rotation + (fullRotations * Math.PI * 2) + (segmentAngle * randomSegment);
      
      setFinalRotation(targetRotation);
      
      // Set winner after spin completes
      setTimeout(() => {
        const winningSegment = segments[randomSegment];
        if (winningSegment) {
          setWinner(winningSegment);
          if (onSpinEnd) {
            onSpinEnd(winningSegment);
          }
        }
      }, duration * 1000);
    }
  }, [isSpinning, segments, rotation, duration, onSpinEnd]);
  
  return (
    <div className={className ? `relative ${className}` : 'relative w-full h-[500px]'}>
      <Canvas 
        ref={canvasRef}
        camera={{ 
          position: [0, 0, 5],
          fov: 50
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Main spinner components */}
        <SpinningWheel 
          segments={segments}
          isSpinning={isSpinning}
          duration={duration}
          rotation={rotation}
          setRotation={setRotation}
          finalRotation={finalRotation}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
        
        <Pointer />
        
        {/* Allow limited camera control */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Winner overlay */}
      {showWinner && winner && !isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
          <div className="text-center p-4">
            <div className="text-xl font-bold text-white mb-1">Winner!</div>
            <div className="text-2xl font-bold text-primary">{winner.label}</div>
            <div className="text-sm text-white mt-1">{winner.value}</div>
          </div>
        </div>
      )}
    </div>
  );
}