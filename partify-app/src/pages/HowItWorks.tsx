import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MaterialIcon from '../components/MaterialIcon'

const steps = [
  {
    n: '01',
    icon: 'upload_file',
    title: 'Upload',
    body: 'Drop an STL, STEP, or CAD file to start a quote. We parse geometry and surface a first price estimate in seconds.',
    to: '/quote',
    cta: 'Start upload',
    accent: 'primary' as const,
  },
  {
    n: '02',
    icon: 'tune',
    title: 'Configure',
    body: 'Pick material, finish, and quantity. Transparent options keep cost and lead time clear before you commit.',
    to: '/quote/configure',
    cta: 'Configure part',
    accent: 'secondary' as const,
  },
  {
    n: '03',
    icon: 'view_in_ar',
    title: 'Workshop',
    body: 'Orient, slice, and simulate in the Workshop so print readiness matches what you expect on the floor.',
    to: '/workshop',
    cta: 'Open Workshop',
    accent: 'primary' as const,
  },
  {
    n: '04',
    icon: 'fact_check',
    title: 'Review & produce',
    body: 'Confirm the quote summary — specs, price, and timeline — then send it into production with confidence.',
    to: '/quote/review',
    cta: 'Review quote',
    accent: 'secondary' as const,
  },
]

export default function HowItWorks() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="mb-16 max-w-2xl">
          <p className="font-technical-label text-technical-label text-primary uppercase tracking-widest mb-2">
            From CAD to part
          </p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">How it works</h1>
          <p className="text-on-surface-variant text-body-md font-body-md">
            Four steps from upload to production — quote, configure, workshop, and review — built for
            industrial part sourcing without the back-and-forth.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {steps.map((step) => {
            const isPrimary = step.accent === 'primary'
            return (
              <li
                key={step.n}
                className="bg-surface-container rounded-[2rem] p-8 border border-outline-variant/20 hover:border-primary/40 transition-colors group flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-xl transition-colors ${
                      isPrimary
                        ? 'bg-primary-container/30 group-hover:bg-primary-container'
                        : 'bg-secondary-container/40 group-hover:bg-secondary-container'
                    }`}
                  >
                    <MaterialIcon
                      name={step.icon}
                      className={isPrimary ? 'text-primary' : 'text-on-secondary-container'}
                    />
                  </div>
                  <span
                    className={`font-technical-label text-technical-label uppercase tracking-widest ${
                      isPrimary ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    Step {step.n}
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile font-bold text-on-surface mb-3">
                  {step.title}
                </h2>
                <p className="text-on-surface-variant flex-grow mb-6">{step.body}</p>
                <Link
                  to={step.to}
                  className="font-button-text text-button-text text-primary inline-flex items-center gap-1 w-fit hover:gap-2 transition-all"
                >
                  {step.cta} <MaterialIcon name="arrow_forward" className="text-sm" />
                </Link>
              </li>
            )
          })}
        </ol>

        <div className="bg-secondary-container rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">
              Ready to start?
            </h2>
            <p className="text-on-secondary-container max-w-md">
              Get a transparent quote or open the Workshop to preview orientation and slice settings.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/quote"
              className="bg-on-background text-background px-8 py-4 rounded-xl font-button-text text-button-text flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              GET QUOTE <MaterialIcon name="arrow_forward" />
            </Link>
            <Link
              to="/workshop"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-button-text text-button-text flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              OPEN WORKSHOP
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
