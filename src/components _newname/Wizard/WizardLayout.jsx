import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react'
import StepIndicator from './StepIndicator'

/**
 * Shell utama wizard: header sticky, step indicator, konten, footer fixed.
 * Tema dark + aksen primary (#5c5cff).
 */
export default function WizardLayout({
  steps,
  currentStep,
  onPrev,
  onNext,
  canNext,
  isLast,
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Smartphone size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight">App Builder</div>
            <div className="text-[11px] text-zinc-500">Web-to-App Generator</div>
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-2 pt-5">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Konten step */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-4 animate-fade-in">
        {children}
      </main>

      {/* Footer aksi */}
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={16} />
            Kembali
          </button>

          <div className="text-[11px] font-medium tabular-nums text-zinc-500">
            {currentStep} / {steps.length}
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
          >
            {isLast ? 'Generate' : 'Lanjut'}
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  )
}
