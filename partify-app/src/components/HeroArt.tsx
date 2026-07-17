/** Abstract geometric hero art matching the PARTIFY marketing design */
export default function HeroArt() {
  return (
    <div className="relative w-full h-full min-h-[280px]">
      <svg
        className="absolute inset-0 w-full h-full text-[#cfcfcf]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" opacity="0.55" />
        {/* faint grid lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${(i + 1) * 8}%`}
            y1="0"
            x2={`${(i + 1) * 8}%`}
            y2="100%"
            stroke="#e8e8e8"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 9}%`}
            x2="100%"
            y2={`${(i + 1) * 9}%`}
            stroke="#e8e8e8"
            strokeWidth="1"
          />
        ))}
      </svg>

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 560 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {/* Outline ghost shapes */}
        <rect x="36" y="60" width="110" height="180" rx="40" stroke="#d4d4d4" strokeWidth="2" />
        <rect x="420" y="30" width="90" height="90" rx="28" stroke="#d4d4d4" strokeWidth="2" />
        <rect x="430" y="300" width="80" height="130" rx="28" stroke="#d4d4d4" strokeWidth="2" />
        <rect x="60" y="360" width="100" height="70" rx="28" stroke="#d4d4d4" strokeWidth="2" />

        {/* Lavender cluster */}
        <rect x="90" y="90" width="150" height="95" rx="36" fill="#b2bafd" />
        <rect x="200" y="150" width="120" height="120" rx="40" fill="#c5cbff" />
        <rect x="300" y="190" width="170" height="72" rx="36" fill="#b2bafd" />
        <rect x="270" y="270" width="100" height="100" rx="32" fill="#9aa3f5" />

        {/* Lime cluster */}
        <rect x="150" y="28" width="110" height="72" rx="30" fill="#d4ff00" />
        <rect x="55" y="210" width="85" height="140" rx="34" fill="#caf300" />
        <rect x="245" y="70" width="75" height="58" rx="24" fill="#d4ff00" />
        <rect x="165" y="290" width="140" height="85" rx="36" fill="#d4ff00" />
        <rect x="330" y="350" width="120" height="95" rx="34" fill="#b0d500" />

        {/* Small accent */}
        <rect x="380" y="120" width="55" height="55" rx="18" fill="#bcc3ff" opacity="0.7" />
      </svg>
    </div>
  )
}
