import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../theme/ThemeContext'

type HeaderProps = {
  variant?: 'default' | 'marketing'
  showAvatar?: boolean
  ctaTo?: string
}

function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M4 28V4h12.2c4.6 0 7.8 2.6 7.8 6.8 0 3.1-1.7 5.3-4.3 6.3L26.5 28H20l-6.2-8.4H10V28H4zm6-13.2h5.2c2.1 0 3.4-1.1 3.4-2.9S17.3 9 15.2 9H10v5.8z"
        fill="currentColor"
      />
      <rect x="20" y="4" width="8" height="8" rx="2.5" fill="currentColor" opacity="0.2" />
      <path d="M22 8h4M24 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Header({
  variant = 'default',
  showAvatar = false,
  ctaTo = '/quote',
}: HeaderProps) {
  const location = useLocation()
  const { isDark } = useTheme()

  if (variant === 'marketing') {
    const items = [
      { to: '/', label: 'Home', match: location.pathname === '/' },
      {
        to: '/how-it-works',
        label: 'How it works',
        match: location.pathname === '/how-it-works',
      },
      { to: '/workshop', label: 'Workshop', match: location.pathname === '/workshop' },
      { to: '/workspace-2', label: 'Workspace 2', match: location.pathname === '/workspace-2' },
      { to: '/capabilities', label: 'Capabilities', match: location.pathname === '/capabilities' },
      { to: '/resources', label: 'Resource hub', match: location.pathname === '/resources' },
    ]

    return (
      <header className="relative w-full flex justify-between items-center px-6 md:px-12 lg:px-16 py-5 bg-page">
        <Link to="/" className="flex items-center gap-2.5 text-on-surface shrink-0">
          <LogoMark className="w-8 h-8" />
          <span className="text-[20px] md:text-[22px] font-extrabold tracking-tight uppercase font-headline-lg">
            PARTIFY
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-nav-border text-[12px] font-medium text-on-surface bg-page hover:border-on-surface transition-colors"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  item.match ? 'bg-on-surface' : 'border border-outline'
                }`}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle compact />
          <Link
            to={ctaTo}
            className={`px-6 py-2.5 rounded-full text-[13px] font-semibold tracking-wide uppercase hover:opacity-90 active:scale-95 transition-all ${
              isDark
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-on-surface text-page'
            }`}
          >
            GET QUOTE
          </Link>
        </div>
      </header>
    )
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-on-surface font-bold border-b-2 border-primary-container font-technical-label text-technical-label'
      : 'text-on-surface-variant hover:text-primary-container transition-colors font-technical-label text-technical-label'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 bg-surface/80">
      <Link to="/" className="flex items-center gap-2 text-on-surface">
        <LogoMark className="w-8 h-8" />
        <span className="font-headline-lg text-headline-lg font-bold tracking-tighter text-on-surface">
          PARTIFY
        </span>
      </Link>

      <nav className="hidden xl:flex gap-5 items-center">
        <NavLink to="/" end className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to="/how-it-works" className={navLinkClass}>
          How it works
        </NavLink>
        <NavLink to="/workshop" className={navLinkClass}>
          Workshop
        </NavLink>
        <NavLink to="/workspace-2" className={navLinkClass}>
          Workspace 2
        </NavLink>
        <NavLink to="/capabilities" className={navLinkClass}>
          Capabilities
        </NavLink>
        <NavLink to="/resources" className={navLinkClass}>
          Resource hub
        </NavLink>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle compact />
        <Link
          to={ctaTo}
          className={`px-6 py-2 rounded-xl font-button-text text-button-text hover:opacity-90 active:scale-95 duration-100 transition-all ${
            isDark
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-on-surface text-page rounded-full'
          }`}
        >
          GET QUOTE
        </Link>
        {showAvatar && (
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline bg-surface-container" />
        )}
      </div>
    </header>
  )
}

export { LogoMark }
