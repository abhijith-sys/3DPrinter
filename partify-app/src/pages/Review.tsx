import { Link } from 'react-router-dom'
import Header from '../components/Header'
import QuoteProgress from '../components/QuoteProgress'
import MaterialIcon from '../components/MaterialIcon'

const materialLabels: Record<string, string> = {
  pla: 'PLA - TOUGH',
  abs: 'ABS - INDUSTRIAL',
  petg: 'PETG - CHEMICAL',
  nylon: 'NYLON - FLEX',
}

const unitPrices: Record<string, number> = {
  pla: 180,
  abs: 250,
  petg: 220,
  nylon: 310,
}

export default function Review() {
  const raw = sessionStorage.getItem('partify-config')
  const config = raw
    ? (JSON.parse(raw) as { material: string; finish: string; qty: number; fileName: string })
    : { material: 'abs', finish: 'As printed', qty: 1, fileName: 'PART_UPLOAD.STL' }

  const unit = unitPrices[config.material] ?? 250
  const subtotal = unit * config.qty
  const shipping = 45
  const total = subtotal + shipping

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-24 px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-container-max mx-auto w-full">
        <aside className="lg:col-span-3 flex flex-col gap-4 h-fit lg:sticky lg:top-32">
          <QuoteProgress step={3} />
        </aside>

        <section className="lg:col-span-9 flex flex-col gap-8">
          <div>
            <p className="font-technical-label text-technical-label text-primary uppercase tracking-widest mb-2">
              Step 3
            </p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Quote summary
            </h1>
            <p className="text-on-surface-variant mt-2">
              Review your configuration before requesting production.
            </p>
          </div>

          <div className="bg-surface-container rounded-[2rem] p-8 border border-outline-variant/30">
            <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center">
                  <MaterialIcon name="deployed_code" className="text-on-primary-container text-3xl" />
                </div>
                <div>
                  <p className="font-technical-label text-technical-label text-outline uppercase">
                    Part file
                  </p>
                  <p className="font-headline-lg text-headline-lg-mobile font-bold text-on-surface">
                    {config.fileName}
                  </p>
                </div>
              </div>
              <Link
                to="/workshop"
                className="font-button-text text-button-text text-primary flex items-center gap-2 hover:gap-3 transition-all"
              >
                Open in Workshop <MaterialIcon name="open_in_new" />
              </Link>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-outline-variant/40 pt-8">
              <div>
                <dt className="font-technical-label text-technical-label text-outline uppercase mb-1">
                  Material
                </dt>
                <dd className="font-bold text-on-surface">
                  {materialLabels[config.material] ?? config.material}
                </dd>
              </div>
              <div>
                <dt className="font-technical-label text-technical-label text-outline uppercase mb-1">
                  Finish
                </dt>
                <dd className="font-bold text-on-surface">{config.finish}</dd>
              </div>
              <div>
                <dt className="font-technical-label text-technical-label text-outline uppercase mb-1">
                  Quantity
                </dt>
                <dd className="font-bold text-on-surface">{config.qty}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-inverse-surface text-surface rounded-[2rem] p-8">
            <h2 className="font-technical-label text-technical-label text-primary-fixed uppercase tracking-widest mb-6">
              Pricing
            </h2>
            <div className="space-y-4 font-body-md">
              <div className="flex justify-between">
                <span className="opacity-70">
                  Unit price × {config.qty}
                </span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Standard shipping</span>
                <span>${shipping}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 text-headline-lg font-headline-lg font-bold">
                <span>Estimated total</span>
                <span className="text-primary-container">${total.toLocaleString()}</span>
              </div>
            </div>
            <p className="mt-6 font-technical-label text-technical-label text-outline">
              Lead time: from 6 business days · Prices exclude tax
            </p>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline-variant z-50">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3 flex justify-between items-center">
          <Link
            to="/quote/configure"
            className="text-on-surface-variant font-button-text text-button-text font-bold hover:text-primary transition-colors"
          >
            BACK
          </Link>
          <button
            type="button"
            className="bg-primary-container text-on-primary-container px-10 py-3 rounded-xl font-button-text text-button-text font-bold flex items-center gap-3 active:scale-95 transition-all"
          >
            REQUEST PRODUCTION <MaterialIcon name="check" />
          </button>
        </div>
      </footer>
    </div>
  )
}
