import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'

const steps = [
  { label: 'Upload 3D files', icon: 'upload_file' },
  { label: 'Quotation', icon: 'request_quote' },
  { label: 'Shipping & Payment', icon: 'local_shipping' },
  { label: 'Order Confirmation', icon: 'task_alt' },
] as const

const colors = ['#d4ff00', '#1c1b1b', '#8b93e8', '#ef7f6d'] as const

export default function Configure() {
  const navigate = useNavigate()
  const uploadRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState(
    () => sessionStorage.getItem('partify-file') || 'PART_UPLOAD.STL',
  )
  const [technology, setTechnology] = useState('sls')
  const [material, setMaterial] = useState('nylon')
  const [finish, setFinish] = useState('color-dyeing')
  const [inspection, setInspection] = useState('standard')
  const [quantity, setQuantity] = useState(1)
  const [color, setColor] = useState<(typeof colors)[number]>('#8b93e8')
  const [markDefault, setMarkDefault] = useState(false)
  const [xRotation, setXRotation] = useState(67)
  const [yRotation, setYRotation] = useState(80)

  const saveAndContinue = () => {
    sessionStorage.setItem(
      'partify-config',
      JSON.stringify({
        technology,
        material,
        finish,
        inspection,
        qty: quantity,
        color,
        markDefault,
        fileName,
      }),
    )
    navigate('/quote/review')
  }

  return (
    <div className="min-h-screen bg-page text-on-surface font-body-md flex flex-col">
      <Header showAvatar />

      <main className="flex-1 pt-[65px]">
        <nav
          aria-label="Quote progress"
          className="grid grid-cols-2 lg:grid-cols-4 border-b border-hairline bg-page"
        >
          {steps.map((step, index) => {
            const active = index === 0
            return (
              <div
                key={step.label}
                className={`min-h-[86px] px-5 md:px-8 py-4 flex items-center gap-4 border-r border-hairline last:border-r-0 ${
                  active ? 'bg-surface-container-lowest' : 'bg-page'
                }`}
              >
                <span
                  className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
                    active
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-on-surface text-page'
                  }`}
                >
                  <MaterialIcon name={step.icon} className="text-[18px]" />
                </span>
                <span>
                  <span className="block text-[11px] text-muted">Step {index + 1}</span>
                  <span className="block font-technical-label text-xs sm:text-sm uppercase font-semibold mt-0.5">
                    {step.label}
                  </span>
                </span>
              </div>
            )
          })}
        </nav>

        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 md:pt-12 pb-16">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="font-technical-label text-[23px] md:text-[28px] uppercase font-bold tracking-tight">
                Editing your model
              </h1>
              <p className="text-xs text-muted mt-2">
                PO number: 634534
                <button
                  type="button"
                  className="ml-3 px-2 py-0.5 rounded-full bg-on-surface text-page uppercase text-[9px]"
                >
                  Edit
                </button>
              </p>
            </div>
            <input
              ref={uploadRef}
              type="file"
              className="hidden"
              accept=".stl,.step,.stp,.obj,.3mf"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setFileName(file.name)
                sessionStorage.setItem('partify-file', file.name)
              }}
            />
            <button
              type="button"
              onClick={() => uploadRef.current?.click()}
              className="rounded-full border border-hairline px-5 py-2 text-[11px] uppercase font-semibold hover:border-primary transition-colors"
            >
              Upload more
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1.06fr)] gap-8 lg:gap-12">
            <section className="rounded-[1.5rem] bg-surface-container-lowest border border-hairline min-h-[470px] p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs relative z-10">
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <MaterialIcon name="rotate_90_degrees_ccw" className="text-[17px]" />
                  Y axis: {yRotation}%
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setXRotation(67)
                    setYRotation(80)
                  }}
                  className="inline-flex items-center gap-3 hover:text-primary transition-colors"
                >
                  Reset <MaterialIcon name="restart_alt" className="text-[18px]" />
                </button>
              </div>

              <div className="absolute inset-12 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 320 280"
                  className="w-[74%] max-w-[330px] drop-shadow-[0_24px_15px_rgba(30,30,60,0.24)] transition-transform duration-300"
                  style={{
                    transform: `perspective(650px) rotateX(${(xRotation - 50) * 0.32}deg) rotateY(${(yRotation - 50) * 0.35}deg) rotateZ(-18deg)`,
                  }}
                  aria-label="Interactive 3D part preview"
                  role="img"
                >
                  <defs>
                    <linearGradient id="part-shade" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={color} />
                      <stop offset="1" stopColor="#555db4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M72 105C41 87 19 104 25 130c5 22 30 25 47 16l31 25c-10 26 3 51 28 54 23 3 38-13 36-37l35-22c19 14 46 8 55-13 8-20-4-40-24-47l2-40c20-13 22-40 4-55-20-17-48-4-50 21l-39 20c-17-18-45-16-59 4-12 17-8 39 7 52l-10 22-16-5z"
                    fill="url(#part-shade)"
                    stroke="rgba(255,255,255,.34)"
                    strokeWidth="3"
                  />
                  <circle cx="149" cy="130" r="27" fill="rgb(var(--c-surface-container-lowest))" />
                  <circle cx="149" cy="130" r="31" fill="none" stroke="#5961bc" strokeWidth="7" />
                  <path
                    d="M29 134c9 18 31 18 47 9l31 27c-6 16-3 32 8 43"
                    fill="none"
                    stroke="#52599f"
                    strokeWidth="10"
                    strokeLinecap="round"
                    opacity=".7"
                  />
                </svg>
              </div>

              <input
                aria-label="Y axis rotation"
                type="range"
                min="0"
                max="100"
                value={yRotation}
                onChange={(event) => setYRotation(Number(event.target.value))}
                className="absolute left-4 top-20 bottom-14 h-[calc(100%-8.5rem)] w-1 appearance-none bg-hairline rounded-full [writing-mode:vertical-lr] [direction:rtl] accent-primary"
              />
              <input
                aria-label="X axis rotation"
                type="range"
                min="0"
                max="100"
                value={xRotation}
                onChange={(event) => setXRotation(Number(event.target.value))}
                className="absolute left-16 right-16 bottom-8 w-[calc(100%-8rem)] accent-primary"
              />
              <span className="absolute right-5 bottom-5 text-xs text-on-surface-variant">
                X axis: {xRotation}%
              </span>
              <span className="absolute left-5 bottom-5 max-w-[45%] truncate text-[10px] text-muted">
                {fileName}
              </span>
            </section>

            <section className="py-1">
              <h2 className="font-technical-label text-lg uppercase font-bold mb-4">
                General information
              </h2>
              <div className="h-px bg-hairline mb-4" />
              <div className="grid grid-cols-[1fr_170px] gap-3 mb-8">
                <label className="sr-only" htmlFor="specification-type">
                  Specification type
                </label>
                <select
                  id="specification-type"
                  className="w-full bg-surface-container-low border border-hairline rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
                  defaultValue="specifications"
                >
                  <option value="specifications">Specifications</option>
                  <option value="custom">Custom requirements</option>
                </select>
                <div className="flex items-center bg-surface-container-low border border-hairline rounded-lg overflow-hidden">
                  <span className="px-3 text-xs text-muted">Quantity</span>
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="ml-auto w-8 h-full hover:bg-surface-container-high"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="w-8 h-full hover:bg-surface-container-high"
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <h2 className="font-technical-label text-lg uppercase font-bold mb-4">Specifications</h2>
              <div className="h-px bg-hairline mb-4" />
              <div className="space-y-3 text-sm">
                <label className="grid grid-cols-[95px_1fr] items-center gap-3">
                  <span className="text-muted">Technology:</span>
                  <select
                    value={technology}
                    onChange={(event) => setTechnology(event.target.value)}
                    className="bg-surface-container-low border border-hairline rounded-lg px-4 py-3 outline-none focus:border-primary"
                  >
                    <option value="sls">Selective Laser Sintering (SLS)</option>
                    <option value="mjf">Multi Jet Fusion (MJF)</option>
                    <option value="fdm">Fused Deposition Modeling (FDM)</option>
                  </select>
                </label>

                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="grid grid-cols-[95px_1fr] items-center gap-3">
                    <span className="text-muted">Material:</span>
                    <select
                      value={material}
                      onChange={(event) => setMaterial(event.target.value)}
                      className="min-w-0 bg-surface-container-low border border-hairline rounded-lg px-3 py-3 outline-none focus:border-primary"
                    >
                      <option value="nylon">PA 12</option>
                      <option value="abs">ABS</option>
                      <option value="petg">PETG</option>
                    </select>
                  </label>
                  <label className="grid grid-cols-[60px_1fr] items-center gap-3">
                    <span className="text-muted">Finish:</span>
                    <select
                      value={finish}
                      onChange={(event) => setFinish(event.target.value)}
                      className="min-w-0 bg-surface-container-low border border-hairline rounded-lg px-3 py-3 outline-none focus:border-primary"
                    >
                      <option value="color-dyeing">Color Dyeing</option>
                      <option value="natural">Natural</option>
                      <option value="vapor-smoothed">Vapor smoothed</option>
                    </select>
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="grid grid-cols-[95px_1fr] items-center gap-3">
                    <span className="text-muted">Color:</span>
                    <div className="flex items-center gap-2 bg-surface-container-low border border-hairline rounded-lg px-3 py-2">
                      {colors.map((swatch) => (
                        <button
                          key={swatch}
                          type="button"
                          aria-label={`Select color ${swatch}`}
                          onClick={() => setColor(swatch)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            color === swatch
                              ? 'border-on-surface scale-110'
                              : 'border-surface-container-lowest'
                          }`}
                          style={{ backgroundColor: swatch }}
                        />
                      ))}
                      <span className="ml-auto text-[10px] uppercase">{color}</span>
                    </div>
                  </div>
                  <label className="grid grid-cols-[60px_1fr] items-center gap-3">
                    <span className="text-muted">Inspect:</span>
                    <select
                      value={inspection}
                      onChange={(event) => setInspection(event.target.value)}
                      className="min-w-0 bg-surface-container-low border border-hairline rounded-lg px-3 py-3 outline-none focus:border-primary"
                    >
                      <option value="standard">Quality inspection</option>
                      <option value="dimensional">Dimensional report</option>
                      <option value="none">No inspection</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-9 flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
                <label className="inline-flex items-center gap-3 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={markDefault}
                    onChange={(event) => setMarkDefault(event.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  Mark as default
                </label>
                <button
                  type="button"
                  onClick={saveAndContinue}
                  className="min-w-44 rounded-full bg-primary-container text-on-primary-container px-8 py-3 font-button-text text-button-text uppercase font-bold hover:brightness-95 active:scale-95 transition-all"
                >
                  Save & continue
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-surface px-margin-mobile md:px-margin-desktop py-4">
        <div className="max-w-container-max mx-auto flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <MaterialIcon name="verified_user" className="text-[17px]" /> Secure configuration
          </span>
          <button
            type="button"
            onClick={() => navigate('/quote')}
            className="hover:text-on-surface transition-colors"
          >
            Back to upload
          </button>
        </div>
      </footer>
    </div>
  )
}
