import { Construction } from 'lucide-react'

/**
 * Placeholder untuk step 2–5. Akan diganti saat sesi fitur berikutnya.
 */
export default function PlaceholderStep({ step, title }) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-10 text-center">
      <div className="mx-auto grid w-fit place-items-center rounded-2xl bg-primary/10 p-4 text-primary ring-1 ring-primary/20">
        <Construction size={28} />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-white">
        Step {step}: {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        Fitur ini akan dibangun pada sesi berikutnya. Untuk sekarang, kamu bisa lanjut ke step
        berikutnya untuk melihat alur wizard.
      </p>
    </div>
  )
}
