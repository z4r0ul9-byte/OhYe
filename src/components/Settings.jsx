import { useState, useEffect } from 'react'
import { ArrowLeft, Key, Save, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function Settings({ onClose }) {
  const [token, setToken] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // Muat token saat halaman dibuka
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('github_token', token.trim())
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-zinc-100 animate-fade-in">
      {/* Header Halaman Settings */}
      <header className="flex items-center gap-4 border-b border-zinc-900 px-4 py-4 bg-zinc-950/85 backdrop-blur-md">
        <button
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold tracking-tight">Pengaturan</h1>
          <p className="text-[11px] text-zinc-500">Konfigurasi API GitHub</p>
        </div>
      </header>

      {/* Konten Utama */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Info Card */}
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="text-primary mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-primary">Personal Access Token</h3>
              <p className="mt-1 text-xs text-primary/80 leading-relaxed">
                Untuk mengaktifkan fitur Auto-Build, aplikasi memerlukan Token akses dari akun GitHub Anda. Token ini hanya disimpan secara lokal di HP Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Form Input Token */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Key size={16} className="text-zinc-500" />
            GitHub Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
          />
          <p className="mt-2 text-[11px] text-zinc-500 leading-snug">
            Pastikan token memiliki izin (scope) <b>repo</b> dan <b>workflow</b>. Dapatkan token secara gratis di menu <i>Developer Settings</i> akun GitHub Anda.
          </p>
        </div>

        {/* Tombol Simpan */}
        <button
          onClick={handleSave}
          disabled={!token.trim() || isSaved}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition ${
            isSaved ? 'bg-emerald-500' : 'bg-primary hover:bg-primary/90 disabled:opacity-50'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 size={18} />
              Tersimpan!
            </>
          ) : (
            <>
              <Save size={18} />
              Simpan Pengaturan
            </>
          )}
        </button>
      </div>
    </div>
  )
}
