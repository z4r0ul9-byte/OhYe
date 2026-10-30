/**
 * Indikator progres 5 langkah. Garis penghubung otomatis mewarnai
 * sesuai status langkah (done = primary, belum = zinc).
 */
export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-start">
      {steps.map((step, index) => {
        const isDone = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <div key={step.id} className="relative flex flex-1 flex-col items-center">
            {/* Garis penghubung ke step berikutnya */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-1/2 top-4 h-px w-full transition-colors duration-300 ${
                  isDone ? 'bg-primary/50' : 'bg-zinc-800'
                }`}
              />
            )}

            {/* Lingkaran nomor */}
            <div
              className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-lg shadow-primary/40'
                  : isDone
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-500'
              }`}
            >
              {step.id}
            </div>

            {/* Label */}
            <div
              className={`mt-1.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-white' : isDone ? 'text-primary' : 'text-zinc-600'
              }`}
            >
              {step.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
