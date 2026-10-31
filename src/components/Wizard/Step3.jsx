import {
  WifiOff,
  RefreshCw,
  EyeOff,
  Maximize,
  ZoomIn,
  ExternalLink,
} from 'lucide-react'

const FEATURES_LIST = [
  { id: 'offline', title: 'Offline Support', desc: 'Simpan cache agar aplikasi bisa dibuka tanpa internet.', icon: WifiOff },
  { id: 'pullToRefresh', title: 'Pull-to-Refresh', desc: 'Tarik layar ke bawah untuk memuat ulang halaman.', icon: RefreshCw },
  { id: 'hideScrollbar', title: 'Sembunyikan Scrollbar', desc: 'Hilangkan garis gulir agar tampilan lebih bersih.', icon: EyeOff },
  { id: 'fullscreen', title: 'Mode Fullscreen', desc: 'Sembunyikan status bar dan navigasi bawaan Android.', icon: Maximize },
  { id: 'zoomControl', title: 'Kontrol Zoom', desc: 'Izinkan pengguna melakukan zoom in / zoom out.', icon: ZoomIn },
  { id: 'externalLinks', title: 'Tautan Luar', desc: 'Buka link ke domain lain menggunakan browser bawaan HP.', icon: ExternalLink },
]

export default function Step3({ data, update }) {
  const handleToggle = (featureId) => {
    update({
      features: {
        ...data.features,
        [featureId]: !data.features[featureId],
      },
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-semibold tracking-tight text-white mb-1">
          Fitur Tambahan
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          Pilih fitur yang ingin diaktifkan di dalam aplikasimu.
        </p>

        <div className="space-y-3">
          {FEATURES_LIST.map((feature) => {
            const Icon = feature.icon
            const isActive = !!data.features[feature.id]

            return (
              // Menggunakan <label> agar area klik 100% berfungsi di Android WebView
              <label
                key={feature.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                  isActive
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg p-2 transition-colors ${
                      isActive ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                      {feature.title}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                      {feature.desc}
                    </div>
                  </div>
                </div>

                {/* Hidden checkbox untuk aksesibilitas & event native */}
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isActive}
                  onChange={() => handleToggle(feature.id)}
                />

                {/* Custom Toggle Switch (Hanya Visual) */}
                <div
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-primary' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
