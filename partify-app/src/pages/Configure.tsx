import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import QuoteProgress from '../components/QuoteProgress'
import MaterialIcon from '../components/MaterialIcon'

const materials = [
  { id: 'pla', name: 'PLA - TOUGH', desc: 'Rapid prototyping', icon: 'layers' },
  { id: 'abs', name: 'ABS - INDUSTRIAL', desc: 'High durability', icon: 'architecture' },
  { id: 'petg', name: 'PETG - CHEMICAL', desc: 'Chemical resistance', icon: 'science' },
  { id: 'nylon', name: 'NYLON - FLEX', desc: 'Impact & flex', icon: 'all_inclusive' },
] as const

const finishes = ['As printed', 'Vapor smoothed', 'Media blasted', 'Painted'] as const

export default function Configure() {
  const navigate = useNavigate()
  const [material, setMaterial] = useState('abs')
  const [finish, setFinish] = useState<(typeof finishes)[number]>('As printed')
  const [qty, setQty] = useState(1)
  const fileName = sessionStorage.getItem('partify-file') || 'PART_UPLOAD.STL'

  const saveAndContinue = () => {
    sessionStorage.setItem(
      'partify-config',
      JSON.stringify({ material, finish, qty, fileName }),
    )
    navigate('/quote/review')
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-24 px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-container-max mx-auto w-full">
        <aside className="lg:col-span-3 flex flex-col gap-4 h-fit lg:sticky lg:top-32">
          <QuoteProgress step={2} />
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30">
            <p className="font-technical-label text-technical-label text-outline uppercase mb-2">
              File
            </p>
            <div className="flex items-center gap-3">
              <MaterialIcon name="deployed_code" className="text-primary" />
              <p className="font-technical-label text-technical-label text-on-surface font-bold truncate">
                {fileName}
              </p>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9 flex flex-col gap-8">
          <div>
            <p className="font-technical-label text-technical-label text-primary uppercase tracking-widest mb-2">
              Step 2
            </p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Configure materials & specs
            </h1>
            <p className="text-on-surface-variant mt-2 max-w-xl">
              Choose production material, surface finish, and quantity for an accurate quote.
            </p>
          </div>

          <div>
            <h2 className="font-technical-label text-technical-label text-outline uppercase tracking-widest mb-4">
              Material
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materials.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMaterial(m.id)}
                  className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-colors ${
                    material === m.id
                      ? 'border-primary bg-primary-container/20'
                      : 'border-outline-variant bg-surface-container-low hover:border-primary'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      material === m.id
                        ? 'bg-primary text-primary-container'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    <MaterialIcon name={m.icon} />
                  </div>
                  <div>
                    <p className="font-technical-label text-technical-label font-bold text-on-surface">
                      {m.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-technical-label text-technical-label text-outline uppercase tracking-widest mb-4">
              Finish
            </h2>
            <div className="flex flex-wrap gap-3">
              {finishes.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFinish(f)}
                  className={`px-5 py-3 rounded-xl font-button-text text-button-text transition-colors ${
                    finish === f
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-technical-label text-technical-label text-outline uppercase tracking-widest mb-4">
              Quantity
            </h2>
            <div className="flex items-center gap-4 bg-surface-container rounded-xl p-4 w-fit border border-outline-variant/30">
              <button
                type="button"
                className="w-10 h-10 rounded-lg bg-surface-container-highest hover:bg-primary-container transition-colors"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <MaterialIcon name="remove" />
              </button>
              <span className="font-headline-lg text-headline-lg w-12 text-center">{qty}</span>
              <button
                type="button"
                className="w-10 h-10 rounded-lg bg-surface-container-highest hover:bg-primary-container transition-colors"
                onClick={() => setQty((q) => q + 1)}
              >
                <MaterialIcon name="add" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline-variant z-50">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3 flex justify-between items-center">
          <Link
            to="/quote"
            className="text-on-surface-variant font-button-text text-button-text font-bold hover:text-primary transition-colors"
          >
            BACK
          </Link>
          <button
            type="button"
            onClick={saveAndContinue}
            className="bg-primary text-on-primary px-10 py-3 rounded-xl font-button-text text-button-text font-bold flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            REVIEW QUOTE <MaterialIcon name="arrow_forward" />
          </button>
        </div>
      </footer>
    </div>
  )
}
