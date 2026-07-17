import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MaterialIcon from '../components/MaterialIcon'

const resources = [
  {
    icon: 'menu_book',
    title: 'Materials Guide',
    body: 'Compare PLA, ABS, PETG, nylon, and metal powders for strength, heat, and finish.',
    tag: 'Guide',
  },
  {
    icon: 'school',
    title: 'Design for Additive',
    body: 'Wall thickness, overhangs, and manifold mesh tips for accurate quotes and clean prints.',
    tag: 'Tutorial',
  },
  {
    icon: 'help',
    title: 'Help Center',
    body: 'Order tracking, file formats, shipping, and FAQs from the Partify support team.',
    tag: 'Support',
  },
  {
    icon: 'gavel',
    title: 'Terms & Privacy',
    body: 'How we handle your CAD files, IP, and data during secure quote transmission.',
    tag: 'Legal',
  },
  {
    icon: 'engineering',
    title: 'Talk to an Expert',
    body: 'Book a call with our applications engineers for DfM reviews and material selection.',
    tag: 'Consult',
  },
  {
    icon: 'article',
    title: 'Process Specs',
    body: 'Lead times, tolerances, and post-processing options for metal and polymer workflows.',
    tag: 'Specs',
  },
]

export default function ResourceHub() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="mb-16 max-w-2xl">
          <p className="font-technical-label text-technical-label text-primary uppercase tracking-widest mb-2">
            Knowledge base
          </p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Resource hub</h1>
          <p className="text-on-surface-variant text-body-md font-body-md">
            Guides, specs, and support to get your parts from CAD to production with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <article
              key={r.title}
              className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-8 hover:bg-white hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                  <MaterialIcon name={r.icon} className="text-primary" />
                </div>
                <span className="font-technical-label text-technical-label text-outline uppercase">
                  {r.tag}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                {r.title}
              </h2>
              <p className="text-on-surface-variant mb-6">{r.body}</p>
              <span className="font-button-text text-button-text text-primary inline-flex items-center gap-1">
                Read more <MaterialIcon name="chevron_right" className="text-sm" />
              </span>
            </article>
          ))}
        </div>

        <div className="mt-16 border-t border-outline-variant pt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <p className="text-on-surface-variant max-w-md">
            Prefer hands-on? Open the Workshop to preview orientation, materials, and slice settings.
          </p>
          <Link
            to="/workshop"
            className="bg-primary text-on-primary px-8 py-3 rounded-full font-button-text text-button-text hover:bg-primary/90 active:scale-95 transition-all"
          >
            OPEN WORKSHOP
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
