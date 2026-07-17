import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MaterialIcon from '../components/MaterialIcon'

const plans = [
  {
    eyebrow: '3D printing · Metal',
    price: 250,
    featured: true,
  },
  {
    eyebrow: '3D printing · Polymer',
    price: 310,
    featured: false,
  },
  {
    eyebrow: 'CNC · Metal and Polymer',
    price: 440,
    featured: false,
  },
]

const comparison = [
  {
    label: 'Technology',
    metal: 'L-PBF',
    polymer: 'SLS, MJF, FDM',
    cnc: 'CNC machining',
  },
  {
    label: 'Post processing',
    metal: 'Media blasting, CNC machining',
    polymer: 'Dyeing, smoothing, painting',
    cnc: 'Precision finishing',
  },
  {
    label: 'Quality',
    metal: 'Industrial grade',
    polymer: 'Industrial grade',
    cnc: 'Industrial grade',
  },
  {
    label: 'Lead times',
    metal: 'From 12 business days',
    polymer: 'From 6 business days',
    cnc: 'From 6 business days',
  },
  {
    label: 'Maximum sizes',
    metal: 'Up to 500 × 500 × 500mm',
    polymer: 'Up to 700 × 380 × 580mm',
    cnc: 'Up to 1000 × 600 × 500mm',
  },
]

export default function Capabilities() {
  return (
    <div className="min-h-screen bg-page text-on-surface flex flex-col">
      <Header variant="marketing" />
      <main className="flex-1">
        <section className="px-margin-mobile md:px-margin-desktop pt-14 md:pt-20 pb-16 max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
            <div className="max-w-3xl">
              <p className="font-technical-label text-technical-label uppercase tracking-[0.12em] mb-5">
                Find out exactly what you'll pay for
              </p>
              <h1 className="font-headline-xl text-[40px] sm:text-[52px] md:text-[64px] leading-[1.08] tracking-[-0.035em] font-medium">
                No surprises, just honest
                <br className="hidden sm:block" /> and straightforward quotes
              </h1>
            </div>
            <Link
              to="/quote"
              className="self-start md:self-center inline-flex items-center justify-center min-w-36 px-7 py-3.5 rounded-full bg-on-surface text-page font-button-text text-button-text uppercase hover:opacity-85 active:scale-95 transition-all"
            >
              Contact us
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:ml-[24%]">
            {plans.map((plan, index) => (
              <article
                key={plan.eyebrow}
                className={`relative overflow-hidden rounded-[1.4rem] p-5 md:p-6 min-h-56 flex flex-col justify-between border transition-transform hover:-translate-y-1 ${
                  plan.featured
                    ? 'bg-secondary-container text-on-secondary-fixed border-secondary-fixed-dim'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/20'
                }`}
              >
                {plan.featured ? (
                  <div className="absolute -left-16 bottom-3 w-24 h-24 border-[10px] border-secondary-fixed-dim/70 rounded-3xl rotate-45" />
                ) : null}
                <div className="relative">
                  <p className="text-sm flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-on-secondary-fixed' : 'border border-outline'
                      }`}
                    />
                    {plan.eyebrow}
                  </p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="font-headline-lg text-[42px] leading-none font-semibold tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-[10px] uppercase opacity-60 mb-1.5">/ per part</span>
                  </div>
                </div>
                <Link
                  to="/quote"
                  className="relative mt-8 w-full rounded-full bg-surface-container-lowest/90 text-on-surface py-3 text-center font-button-text text-button-text uppercase hover:bg-primary-container hover:text-on-primary-container transition-colors"
                >
                  Print parts
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-hairline bg-page">
          <div className="max-w-container-max mx-auto overflow-x-auto">
            <div className="min-w-[820px] grid grid-cols-[1.05fr_1.45fr_1.45fr_1.1fr]">
              <div className="p-6 md:px-10 border-r border-hairline">
                <p className="font-technical-label text-technical-label uppercase">Characteristics</p>
              </div>
              <div className="p-6 border-r border-hairline font-semibold">Metal 3D printing</div>
              <div className="p-6 border-r border-hairline font-semibold">Polymer 3D printing</div>
              <div className="p-6 font-semibold">CNC</div>
              {comparison.map((row) => (
                <div key={row.label} className="contents">
                  <div className="px-6 md:px-10 py-4 border-r border-t border-hairline text-sm text-muted">
                    {row.label}
                  </div>
                  <div className="px-6 py-4 border-r border-t border-hairline text-sm">{row.metal}</div>
                  <div className="px-6 py-4 border-r border-t border-hairline text-sm">{row.polymer}</div>
                  <div className="px-6 py-4 border-t border-hairline text-sm">{row.cnc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-technical-label text-technical-label text-primary uppercase mb-2">
              Have a custom requirement?
            </p>
            <h2 className="font-headline-lg text-headline-lg font-semibold">Our engineers can help.</h2>
          </div>
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary-container text-on-primary-container font-button-text uppercase hover:gap-3 transition-all"
          >
            Start a quote <MaterialIcon name="arrow_forward" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}