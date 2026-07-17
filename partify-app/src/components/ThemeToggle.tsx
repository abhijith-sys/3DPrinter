import MaterialIcon from './MaterialIcon'
import { useTheme } from '../theme/ThemeContext'

type ThemeToggleProps = {
  className?: string
  compact?: boolean
}

/** Black / white theme switch — dark mode matches Workshop */
export default function ThemeToggle({ className = '', compact = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`inline-flex items-center gap-2 rounded-full border transition-all active:scale-95 ${
        isDark
          ? 'border-white/15 bg-white/5 text-surface-bright hover:bg-white/10'
          : 'border-nav-border bg-page text-on-surface hover:border-on-surface'
      } ${compact ? 'p-2' : 'px-3 py-2'} ${className}`}
    >
      <MaterialIcon
        name={isDark ? 'dark_mode' : 'light_mode'}
        className={`text-[18px] ${isDark ? 'text-primary-container' : 'text-on-surface'}`}
      />
      {!compact && (
        <span className="font-technical-label text-[11px] uppercase tracking-wider">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
      <span
        className={`relative w-9 h-5 rounded-full transition-colors ${
          isDark ? 'bg-primary-container' : 'bg-on-surface'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
            isDark ? 'right-0.5 bg-on-primary-container' : 'left-0.5 bg-page'
          }`}
        />
      </span>
    </button>
  )
}
