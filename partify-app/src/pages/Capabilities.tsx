import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MaterialIcon from '../components/MaterialIcon'

const capabilities = [
  {
    icon: 'precision_manufacturing',
    title: 'Metal Additive (L-PBF)',
    body: 'Industrial metal parts with media blasting and CNC post-processing. Build volume up to 500³ mm.',
  },
  {
    icon: 'layers',
    title: 'Polymer (SLS / MJF / FDM)',
    body: 'Functional prototypes and end-use polymer parts with dyeing and vapor smoothing options.',
  },
  {
    icon: 'architecture',
    title: 'CNC Machining',
    body: 'Tight-tolerance metal and polymer machining for fixtures, jigs, and production runs.',
  },
  {
    icon: 'speed',
    title: 'Rapid Quoting',
    body: 'Instant price estimates from STL, STEP, or CAD uploads — typically under 2 seconds.',
  },
  {
    icon: 'verified',
    title: 'Quality Assurance',
    body: 'Dimensional inspection, material certs, and process monitoring on every industrial order.',
  },
  {
    icon: 'local_shipping',
    title: 'Fast Delivery',
    body: 'Standard polymer lead times from 6 business days; express options available on request.',
  },
]

export default function Capabilities() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="mb-16 max-w-2xl">
          <p className="font-technical-label text-technical-label text-primary uppercase tracking-widest mb-2">
            Manufacturing stack
          </p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Capabilities</h1>
          <p className="text-on-surface-variant text-body-md font-body-md">
            From additive metal to CNC finishing — Partify covers the full path from digital design
            to industrial-grade parts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="bg-surface-container rounded-[2rem] p-8 border border-outline-variant/20 hover:border-primary/40 transition-colors group"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center bg-primary-container/30 rounded-xl group-hover:bg-primary-container transition-colors">
                <MaterialIcon name={c.icon} className="text-primary" />
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile font-bold text-on-surface mb-3">
                {c.title}
              </h2>
              <p className="text-on-surface-variant">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary-container rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">
              Ready to print?
            </h2>
            <p className="text-on-secondary-container max-w-md">
              Upload a model and get a transparent quote — no surprises.
            </p>
          </div>
          <Link
            to="/quote"
            className="bg-on-background text-background px-8 py-4 rounded-xl font-button-text text-button-text flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            GET QUOTE <MaterialIcon name="arrow_forward" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
