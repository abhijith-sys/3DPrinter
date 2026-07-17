import { Link } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-8 w-full gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-headline-lg text-on-surface font-bold tracking-tighter">PARTIFY</span>
        <p className="text-technical-label font-technical-label text-on-surface-variant">
          © 2024 PARTIFY MANUFACTURING INC.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors font-technical-label text-technical-label"
          to="/resources"
        >
          Terms
        </Link>
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors font-technical-label text-technical-label"
          to="/resources"
        >
          Privacy
        </Link>
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors font-technical-label text-technical-label"
          to="/resources"
        >
          Materials Guide
        </Link>
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors font-technical-label text-technical-label"
          to="/resources"
        >
          Help Center
        </Link>
      </div>
      <div className="flex gap-4">
        <a
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-primary transition-all group"
          href="#"
          aria-label="Share"
        >
          <MaterialIcon name="share" className="text-sm group-hover:text-white" />
        </a>
        <a
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-primary transition-all group"
          href="#"
          aria-label="Website"
        >
          <MaterialIcon name="public" className="text-sm group-hover:text-white" />
        </a>
      </div>
    </footer>
  )
}
