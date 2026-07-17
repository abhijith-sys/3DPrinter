import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'
import Viewport3D, { type TransformMode } from '../components/Viewport3D'

const materials = [
  { id: 'abs', label: 'Black ABS', sub: 'AA 0.8', color: '#1a1a1a' },
  { id: 'pla', label: 'White PLA', sub: 'AA 0.25', color: '#e8e8e8' },
] as const

const printers = ['Bambu Lab P1S', 'Prusa MK4', 'Ultimaker S5', 'Formlabs Form 3+'] as const

const presets = [
  { id: 'balanced', icon: 'sync_alt', label: 'Balanced', infill: 20 },
  { id: 'visual', icon: 'image', label: 'Visual', infill: 12 },
  { id: 'engineering', icon: 'precision_manufacturing', label: 'Engineering', infill: 40 },
  { id: 'draft', icon: 'speed', label: 'Draft', infill: 8 },
] as const

const transformTools: { id: TransformMode; icon: string; label: string }[] = [
  { id: 'translate', icon: 'open_with', label: 'Move' },
  { id: 'scale', icon: 'aspect_ratio', label: 'Scale' },
  { id: 'rotate', icon: 'rotate_right', label: 'Rotate' },
  { id: 'layers', icon: 'layers', label: 'Layers' },
]

type SideTab = 'materials' | 'settings' | 'support' | 'infill' | 'simulation'

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

function parseAxis(value: string) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

export default function Workshop() {
  const fileName = sessionStorage.getItem('partify-file') || 'PART_082_V4.STL'

  const [materialId, setMaterialId] = useState<(typeof materials)[number]['id']>('abs')
  const [materialEnabled, setMaterialEnabled] = useState(true)
  const [preset, setPreset] = useState<(typeof presets)[number]['id']>('balanced')
  const [settingsMode, setSettingsMode] = useState<'recommended' | 'custom'>('recommended')
  const [infill, setInfill] = useState(20)
  const [support, setSupport] = useState(true)
  const [adhesion, setAdhesion] = useState(true)
  const [autoSlice, setAutoSlice] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<1 | 5 | 100>(100)
  const [simProgress, setSimProgress] = useState(0.48)
  const [transformMode, setTransformMode] = useState<TransformMode>('translate')
  const [sideTab, setSideTab] = useState<SideTab>('materials')
  const [printer, setPrinter] = useState<(typeof printers)[number]>('Bambu Lab P1S')
  const [printerOpen, setPrinterOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const [objectsOpen, setObjectsOpen] = useState(true)
  const [objectPresent, setObjectPresent] = useState(true)
  const [slicing, setSlicing] = useState(false)
  const [sliced, setSliced] = useState(false)
  const [sliceMessage, setSliceMessage] = useState<string | null>(null)
  const [layerProgress, setLayerProgress] = useState(1)
  const [panelsOpen, setPanelsOpen] = useState({ materials: true, settings: true, slice: true })

  const [position, setPosition] = useState<[number, number, number]>([-0.0144, 1.0386, 0])
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1])
  const [posInputs, setPosInputs] = useState({
    x: '-0.0144',
    y: '1.0386',
    z: '0',
  })

  const materialColor = materialEnabled
    ? (materials.find((m) => m.id === materialId)?.color ?? '#1a1a1a')
    : '#555555'

  const totalSeconds = 22 * 3600 + 54 * 60 + 25
  const currentSeconds = Math.floor(simProgress * totalSeconds)

  const estTime = useMemo(() => {
    const base = 4 * 60 + 12
    const infillFactor = 1 + (infill - 20) * 0.015
    const supportFactor = support ? 1.18 : 1
    const minutes = Math.max(45, Math.round(base * infillFactor * supportFactor))
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}H ${String(m).padStart(2, '0')}M`
  }, [infill, support])

  const applyPreset = (id: (typeof presets)[number]['id']) => {
    setPreset(id)
    const p = presets.find((x) => x.id === id)
    if (p) setInfill(p.infill)
  }

  const commitAxis = (axis: 'x' | 'y' | 'z', raw: string) => {
    if (locked) return
    setPosInputs((prev) => ({ ...prev, [axis]: raw }))
    const n = parseAxis(raw)
    setPosition((prev) => {
      const next: [number, number, number] = [...prev]
      const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
      next[idx] = n
      return next
    })
  }

  const onPositionChange = useCallback(
    (pos: [number, number, number]) => {
      if (locked) return
      setPosition(pos)
      setPosInputs({
        x: pos[0].toFixed(4),
        y: pos[1].toFixed(4),
        z: pos[2].toFixed(4),
      })
    },
    [locked],
  )

  const runSlice = () => {
    if (!objectPresent || slicing) return
    setSlicing(true)
    setSliced(false)
    setSliceMessage(autoSlice ? 'AI Auto-Slice running…' : 'Manual slice in progress…')
    setPlaying(false)
    setSimProgress(0)

    window.setTimeout(() => {
      setSlicing(false)
      setSliced(true)
      setSliceMessage(`Slice complete · ${estTime} · ${infill}% infill`)
      setSideTab('simulation')
      setSimProgress(0)
    }, 1600)
  }

  // Simulation playback
  useEffect(() => {
    if (!playing || !sliced) return
    const tickMs = 50
    const rate = (speed / 100) * 0.004
    const id = window.setInterval(() => {
      setSimProgress((p) => {
        const next = p + rate
        if (next >= 1) {
          setPlaying(false)
          return 1
        }
        return next
      })
    }, tickMs)
    return () => window.clearInterval(id)
  }, [playing, speed, sliced])

  // Transform mode side effects
  useEffect(() => {
    if (transformMode === 'layers') setLayerProgress(0.55)
    else setLayerProgress(1)
  }, [transformMode])

  // Keyboard nudges when translate mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked || !objectPresent) return
      const step = e.shiftKey ? 0.5 : 0.05
      if (transformMode === 'translate') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          onPositionChange([position[0] - step, position[1], position[2]])
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          onPositionChange([position[0] + step, position[1], position[2]])
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          onPositionChange([position[0], position[1], position[2] - step])
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          onPositionChange([position[0], position[1], position[2] + step])
        }
      }
      if (transformMode === 'rotate' && (e.key === 'q' || e.key === 'e')) {
        e.preventDefault()
        setRotation((r) => [r[0], r[1] + (e.key === 'e' ? 0.1 : -0.1), r[2]])
      }
      if (transformMode === 'scale' && (e.key === '+' || e.key === '=' || e.key === '-')) {
        e.preventDefault()
        const delta = e.key === '-' ? -0.05 : 0.05
        setScale((s) =>
          s.map((v) => Math.max(0.3, Math.min(3, v + delta))) as [number, number, number],
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked, objectPresent, transformMode, position, onPositionChange])

  const sideItems: { id: SideTab; icon: string; label: string }[] = [
    { id: 'materials', icon: 'layers', label: 'Materials' },
    { id: 'settings', icon: 'settings', label: 'Print Settings' },
    { id: 'support', icon: 'architecture', label: 'Support' },
    { id: 'infill', icon: 'grid_view', label: 'Infill' },
    { id: 'simulation', icon: 'play_circle', label: 'Simulation' },
  ]

  const seekSimulation = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    setSimProgress(ratio)
  }

  return (
    <div className="bg-inverse-surface text-on-background font-body-md overflow-hidden h-screen flex flex-col dark">
      <Header variant="dark" showAvatar />
      <main className="flex-grow flex relative overflow-hidden pt-[73px]">
        {/* Left sidebar */}
        <aside className="h-[calc(100vh-73px)] w-80 fixed left-0 top-[73px] hidden lg:flex flex-col bg-inverse-surface border-r border-on-surface-variant z-40 p-4 gap-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-on-surface-variant/20 rounded-lg flex items-center justify-center">
              <MaterialIcon name="layers" className="text-primary" filled />
            </div>
            <div className="min-w-0">
              <h3 className="font-technical-label text-technical-label font-bold text-surface-bright truncate">
                {objectPresent ? fileName : 'No object'}
              </h3>
              <p className="font-technical-label text-[10px] text-outline">
                EST. TIME: {sliced || slicing ? estTime : '—'}
                {slicing ? ' · SLICING…' : sliced ? ' · READY' : ''}
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {sideItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSideTab(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  sideTab === item.id
                    ? 'bg-primary-container text-on-primary-container font-bold translate-x-1'
                    : 'text-outline hover:bg-on-surface-variant/30'
                }`}
              >
                <MaterialIcon name={item.icon} />
                <span className="font-technical-label text-technical-label">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-2">
            {sliceMessage && (
              <p className="font-technical-label text-[10px] text-primary-container text-center px-2">
                {sliceMessage}
              </p>
            )}
            <button
              type="button"
              onClick={runSlice}
              disabled={!objectPresent || slicing}
              className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl font-button-text hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <MaterialIcon name={slicing ? 'hourglass_top' : 'auto_fix'} />
              {slicing ? 'SLICING…' : 'SLICE MODEL'}
            </button>
          </div>
        </aside>

        <div className="flex-grow lg:ml-80 relative bg-[#0a0a0a] overflow-hidden">
          {objectPresent ? (
            <Viewport3D
              materialColor={materialColor}
              position={position}
              rotation={rotation}
              scale={scale}
              transformMode={transformMode}
              showSupports={support}
              showAdhesion={adhesion}
              layerProgress={layerProgress}
              simulating={playing || (sliced && sideTab === 'simulation')}
              simulationProgress={simProgress}
              locked={locked}
              onPositionChange={onPositionChange}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-outline">
              <MaterialIcon name="deployed_code" className="text-5xl" />
              <p className="font-technical-label text-technical-label">No objects on the build plate</p>
              <button
                type="button"
                onClick={() => {
                  setObjectPresent(true)
                  setSliced(false)
                  setSliceMessage(null)
                }}
                className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-button-text text-button-text font-bold"
              >
                ADD SAMPLE PART
              </button>
            </div>
          )}

          {/* Printer + gizmo */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
            <div className="viewport-glass rounded-xl border border-white/10 w-64 relative">
              <button
                type="button"
                className="w-full p-3 text-left"
                onClick={() => setPrinterOpen((o) => !o)}
              >
                <label className="font-technical-label text-[10px] text-outline uppercase block mb-1 pointer-events-none">
                  Printer
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="print" className="text-sm text-primary" />
                    <span className="font-technical-label text-technical-label text-white">
                      {printer}
                    </span>
                  </div>
                  <MaterialIcon
                    name={printerOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                    className="text-outline"
                  />
                </div>
              </button>
              {printerOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 viewport-glass rounded-xl border border-white/10 overflow-hidden z-20">
                  {printers.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPrinter(p)
                        setPrinterOpen(false)
                      }}
                      className={`w-full px-3 py-2.5 text-left font-technical-label text-technical-label hover:bg-white/10 ${
                        printer === p ? 'text-primary-container' : 'text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="viewport-glass p-2 rounded-xl border border-white/10 flex flex-col gap-2 w-fit">
              {transformTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  title={tool.label}
                  onClick={() => setTransformMode(tool.id)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                    transformMode === tool.id
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <MaterialIcon name={tool.icon} />
                </button>
              ))}
            </div>

            {transformMode === 'layers' && (
              <div className="viewport-glass p-3 rounded-xl border border-white/10 w-64">
                <div className="flex justify-between mb-2">
                  <span className="font-technical-label text-[10px] text-outline uppercase">
                    Layer height
                  </span>
                  <span className="font-technical-label text-[10px] text-primary-container font-bold">
                    {Math.round(layerProgress * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.01}
                  value={layerProgress}
                  onChange={(e) => setLayerProgress(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer custom-slider"
                />
              </div>
            )}

            {transformMode === 'scale' && (
              <div className="viewport-glass p-3 rounded-xl border border-white/10 w-64">
                <div className="flex justify-between mb-2">
                  <span className="font-technical-label text-[10px] text-outline uppercase">Scale</span>
                  <span className="font-technical-label text-[10px] text-primary-container font-bold">
                    {scale[0].toFixed(2)}×
                  </span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={3}
                  step={0.01}
                  value={scale[0]}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setScale([v, v, v])
                  }}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer custom-slider"
                />
              </div>
            )}

            {transformMode === 'rotate' && (
              <div className="viewport-glass p-3 rounded-xl border border-white/10 w-64 space-y-2">
                <span className="font-technical-label text-[10px] text-outline uppercase">
                  Rotate Y
                </span>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  value={rotation[1]}
                  onChange={(e) =>
                    setRotation([rotation[0], Number(e.target.value), rotation[2]])
                  }
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer custom-slider"
                />
              </div>
            )}
          </div>

          {/* Position panel */}
          <div className="absolute bottom-24 left-6 z-10 viewport-glass p-4 rounded-xl border border-white/10 w-64">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-technical-label text-technical-label font-bold text-white uppercase tracking-wider">
                Position
              </h4>
              <button
                type="button"
                onClick={() => setLocked((l) => !l)}
                className={locked ? 'text-primary-container' : 'text-outline hover:text-white'}
                title={locked ? 'Unlock' : 'Lock'}
              >
                <MaterialIcon name={locked ? 'lock' : 'lock_open'} className="text-sm" />
              </button>
            </div>
            <div className="space-y-3">
              {(
                [
                  ['x', 'text-error'],
                  ['y', 'text-primary'],
                  ['z', 'text-secondary'],
                ] as const
              ).map(([axis, color]) => (
                <div key={axis} className="flex items-center justify-between gap-4">
                  <span className={`font-technical-label text-technical-label ${color} w-4 uppercase`}>
                    {axis}
                  </span>
                  <input
                    className="bg-black/40 border-none rounded p-1 text-right font-technical-label text-technical-label text-white w-full outline-none disabled:opacity-40"
                    type="text"
                    disabled={locked}
                    value={posInputs[axis]}
                    onChange={(e) => commitAxis(axis, e.target.value)}
                  />
                  <span className="font-technical-label text-[10px] text-outline">mm</span>
                </div>
              ))}
            </div>
          </div>

          {/* Objects list */}
          <div className="absolute bottom-48 left-6 z-10 viewport-glass p-3 rounded-xl border border-white/10 w-64">
            <button
              type="button"
              className="flex items-center justify-between mb-2 w-full"
              onClick={() => setObjectsOpen((o) => !o)}
            >
              <span className="font-technical-label text-[10px] text-outline uppercase">Objects</span>
              <MaterialIcon
                name={objectsOpen ? 'expand_less' : 'expand_more'}
                className="text-outline text-sm"
              />
            </button>
            {objectsOpen &&
              (objectPresent ? (
                <div className="flex items-center justify-between p-2 bg-primary-container/20 border border-primary-container/30 rounded-lg">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MaterialIcon name="deployed_code" className="text-primary-container text-sm" />
                    <span className="font-technical-label text-[10px] text-white truncate">
                      {fileName}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-outline hover:text-error transition-colors"
                    onClick={() => {
                      setObjectPresent(false)
                      setSliced(false)
                      setPlaying(false)
                      setSliceMessage(null)
                    }}
                  >
                    <MaterialIcon name="delete" className="text-sm" />
                  </button>
                </div>
              ) : (
                <p className="font-technical-label text-[10px] text-outline px-1">Empty plate</p>
              ))}
          </div>

          {/* Right panels — driven by side tab */}
          <div className="absolute top-6 right-6 bottom-28 w-80 z-10 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
            {(sideTab === 'materials' || sideTab === 'settings') && (
              <section className="viewport-glass p-4 rounded-xl border border-white/10">
                <button
                  type="button"
                  className="flex items-center justify-between mb-4 w-full"
                  onClick={() =>
                    setPanelsOpen((p) => ({ ...p, materials: !p.materials }))
                  }
                >
                  <h4 className="font-technical-label text-technical-label font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MaterialIcon name="palette" className="text-primary text-sm" /> Materials
                  </h4>
                  <MaterialIcon
                    name={panelsOpen.materials ? 'expand_less' : 'expand_more'}
                    className="text-outline"
                  />
                </button>
                {panelsOpen.materials && (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {materials.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setMaterialId(m.id)
                            setMaterialEnabled(true)
                          }}
                          className={`p-2 rounded-lg font-technical-label text-[10px] text-center ${
                            materialId === m.id && materialEnabled
                              ? 'bg-primary-container text-on-primary-container font-bold'
                              : 'bg-white/5 text-outline hover:bg-white/10'
                          }`}
                        >
                          {m.label} <br />
                          <span className="opacity-60 font-normal">{m.sub}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-technical-label text-[10px] text-outline uppercase">
                        Enable
                      </label>
                      <button
                        type="button"
                        onClick={() => setMaterialEnabled((v) => !v)}
                        className={`w-8 h-4 rounded-full relative ${
                          materialEnabled ? 'bg-primary-container' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
                            materialEnabled
                              ? 'right-0.5 bg-on-primary-container'
                              : 'left-0.5 bg-white/60'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg">
                        <span className="font-technical-label text-[10px] text-outline">Material</span>
                        <span className="font-technical-label text-technical-label text-white">
                          {materials.find((m) => m.id === materialId)?.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg">
                        <span className="font-technical-label text-[10px] text-outline">Print core</span>
                        <span className="font-technical-label text-technical-label text-white">
                          {materials.find((m) => m.id === materialId)?.sub}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}

            {(sideTab === 'settings' || sideTab === 'infill' || sideTab === 'support') && (
              <section className="viewport-glass p-4 rounded-xl border border-white/10">
                <h4 className="font-technical-label text-technical-label font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                  <MaterialIcon name="tune" className="text-primary text-sm" /> Settings
                </h4>
                <div className="flex p-1 bg-black/40 rounded-xl mb-4">
                  {(['recommended', 'custom'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSettingsMode(mode)}
                      className={`flex-1 py-1 rounded-lg font-technical-label text-technical-label capitalize ${
                        settingsMode === mode
                          ? 'bg-primary-container text-on-primary-container font-bold'
                          : 'text-outline'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {presets.map((p) => (
                    <div key={p.id} className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => applyPreset(p.id)}
                        className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl ${
                          preset === p.id
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-white/5 text-outline hover:bg-white/10'
                        }`}
                      >
                        <MaterialIcon name={p.icon} />
                      </button>
                      <span
                        className={`font-technical-label text-[9px] ${
                          preset === p.id ? 'text-primary font-bold' : 'text-outline'
                        }`}
                      >
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {(sideTab === 'infill' || sideTab === 'settings') && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MaterialIcon name="grid_on" className="text-outline text-sm" />
                          <label className="font-technical-label text-[10px] text-outline uppercase">
                            Infill
                          </label>
                        </div>
                        <span className="px-2 py-0.5 bg-primary-container/20 text-primary-container rounded font-technical-label text-[10px] font-bold">
                          {infill}%
                        </span>
                      </div>
                      <input
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer custom-slider"
                        type="range"
                        min={0}
                        max={100}
                        value={infill}
                        disabled={settingsMode === 'recommended'}
                        onChange={(e) => {
                          setInfill(Number(e.target.value))
                          setPreset('balanced')
                        }}
                      />
                      {settingsMode === 'recommended' && (
                        <p className="mt-2 font-technical-label text-[9px] text-outline">
                          Switch to Custom to edit infill freely
                        </p>
                      )}
                    </div>
                  )}
                  {(sideTab === 'support' || sideTab === 'settings') &&
                    (
                      [
                        ['Support', support, setSupport, 'bubble_chart'],
                        ['Adhesion', adhesion, setAdhesion, 'layers'],
                      ] as const
                    ).map(([label, value, setter, icon]) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MaterialIcon name={icon} className="text-outline text-sm" />
                          <label className="font-technical-label text-[10px] text-outline uppercase">
                            {label}
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setter(!value)}
                          className={`w-8 h-4 rounded-full relative ${
                            value ? 'bg-primary-container' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
                              value
                                ? 'right-0.5 bg-on-primary-container'
                                : 'left-0.5 bg-white/60'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {(sideTab === 'settings' || sideTab === 'materials' || sideTab === 'simulation') && (
              <section className="viewport-glass p-4 rounded-xl border border-white/10 mt-auto">
                <h4 className="font-technical-label text-[10px] text-outline uppercase mb-3">
                  Slicing Method
                </h4>
                <div className="space-y-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setAutoSlice(true)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                      autoSlice
                        ? 'bg-primary-container/10 border border-primary-container/30'
                        : 'bg-white/5'
                    }`}
                  >
                    <MaterialIcon
                      name={autoSlice ? 'check_circle' : 'radio_button_unchecked'}
                      className={autoSlice ? 'text-primary-container' : 'text-outline'}
                      filled={autoSlice}
                    />
                    <span
                      className={`font-technical-label text-technical-label ${
                        autoSlice ? 'text-white' : 'text-outline'
                      }`}
                    >
                      AI Auto-Slice
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoSlice(false)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                      !autoSlice
                        ? 'bg-primary-container/10 border border-primary-container/30'
                        : 'bg-white/5'
                    }`}
                  >
                    <MaterialIcon
                      name={!autoSlice ? 'check_circle' : 'radio_button_unchecked'}
                      className={!autoSlice ? 'text-primary-container' : 'text-outline'}
                      filled={!autoSlice}
                    />
                    <span
                      className={`font-technical-label text-technical-label ${
                        !autoSlice ? 'text-white' : 'text-outline'
                      }`}
                    >
                      Manual slicing
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={runSlice}
                  disabled={!objectPresent || slicing}
                  className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-xl font-button-text hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-container/10 disabled:opacity-40"
                >
                  {slicing ? 'SLICING…' : 'SLICE'}
                </button>
              </section>
            )}

            {sideTab === 'simulation' && (
              <section className="viewport-glass p-4 rounded-xl border border-white/10">
                <h4 className="font-technical-label text-technical-label font-bold text-white uppercase mb-3">
                  Simulation
                </h4>
                {!sliced ? (
                  <p className="font-technical-label text-[11px] text-outline">
                    Slice the model first to unlock print simulation playback.
                  </p>
                ) : (
                  <p className="font-technical-label text-[11px] text-primary-container">
                    Ready — use the timeline below to scrub or play at 1x / 5x / 100x.
                  </p>
                )}
              </section>
            )}
          </div>

          {/* Timeline */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] lg:w-[calc(100%-360px)] z-20">
            <div className="viewport-glass p-4 rounded-2xl border border-white/10 flex items-center gap-6">
              <button
                type="button"
                disabled={!sliced}
                onClick={() => {
                  if (simProgress >= 1) setSimProgress(0)
                  setPlaying((p) => !p)
                  setSideTab('simulation')
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30"
              >
                <MaterialIcon name={playing ? 'pause' : 'play_arrow'} filled />
              </button>
              <div className="flex-grow">
                <div className="flex justify-between mb-2">
                  <span className="font-technical-label text-[10px] text-white">
                    {formatTime(currentSeconds)}
                  </span>
                  <span className="font-technical-label text-[10px] text-outline">
                    {formatTime(totalSeconds)}
                  </span>
                </div>
                <div
                  className={`relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden ${
                    sliced ? 'cursor-pointer' : 'opacity-40'
                  }`}
                  onClick={(e) => {
                    if (!sliced) return
                    seekSimulation(e.clientX, e.currentTarget)
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-primary-container transition-[width] duration-75"
                    style={{ width: `${simProgress * 100}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg -translate-x-1/2"
                    style={{ left: `${simProgress * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-1">
                {([1, 5, 100] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded font-technical-label text-[10px] ${
                      speed === s
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
