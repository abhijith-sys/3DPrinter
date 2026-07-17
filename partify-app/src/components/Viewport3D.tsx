import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Center, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Suspense, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'

export type TransformMode = 'translate' | 'scale' | 'rotate' | 'layers'

export type Viewport3DProps = {
  materialColor?: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  transformMode: TransformMode
  showSupports?: boolean
  showAdhesion?: boolean
  layerProgress?: number
  simulating?: boolean
  simulationProgress?: number
  locked?: boolean
  onPositionChange?: (pos: [number, number, number]) => void
  onDragAxis?: (axis: 'x' | 'y' | 'z', delta: number) => void
}

function SupportStructure({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <group position={[0, 0.05, 0]}>
      {[
        [-0.4, 0, -0.25],
        [0.4, 0, -0.25],
        [-0.4, 0, 0.25],
        [0.4, 0, 0.25],
        [0, 0, 0],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.04, 0.35, 8]} />
          <meshStandardMaterial color="#d4ff00" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

function BedAdhesion({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <ringGeometry args={[0.55, 0.95, 48]} />
      <meshStandardMaterial color="#536600" transparent opacity={0.35} side={THREE.DoubleSide} />
    </mesh>
  )
}

function PartModel({
  color,
  position,
  rotation,
  scale,
  transformMode,
  showSupports,
  showAdhesion,
  layerProgress,
  simulating,
  simulationProgress,
  locked,
  onPositionChange,
}: Omit<Viewport3DProps, 'onDragAxis'> & { color: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const dragRef = useRef<{ active: boolean; axis: 'x' | 'y' | 'z' | null; start: THREE.Vector3 }>({
    active: false,
    axis: null,
    start: new THREE.Vector3(),
  })

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.position.set(...position)
    groupRef.current.rotation.set(...rotation)
    groupRef.current.scale.set(...scale)
  }, [position, rotation, scale])

  useFrame((_, delta) => {
    if (!groupRef.current || !simulating) return
    groupRef.current.rotation.y += delta * 0.35
  })

  const clipHeight = useMemo(() => {
    if (transformMode === 'layers') return Math.max(0.05, layerProgress ?? 1)
    if (simulating) return Math.max(0.08, simulationProgress ?? 0.5)
    return 2
  }, [transformMode, layerProgress, simulating, simulationProgress])

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (locked || transformMode !== 'translate') return
    e.stopPropagation()
    ;(e.target as HTMLElement)?.setPointerCapture?.(e.pointerId)
    dragRef.current = {
      active: true,
      axis: 'x',
      start: e.point.clone(),
    }
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragRef.current.active || locked || !onPositionChange) return
    e.stopPropagation()
    const dx = e.point.x - dragRef.current.start.x
    const dz = e.point.z - dragRef.current.start.z
    onPositionChange([position[0] + dx * 0.15, position[1], position[2] + dz * 0.15])
    dragRef.current.start.copy(e.point)
  }

  const onPointerUp = () => {
    dragRef.current.active = false
  }

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Center>
        <group>
          <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
            <boxGeometry args={[1.2, 0.3, 0.8]} />
            <meshStandardMaterial
              color={color}
              metalness={0.35}
              roughness={0.4}
              clippingPlanes={
                transformMode === 'layers' || simulating
                  ? [new THREE.Plane(new THREE.Vector3(0, -1, 0), clipHeight)]
                  : []
              }
            />
          </mesh>
          <mesh castShadow position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 0.5, 32]} />
            <meshStandardMaterial color={color} metalness={0.35} roughness={0.35} />
          </mesh>
          <mesh castShadow position={[0.35, 0.4, 0.2]} rotation={[0.3, 0.4, 0]}>
            <torusGeometry args={[0.22, 0.06, 16, 48]} />
            <meshStandardMaterial color="#b0d500" metalness={0.5} roughness={0.3} />
          </mesh>
          <SupportStructure visible={!!showSupports} />
          <BedAdhesion visible={!!showAdhesion} />
          {/* Layer cut plane indicator */}
          {(transformMode === 'layers' || simulating) && (
            <mesh position={[0, clipHeight * 0.9 - 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.6, 1.2]} />
              <meshBasicMaterial color="#d4ff00" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      </Center>
    </group>
  )
}

export default function Viewport3D({
  materialColor = '#2a2a2a',
  position,
  rotation,
  scale,
  transformMode,
  showSupports,
  showAdhesion,
  layerProgress = 1,
  simulating = false,
  simulationProgress = 0.5,
  locked = false,
  onPositionChange,
}: Viewport3DProps) {
  // Always allow orbit; part drag stops propagation when translating
  const orbitEnabled = true

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        camera={{ position: [2.8, 2.2, 3.8], fov: 45 }}
        gl={{ antialias: true, localClippingEnabled: true }}
        style={{ background: '#0a0a0a' }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          castShadow
          position={[5, 8, 4]}
          intensity={1.2}
          shadow-mapSize={[1024, 1024]}
        />
        <Suspense fallback={null}>
          <PartModel
            color={materialColor}
            position={position}
            rotation={rotation}
            scale={scale}
            transformMode={transformMode}
            showSupports={showSupports}
            showAdhesion={showAdhesion}
            layerProgress={layerProgress}
            simulating={simulating}
            simulationProgress={simulationProgress}
            locked={locked}
            onPositionChange={onPositionChange}
          />
          <Environment preset="city" />
        </Suspense>
        <Grid
          infiniteGrid
          fadeDistance={18}
          sectionColor="#444"
          cellColor="#333"
          sectionSize={1}
          cellSize={0.25}
          position={[0, -0.01, 0]}
        />
        <OrbitControls
          makeDefault
          enabled={orbitEnabled}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.5}
          maxDistance={12}
        />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#ba1a1a', '#d4ff00', '#525a96']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
      <div className="blob w-96 h-96 top-1/4 left-1/4 pointer-events-none" />
    </div>
  )
}
