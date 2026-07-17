import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import QuoteProgress from '../components/QuoteProgress'
import MaterialIcon from '../components/MaterialIcon'

export default function Upload() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return
    const file = files[0]
    setFileName(file.name)
    sessionStorage.setItem('partify-file', file.name)
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-24 px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-container-max mx-auto w-full">
        <aside className="lg:col-span-3 flex flex-col gap-4 h-fit lg:sticky lg:top-32">
          <QuoteProgress step={1} />
          <div className="flex flex-col gap-4">
            <p className="font-technical-label text-technical-label text-outline uppercase tracking-widest">
              Available now
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-surface-container-low border border-outline-variant p-3 rounded-xl flex items-center gap-3 group hover:border-primary transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-container">
                  <MaterialIcon name="layers" />
                </div>
                <div>
                  <p className="font-technical-label text-technical-label text-on-surface font-bold">
                    PLA - TOUGH
                  </p>
                  <p className="text-xs text-on-surface-variant">Rapid prototyping</p>
                </div>
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-3 rounded-xl flex items-center gap-3 group hover:border-primary transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-secondary-container">
                  <MaterialIcon name="architecture" />
                </div>
                <div>
                  <p className="font-technical-label text-technical-label text-on-surface font-bold">
                    ABS - INDUSTRIAL
                  </p>
                  <p className="text-xs text-on-surface-variant">High durability</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9 flex flex-col gap-6">
          <div
            className={`w-full aspect-video md:aspect-[21/7] border-2 border-dashed rounded-3xl bg-surface-container-lowest flex flex-col items-center justify-center gap-4 transition-all cursor-pointer relative overflow-hidden ${
              dragging
                ? 'border-primary bg-primary-container/10'
                : 'border-outline-variant hover:border-primary hover:bg-primary-container/5'
            }`}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              handleFiles(e.dataTransfer.files)
            }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/10 organic-blob" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-container/10 organic-blob" />
            <input
              ref={inputRef}
              type="file"
              accept=".stl,.step,.stp,.obj,.3mf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-lg">
                <MaterialIcon name="cloud_upload" className="text-4xl" />
              </div>
              <div className="text-center">
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  {fileName ? fileName : 'Drop your design here'}
                </h2>
                <p className="text-on-surface-variant max-w-md mx-auto mt-2">
                  {fileName
                    ? 'File ready. Continue to configure materials and specs.'
                    : 'Upload STL, STEP, or CAD files to get an instant quote. Maximum file size 100MB.'}
                </p>
              </div>
              <button
                type="button"
                className="bg-on-surface text-surface px-8 py-3 rounded-xl font-button-text text-button-text font-bold hover:bg-primary transition-colors mt-4"
              >
                BROWSE FILES
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container p-4 rounded-3xl border border-outline-variant/20 flex gap-4 items-center">
              <div className="w-24 h-24 bg-surface-container-highest rounded-2xl flex-shrink-0 border border-outline-variant/30 flex items-center justify-center">
                <MaterialIcon name="deployed_code" className="text-primary text-4xl" />
              </div>
              <div className="flex-grow">
                <p className="font-technical-label text-technical-label text-outline uppercase">
                  Pro Tip
                </p>
                <p className="font-bold text-on-surface mt-1">Optimize for Print</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  Ensure your mesh is manifold and water-tight for the most accurate quoting.
                </p>
              </div>
            </div>
            <div className="bg-inverse-surface p-4 rounded-3xl flex flex-col justify-between text-surface overflow-hidden relative">
              <div className="z-10">
                <h4 className="font-headline-lg text-headline-lg font-bold mb-2">Need Help?</h4>
                <p className="text-surface-variant/80 text-sm">
                  Our engineering team is available 24/7 to help you refine your designs for
                  manufacturing.
                </p>
              </div>
              <Link
                className="z-10 text-primary-container font-bold flex items-center gap-2 mt-4 hover:gap-3 transition-all"
                to="/resources"
              >
                Talk to an Expert <MaterialIcon name="arrow_forward" />
              </Link>
              <div className="absolute right-[-10%] top-[-10%] w-40 h-40 bg-on-primary-fixed-variant/20 organic-blob" />
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline-variant z-50">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3 flex justify-between items-center">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <MaterialIcon name="verified_user" className="text-outline" />
            <span className="text-sm font-technical-label text-technical-label uppercase">
              SECURE DATA TRANSMISSION
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-on-surface-variant font-button-text text-button-text font-bold hover:text-primary transition-colors"
            >
              CANCEL
            </Link>
            <button
              type="button"
              onClick={() => navigate('/quote/configure')}
              className="bg-primary text-on-primary px-10 py-3 rounded-xl font-button-text text-button-text font-bold flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              CONTINUE <MaterialIcon name="arrow_forward" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
