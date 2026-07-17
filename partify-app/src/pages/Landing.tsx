import { Link } from 'react-router-dom'
import Header from '../components/Header'
import HeroArt from '../components/HeroArt'

function FeatureIcon({ variant }: { variant: 1 | 2 | 3 }) {
  if (variant === 1) {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="#1c1b1b" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="1.5" fill="#1c1b1b" />
        <circle cx="19" cy="9" r="1.5" fill="#1c1b1b" />
        <circle cx="9" cy="19" r="1.5" fill="#1c1b1b" />
        <circle cx="19" cy="19" r="1.5" fill="#1c1b1b" />
        <path d="M9 9h10M9 9v10M19 9v10M9 19h10" stroke="#1c1b1b" strokeWidth="1.2" />
      </svg>
    )
  }
  if (variant === 2) {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="#1c1b1b" strokeWidth="1.5" />
        <path d="M7 20L21 8" stroke="#1c1b1b" strokeWidth="1.5" />
        <circle cx="7" cy="20" r="2" fill="#1c1b1b" />
        <circle cx="14" cy="14" r="2" fill="#1c1b1b" />
        <circle cx="21" cy="8" r="2" fill="#1c1b1b" />
      </svg>
    )
  }
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect x="3" y="3" width="22" height="22" rx="4" stroke="#1c1b1b" strokeWidth="1.5" />
      <circle cx="14" cy="10" r="2" fill="#1c1b1b" />
      <circle cx="9" cy="18" r="2" fill="#1c1b1b" />
      <circle cx="19" cy="18" r="2" fill="#1c1b1b" />
      <path d="M14 12v3M14 15l-4 2M14 15l4 2" stroke="#1c1b1b" strokeWidth="1.3" />
    </svg>
  )
}

function JoyGlyph() {
  return (
    <svg
      className="inline-block w-7 h-7 md:w-8 md:h-8 align-[-2px] mx-1"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
    >
      <rect x="2" y="10" width="18" height="14" rx="5" fill="#8b95f0" />
      <rect x="14" y="16" width="16" height="16" rx="6" fill="#b2bafd" />
      <circle cx="30" cy="10" r="3.5" fill="#9aa3f5" />
    </svg>
  )
}

const features = [
  {
    icon: 1 as const,
    title: 'A WORLD OF POSSIBILITIES',
    body: 'Discover our advanced manufacturing materials and technologies.',
    to: '/capabilities',
  },
  {
    icon: 2 as const,
    title: 'QUALITY THAT YOU CAN TRUST',
    body: 'Explore our industrial-grade parts and advanced specification options.',
    to: '/capabilities',
  },
  {
    icon: 3 as const,
    title: 'GET YOUR PARTS FASTER',
    body: 'Industrial-grade parts, fast delivery: 6 business days max.',
    to: '/quote',
  },
]

export default function Landing() {
  return (
    <div className="bg-white text-on-surface min-h-screen flex flex-col selection:bg-secondary-container relative">
      <Header variant="marketing" />

      <main className="flex-grow flex flex-col min-h-0">
        <section className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 px-6 md:px-12 lg:px-16 pt-4 lg:pt-8 pb-8 items-center">
          <div className="max-w-[540px]">
            <h1 className="font-headline-xl text-[36px] sm:text-[44px] md:text-[52px] leading-[1.15] tracking-[-0.03em] font-bold text-on-surface">
              Discover the joy
              <JoyGlyph />
              of{' '}
              <span className="inline bg-secondary-container rounded-full px-[0.35em] py-[0.05em] box-decoration-clone">
                effortless
              </span>{' '}
              industrial part sourcing{' '}
              <span className="inline bg-secondary-container rounded-full px-[0.35em] py-[0.05em] box-decoration-clone">
                with Partify.
              </span>
            </h1>
            <p className="mt-8 text-[#6e6e6e] text-[15px] leading-[1.65] max-w-[380px]">
              Partify&apos;s 3D printing service is now available and ready to revolutionize the way
              you think about production and manufacturing.
            </p>
          </div>

          <div className="relative w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[480px] lg:h-full">
            <HeroArt />
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-[#e6e6e6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-auto"
        >
          <div className="flex items-center px-6 md:px-10 py-8 lg:py-12 border-b sm:border-b lg:border-b-0 sm:border-r border-[#e6e6e6]">
            <Link
              to="/quote"
              className="bg-on-surface text-white px-9 py-3.5 rounded-full text-[13px] font-semibold tracking-wide uppercase hover:opacity-90 active:scale-95 transition-all"
            >
              GET STARTED
            </Link>
          </div>

          {features.map((f, i) => (
            <Link
              key={f.title}
              to={f.to}
              className={`px-6 md:px-8 py-8 lg:py-12 flex flex-col gap-3 hover:bg-[#fafafa] transition-colors border-[#e6e6e6] ${
                i < features.length - 1 ? 'lg:border-r' : ''
              } ${i === 0 ? 'sm:border-r-0 lg:border-r border-b sm:border-b-0' : ''} ${
                i === 1 ? 'border-b lg:border-b-0 sm:border-b' : ''
              } ${i === 2 ? 'sm:border-r border-b sm:border-b-0 lg:border-b-0' : ''}`}
            >
              <FeatureIcon variant={f.icon} />
              <h2 className="text-[12px] md:text-[13px] font-bold tracking-[0.02em] uppercase text-on-surface leading-snug">
                {f.title} <span className="font-semibold">›</span>
              </h2>
              <p className="text-[12px] md:text-[13px] text-[#7a7a7a] leading-snug">{f.body}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
