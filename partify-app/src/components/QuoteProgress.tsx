type QuoteProgressProps = {
  step: 1 | 2 | 3
}

const steps = [
  { n: 1, title: 'Upload', subtitle: 'STL, STEP, OR CAD' },
  { n: 2, title: 'Configure', subtitle: 'MATERIALS & SPECS' },
  { n: 3, title: 'Review', subtitle: 'QUOTE SUMMARY' },
] as const

export default function QuoteProgress({ step }: QuoteProgressProps) {
  return (
    <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/30">
      <h3 className="font-headline-lg text-headline-lg font-bold mb-4 text-on-surface">Configuration</h3>
      <div className="flex flex-col gap-3">
        {steps.map((s) => {
          const active = s.n === step
          const done = s.n < step
          return (
            <div
              key={s.n}
              className={`flex items-center gap-4 ${!active && !done ? 'opacity-40' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  active || done
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {s.n}
              </div>
              <div>
                <p className={`font-bold ${active ? 'text-on-surface' : ''}`}>{s.title}</p>
                <p className="text-on-surface-variant font-technical-label text-technical-label">
                  {s.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
