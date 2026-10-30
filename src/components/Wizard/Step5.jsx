import { useState } from 'react'
import {
  Globe,
  FolderArchive,
  FileText,
  Images,
  Code2,
  Radio,
  CheckCircle2,
  Download,
  Loader2,
  Smartphone,
} from 'lucide-react'

const MODE_LABELS = {
  website: { label: 'Situs Web', icon: Globe },
  zip: { label: 'ZIP Offline', icon: FolderArchive },
  docs: { label: 'Dokumen', icon: FileText },
  gallery: { label: 'Galeri', icon: Images },
  html: { label: 'HTML Kustom', icon: Code2 },
  livedev: { label: 'Live Dev', icon: Radio },
}

export default function Step5({ data }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const modeInfo = MODE_LABELS[data.mode] || { label: '-', icon: Smartphone }
  const ModeIcon = modeInfo.icon

  // Fungsi untuk mengunduh file konfigurasi (JSON)
  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulasi proses build (delay 1.5 detik agar UI terasa natural)
    setTimeout(() => {
      // Siapkan data yang akan disimpan
      const configData = {
        appName: data.appName,
        mode: data.mode,
        websiteUrl: data.websiteUrl,
        html: data.html,
        uploadedFileName: data.uploadedFileName,
        splashColor: data.splashColor,
        themeColor: data.themeColor,
        features: data.features,
        permissions: data.permissions,
        generatedAt: new Date().toISOString(),
      }

      // Buat file JSON dan picu download
      const blob = new Blob([JSON.stringify(configData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.appName.replace(/\s+/g, '-').toLowerCase() || 'app'}-config.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsGenerating(false)
      setIsDone(true)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Ringkasan */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
          {data.appIconPreview ? (
            <img
              src={data.appIconPreview}
              alt="Ikon"
              className="h-full w-full object-cover"
            />
          ) : (
            <Smartphone size={24} className="text-zinc-600" />
          )}
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-white">
          {data.appName || 'Aplikasi Tanpa Nama'}
        </h2>
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-primary">
          <ModeIcon size={14} />
          <span>{modeInfo.label}</span>
        </div>
      </div>

      {/* Detail Ringkasan */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <div className="border-b border-zinc-800/50 px-5 py-3">
          <h3 className="text-sm font-semibold text-zinc-300">Ringkasan Konfigurasi</h3>
        </div>
        <div className="divide-y divide-zinc-800/50 text-sm">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-zinc-500">Mode</span>
            <span className="font-medium text-zinc-200">{modeInfo.label}</span>
          </div>
          {data.mode === 'website' && (
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-zinc-500">URL Target</span>
              <span className="max-w-[60%] truncate font-medium text-zinc-200">
                {data.websiteUrl}
              </span>
            </div>
          )}
          {['zip', 'docs', 'gallery'].includes(data.mode) && (
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-zinc-500">File Upload</span>
              <span className="max-w-[60%] truncate font-medium text-zinc-200">
                {data.uploadedFileName}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-zinc-500">Warna Tema</span>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-zinc-600"
                style={{ backgroundColor: data.themeColor }}
              />
              <span className="font-mono text-xs uppercase text-zinc-200">
                {data.themeColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Generate (Kustom di dalam step agar lebih interaktif) */}
      {!isDone ? (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Memproses Konfigurasi...
            </>
          ) : (
            <>
              <Download size={18} />
              Download Konfigurasi Aplikasi
            </>
          )}
        </button>
      ) : (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-fade-in">
          <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
          <h3 className="mt-3 text-lg font-semibold text-emerald-400">Berhasil!</h3>
          <p className="mt-1 text-sm text-emerald-200/70">
            File konfigurasi (.json) telah diunduh. File ini berisi semua pengaturan aplikasi kamu.
          </p>
        </div>
      )}
    </div>
  )
}
