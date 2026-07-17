import { Canvas, useThree } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import { useTheme } from '../theme/ThemeContext'

type Vector3 = [number, number, number]
type Axis = 0 | 1 | 2
type ViewMode = 'perspective' | 'front' | 'side'
type Tool = 'add' | 'frame' | 'cut'
type LayerId = 'palm' | 'tendons' | 'joints'

const fingerLayout = [
  { x: -0.54, y: 1.4, length: 0.84, angle: 0.17 },
  { x: -0.19, y: 1.57, length: 1.02, angle: 0.06 },
  { x: 0.17, y: 1.6, length: 1.08, angle: -0.04 },
  { x: 0.51, y: 1.46, length: 0.91, angle: -0.13 },
] as const

const layers = [
  { id: 'palm' as const, label: 'Palm housing', icon: 'deployed_code' },
  { id: 'tendons' as const, label: 'Tendon channels', icon: 'gesture' },
  { id: 'joints' as const, label: 'Articulated joints', icon: 'join_inner' },
]

function Segment({
  position,
  length,
  rotation = [0, 0, 0],
  color,
}: {
  position: Vector3
  length: number
  rotation?: Vector3
  color: string
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <capsuleGeometry args={[0.13, length, 8, 16]} />
      <meshStandardMaterial color={color} metalness={0.68} roughness={0.28} />
    </mesh>
  )
}

function MechanicalHand({
  position,
  rotation,
  scale,
  visibility,
  selectedLayer,
}: {
  position: Vector3
  rotation: Vector3
  scale: Vector3
  visibility: Record<LayerId, boolean>
  selectedLayer: LayerId
}) {
  const shell = selectedLayer === 'palm' ? '#d9ddd9' : '#aeb5b2'
  const joint = selectedLayer === 'joints' ? '#ff6a2a' : '#69706d'

  return (
    <group
      position={position}
      rotation={rotation.map(THREE.MathUtils.degToRad) as Vector3}
      scale={scale}
    >
      {visibility.palm ? (
        <>
          <mesh position={[0, 0.45, 0]} scale={[1, 1.08, 0.54]} castShadow receiveShadow>
            <sphereGeometry args={[0.78, 32, 24]} />
            <meshStandardMaterial color={shell} metalness={0.58} roughness={0.34} />
          </mesh>
          <mesh position={[0, -0.47, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.37, 0.78, 16]} />
            <meshStandardMaterial color="#7d8581" metalness={0.72} roughness={0.26} />
          </mesh>
          <mesh position={[0, -0.92, 0]} castShadow>
            <cylinderGeometry args={[0.37, 0.43, 0.18, 16]} />
            <meshStandardMaterial color="#ef672f" metalness={0.42} roughness={0.3} />
          </mesh>
        </>
      ) : null}

      {fingerLayout.map((finger, index) => (
        <group key={finger.x} position={[finger.x, finger.y, 0]} rotation={[0, 0, finger.angle]}>
          {visibility.joints ? (
            <mesh castShadow>
              <sphereGeometry args={[0.18, 16, 12]} />
              <meshStandardMaterial color={joint} metalness={0.75} roughness={0.22} />
            </mesh>
          ) : null}
          {visibility.palm ? (
            <>
              <Segment
                position={[0, finger.length * 0.34, 0]}
                length={finger.length * 0.48}
                rotation={[0, 0, index > 1 ? -0.02 : 0.02]}
                color={shell}
              />
              <Segment
                position={[index > 1 ? -0.03 : 0.03, finger.length * 0.86, 0]}
                length={finger.length * 0.38}
                rotation={[0, 0, index > 1 ? 0.1 : -0.1]}
                color={shell}
              />
            </>
          ) : null}
          {visibility.joints ? (
            <mesh position={[0, finger.length * 0.62, 0]} castShadow>
              <sphereGeometry args={[0.145, 16, 12]} />
              <meshStandardMaterial color={joint} metalness={0.75} roughness={0.22} />
            </mesh>
          ) : null}
        </group>
      ))}

      <group position={[-0.76, 0.4, 0]} rotation={[0, 0, 0.84]}>
        {visibility.joints ? (
          <mesh castShadow>
            <sphereGeometry args={[0.22, 16, 12]} />
            <meshStandardMaterial color="#ef672f" metalness={0.48} roughness={0.3} />
          </mesh>
        ) : null}
        {visibility.palm ? (
          <>
            <Segment position={[0, 0.35, 0]} length={0.48} color={shell} />
            <Segment position={[0, 0.78, 0]} length={0.3} rotation={[0, 0, -0.14]} color={shell} />
          </>
        ) : null}
      </group>

      {visibility.tendons
        ? [-0.45, -0.15, 0.15, 0.45].map((x) => (
            <mesh key={x} position={[x, 0.63, 0.43]} rotation={[0, 0, -x * 0.14]}>
              <capsuleGeometry args={[0.025, 1.3, 4, 8]} />
              <meshStandardMaterial
                color={selectedLayer === 'tendons' ? '#ff6a2a' : '#323735'}
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          ))
        : null}
    </group>
  )
}

function CameraController({ view, resetToken }: { view: ViewMode; resetToken: number }) {
  const { camera } = useThree()
  useEffect(() => {
    const positions: Record<ViewMode, Vector3> = {
      perspective: [4.6, 3.3, 6.4],
      front: [0, 1.4, 8],
      side: [8, 1.4, 0],
    }
    camera.position.set(...positions[view])
    camera.lookAt(0, 0.8, 0)
    camera.updateProjectionMatrix()
  }, [camera, view, resetToken])
  return null
}

function WorkspaceScene({
  position,
  rotation,
  scale,
  visibility,
  selectedLayer,
  view,
  resetToken,
  isDark,
}: {
  position: Vector3
  rotation: Vector3
  scale: Vector3
  visibility: Record<LayerId, boolean>
  selectedLayer: LayerId
  view: ViewMode
  resetToken: number
  isDark: boolean
}) {
  return (
    <Canvas shadows camera={{ position: [4.6, 3.3, 6.4], fov: 38 }}>
      <color attach="background" args={[isDark ? '#222321' : '#e8e7e2']} />
      <fog attach="fog" args={[isDark ? '#222321' : '#e8e7e2', 8, 18]} />
      <ambientLight intensity={isDark ? 1.2 : 1.7} />
      <directionalLight castShadow position={[4, 7, 5]} intensity={2.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#ff9b70" />
      <MechanicalHand
        position={position}
        rotation={rotation}
        scale={scale}
        visibility={visibility}
        selectedLayer={selectedLayer}
      />
      <Grid
        infiniteGrid
        fadeDistance={15}
        cellSize={0.5}
        sectionSize={2}
        cellColor={isDark ? '#41433f' : '#b7b6b0'}
        sectionColor={isDark ? '#565955' : '#8f8e89'}
        position={[0, -1.05, 0]}
      />
      <OrbitControls makeDefault enableDamping target={[0, 0.7, 0]} minDistance={3} maxDistance={12} />
      <CameraController view={view} resetToken={resetToken} />
    </Canvas>
  )
}

function VectorEditor({
  label,
  value,
  onChange,
  onReset,
  step,
}: {
  label: string
  value: Vector3
  onChange: (next: Vector3) => void
  onReset: () => void
  step: number
}) {
  return (
    <section className="border-b border-outline-variant/50 pb-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-technical-label text-[10px] font-bold uppercase tracking-[0.16em]">{label}</h3>
        <button type="button" onClick={onReset} title={`Reset ${label}`} className="text-outline hover:text-primary">
          <MaterialIcon name="restart_alt" className="text-base" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {(['X', 'Y', 'Z'] as const).map((axis, index) => (
          <label key={axis} className="flex items-center rounded-md bg-surface-container-high px-2 py-1.5">
            <span className={`mr-1 text-[9px] font-bold ${index === 0 ? 'text-[#ef672f]' : index === 1 ? 'text-primary' : 'text-secondary'}`}>
              {axis}
            </span>
            <input
              type="number"
              step={step}
              value={Number(value[index].toFixed(2))}
              onChange={(event) => {
                const next = [...value] as Vector3
                next[index as Axis] = Number(event.target.value)
                onChange(next)
              }}
              className="min-w-0 w-full bg-transparent text-right font-technical-label text-[10px] outline-none"
            />
          </label>
        ))}
      </div>
    </section>
  )
}

function ParameterSlider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between font-technical-label text-[10px]">
        <span className="text-on-surface-variant">{label}</span>
        <span className="font-bold text-on-surface">{value}{unit}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="workspace-slider w-full"
      />
    </label>
  )
}

export default function Workspace2() {
  const { isDark } = useTheme()
  const [position, setPosition] = useState<Vector3>([0, 0, 0])
  const [rotation, setRotation] = useState<Vector3>([0, 0, 0])
  const [scale, setScale] = useState<Vector3>([1, 1, 1])
  const [parameters, setParameters] = useState({
    wall: 5.4,
    flexibility: 75,
    articulation: 0,
    grip: 85,
    distribution: 65,
  })
  const [visibility, setVisibility] = useState<Record<LayerId, boolean>>({
    palm: true,
    tendons: true,
    joints: true,
  })
  const [selectedLayer, setSelectedLayer] = useState<LayerId>('palm')
  const [query, setQuery] = useState('')
  const [panels, setPanels] = useState({ layers: true, modifiers: false, textures: false })
  const [view, setView] = useState<ViewMode>('perspective')
  const [tool, setTool] = useState<Tool>('add')
  const [resetToken, setResetToken] = useState(0)
  const [printProgress, setPrintProgress] = useState<number | null>(null)

  const filteredLayers = useMemo(
    () => layers.filter((layer) => layer.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  useEffect(() => {
    if (printProgress === null || printProgress >= 100) return
    const timer = window.setInterval(
      () => setPrintProgress((current) => current === null ? null : Math.min(100, current + 10)),
      220,
    )
    return () => window.clearInterval(timer)
  }, [printProgress])

  const setParameter = (key: keyof typeof parameters, value: number) =>
    setParameters((current) => ({ ...current, [key]: value }))

  const resetTransforms = () => {
    setPosition([0, 0, 0])
    setRotation([0, 0, 0])
    setScale([1, 1, 1])
  }

  return (
    <div className="h-screen overflow-hidden bg-background text-on-background">
      <Header />
      <main className="workspace-shell pt-[73px]">
        <aside className="workspace-panel workspace-left">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-technical-label text-[9px] uppercase tracking-[0.18em] text-outline">Transform</p>
              <h2 className="font-headline-lg text-base font-bold">Position</h2>
            </div>
            <button type="button" onClick={resetTransforms} className="workspace-icon-button" title="Reset all transforms">
              <MaterialIcon name="refresh" className="text-lg" />
            </button>
          </div>
          <div className="space-y-4">
            <VectorEditor label="Location" value={position} onChange={setPosition} onReset={() => setPosition([0, 0, 0])} step={0.1} />
            <VectorEditor label="Rotation" value={rotation} onChange={setRotation} onReset={() => setRotation([0, 0, 0])} step={1} />
            <VectorEditor label="Scale" value={scale} onChange={setScale} onReset={() => setScale([1, 1, 1])} step={0.05} />
          </div>

          <section className="mt-4 rounded-xl border border-outline-variant/50 bg-surface-container-low p-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-technical-label text-[10px] font-bold uppercase tracking-[0.16em]">Parameters</h3>
              <span className="rounded-md bg-primary-container px-2 py-1 font-technical-label text-[9px] font-bold text-on-primary-fixed">
                MAX 6.7 kg
              </span>
            </div>
            <div className="space-y-4">
              <ParameterSlider label="Wall thickness" value={parameters.wall} min={1} max={10} unit=" mm" onChange={(value) => setParameter('wall', value)} />
              <ParameterSlider label="Flexibility" value={parameters.flexibility} min={0} max={100} unit="%" onChange={(value) => setParameter('flexibility', value)} />
              <ParameterSlider label="Rotation" value={parameters.articulation} min={-90} max={90} unit="°" onChange={(value) => setParameter('articulation', value)} />
              <ParameterSlider label="Grip force" value={parameters.grip} min={0} max={100} unit="%" onChange={(value) => setParameter('grip', value)} />
              <ParameterSlider label="Weight distribution" value={parameters.distribution} min={0} max={100} unit="%" onChange={(value) => setParameter('distribution', value)} />
              <div className="flex justify-between font-technical-label text-[9px] text-outline">
                <span>Palm {parameters.distribution}%</span>
                <span>Wrist {100 - parameters.distribution}%</span>
              </div>
            </div>
          </section>

          <button
            type="button"
            disabled={printProgress !== null && printProgress < 100}
            onClick={() => setPrintProgress(0)}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6828] py-3 font-button-text text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-[#ff7a43] active:scale-[0.98] disabled:cursor-wait"
          >
            <MaterialIcon name={printProgress !== null && printProgress < 100 ? 'progress_activity' : printProgress === 100 ? 'check_circle' : 'print'} className="text-lg" />
            {printProgress === null ? 'START PRINTING' : printProgress < 100 ? `PREPARING ${printProgress}%` : 'PRINT READY'}
          </button>
        </aside>

        <section className="workspace-viewport">
          <WorkspaceScene
            position={position}
            rotation={[rotation[0], rotation[1], rotation[2] + parameters.articulation]}
            scale={scale}
            visibility={visibility}
            selectedLayer={selectedLayer}
            view={view}
            resetToken={resetToken}
            isDark={isDark}
          />

          <div className="pointer-events-none absolute left-5 top-5 z-10">
            <h1 className="font-headline-lg text-xl font-bold tracking-tight">Model – ZM0634</h1>
            <p className="font-technical-label text-[9px] uppercase tracking-[0.15em] text-outline">Hand prosthesis / revision 04</p>
          </div>

          <div className="absolute right-5 top-5 z-10 flex rounded-xl border border-outline-variant/50 bg-surface/90 p-1 shadow-xl backdrop-blur">
            {([
              ['perspective', 'view_in_ar'],
              ['front', 'deployed_code'],
              ['side', 'side_navigation'],
            ] as const).map(([mode, icon]) => (
              <button
                key={mode}
                type="button"
                title={`${mode} view`}
                onClick={() => setView(mode)}
                className={`workspace-view-button ${view === mode ? 'workspace-view-active' : ''}`}
              >
                <MaterialIcon name={icon} className="text-lg" />
              </button>
            ))}
            <button type="button" title="Reset camera" onClick={() => setResetToken((token) => token + 1)} className="workspace-view-button">
              <MaterialIcon name="center_focus_strong" className="text-lg" />
            </button>
          </div>

          <div className="workspace-reference-card">
            <div className="flex items-center justify-between border-b border-black/10 px-3 py-2">
              <span className="font-technical-label text-[10px] font-bold text-[#282824]">← THUMB 1</span>
              <MaterialIcon name="edit" className="text-sm text-[#282824]" />
            </div>
            <div className="relative flex h-36 items-center justify-center">
              <div className="absolute left-4 top-3 h-24 border-l border-[#ef672f] text-[8px] text-[#282824]"><span className="-ml-3">68</span></div>
              <div className="reference-hand text-[#6a706d]">
                <MaterialIcon name="back_hand" className="text-7xl" />
              </div>
              <span className="absolute left-12 top-2 font-technical-label text-[8px] text-[#3d846c]">↔ 24 mm</span>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-outline-variant/50 bg-surface/90 p-1.5 shadow-xl backdrop-blur">
            {([
              ['add', 'add', 'Add component'],
              ['frame', 'select_all', 'Frame selection'],
              ['cut', 'content_cut', 'Cut plane'],
            ] as const).map(([id, icon, label]) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => setTool(id)}
                className={`workspace-tool-button ${tool === id ? 'workspace-tool-active' : ''}`}
              >
                <MaterialIcon name={icon} className="text-lg" />
              </button>
            ))}
          </div>

          <div className="absolute bottom-5 right-5 z-10 h-14 w-14 rounded-full border border-outline-variant/60 bg-surface/80 shadow-xl backdrop-blur">
            <span className="absolute left-1/2 top-1 text-[9px] font-bold text-[#68a7ff]">Z</span>
            <span className="absolute bottom-1 left-2 text-[9px] font-bold text-[#ff6247]">X</span>
            <span className="absolute bottom-1 right-2 text-[9px] font-bold text-primary">Y</span>
            <div className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 rotate-45 bg-outline" />
            <div className="absolute left-1/2 top-1/2 h-8 w-px -translate-y-1/2 bg-outline" />
          </div>
        </section>

        <aside className="workspace-panel workspace-right">
          <section className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-3">
            <button type="button" onClick={() => setPanels((value) => ({ ...value, layers: !value.layers }))} className="flex w-full items-center justify-between">
              <h2 className="font-technical-label text-[10px] font-bold uppercase tracking-[0.16em]">Layers</h2>
              <MaterialIcon name={panels.layers ? 'expand_less' : 'expand_more'} className="text-lg text-outline" />
            </button>
            {panels.layers ? (
              <div className="mt-3">
                <label className="flex items-center gap-2 rounded-lg bg-surface-container-high px-3 py-2">
                  <MaterialIcon name="search" className="text-base text-outline" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search layers" className="min-w-0 flex-1 bg-transparent font-technical-label text-[10px] outline-none placeholder:text-outline" />
                </label>
                <div className="mt-3 space-y-1">
                  {filteredLayers.map((layer) => (
                    <div key={layer.id} className={`flex items-center rounded-lg ${selectedLayer === layer.id ? 'bg-primary-container/15' : 'hover:bg-surface-container-high'}`}>
                      <button type="button" onClick={() => setSelectedLayer(layer.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left">
                        <MaterialIcon name={layer.icon} className={`text-sm ${selectedLayer === layer.id ? 'text-primary' : 'text-outline'}`} />
                        <span className="truncate font-technical-label text-[9px]">{layer.label}</span>
                      </button>
                      <button type="button" title={`Toggle ${layer.label}`} onClick={() => setVisibility((current) => ({ ...current, [layer.id]: !current[layer.id] }))} className="px-2 text-outline hover:text-on-surface">
                        <MaterialIcon name={visibility[layer.id] ? 'visibility' : 'visibility_off'} className="text-base" />
                      </button>
                    </div>
                  ))}
                  {filteredLayers.length === 0 ? <p className="py-3 text-center font-technical-label text-[9px] text-outline">No matching layers</p> : null}
                </div>
              </div>
            ) : null}
          </section>

          {(['modifiers', 'textures'] as const).map((panel) => (
            <section key={panel} className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-3">
              <button type="button" onClick={() => setPanels((value) => ({ ...value, [panel]: !value[panel] }))} className="flex w-full items-center justify-between">
                <h2 className="font-technical-label text-[10px] font-bold uppercase tracking-[0.16em]">{panel}</h2>
                <MaterialIcon name={panels[panel] ? 'expand_less' : 'chevron_right'} className="text-lg text-outline" />
              </button>
              {panels[panel] ? (
                <div className="mt-3 rounded-lg bg-surface-container-high p-3 font-technical-label text-[9px] leading-relaxed text-on-surface-variant">
                  {panel === 'modifiers'
                    ? `Adaptive grip · ${parameters.grip}% force · ${parameters.flexibility}% flex`
                    : 'Brushed polymer shell · anodized joint pins'}
                </div>
              ) : null}
            </section>
          ))}

          <div className="mt-auto rounded-xl border border-outline-variant/50 bg-surface-container-low p-3">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${printProgress === 100 ? 'bg-primary' : 'bg-[#ff6828]'}`} />
              <div>
                <p className="font-technical-label text-[9px] font-bold">{printProgress === 100 ? 'MODEL VALIDATED' : 'ASSEMBLY ONLINE'}</p>
                <p className="font-technical-label text-[8px] text-outline">ZM0634 · 18 components</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
