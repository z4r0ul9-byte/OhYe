import { useState } from 'react'
import JSZip from 'jszip'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import {
  Globe,
  FolderArchive,
  FileText,
  Images,
  Code2,
  Radio,
  CheckCircle2,
  Loader2,
  Smartphone,
  FileArchive,
  Share2,
  Rocket,
  Terminal,
} from 'lucide-react'
import TerminalLog from '../ui/TerminalLog'

const MODE_LABELS = {
  website: { label: 'Situs Web', icon: Globe },
  zip: { label: 'ZIP Offline', icon: FolderArchive },
  docs: { label: 'Dokumen', icon: FileText },
  gallery: { label: 'Galeri', icon: Images },
  html: { label: 'HTML Kustom', icon: Code2 },
  livedev: { label: 'Live Dev', icon: Radio },
}

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export default function Step5({ data }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [savedFileName, setSavedFileName] = useState('')
  
  // State untuk Simulasi Build & Terminal
  const [isBuilding, setIsBuilding] = useState(false)
  const [logs, setLogs] = useState([])

  const modeInfo = MODE_LABELS[data.mode] || { label: '-', icon: Smartphone }
  const ModeIcon = modeInfo.icon

  const handleGenerateZip = async () => {
    setIsGenerating(true)
    setErrorMsg('')

    try {
      const zip = new JSZip()

      // File dasar
      zip.file('package.json', `{\n  "name": "generated-app",\n  "private": true,\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "@capacitor/android": "^6.1.2",\n    "@capacitor/core": "^6.1.2",\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  },\n  "devDependencies": {\n    "@capacitor/cli": "^6.1.2",\n    "@vitejs/plugin-react": "^4.3.2",\n    "typescript": "^5.6.2",\n    "vite": "^5.4.8"\n  }\n}`)
      zip.file('capacitor.config.json', JSON.stringify({ appId: 'com.generated.app', appName: data.appName || 'My App', webDir: 'dist' }, null, 2))
      zip.file('vite.config.js', `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()], base: './' })`)
      zip.file('index.html', `<!doctype html>\n<html lang="en">\n<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${data.appName}</title></head>\n<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>\n</html>`)
      zip.file('src/main.jsx', `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.jsx'\n\nReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)`)

      // App Logic
      let appJsx = ''
      if (data.mode === 'website') {
        appJsx = `export default function App() { return (<iframe src="${data.websiteUrl}" style={{ width: '100vw', height: '100vh', border: 'none' }} />) }`
      } else if (data.mode === 'html') {
        appJsx = `export default function App() { return (<div dangerouslySetInnerHTML={{ __html: \`${(data.html || '').replace(/`/g, '\\`')}\` }} style={{ width: '100vw', height: '100vh' }} />) }`
      } else {
        appJsx = `export default function App() { return (<div style={{ color: 'white', backgroundColor: '#000', height: '100vh', padding: 20 }}><h1>${data.appName}</h1><p>Mode: ${data.mode}</p></div>) }`
      }
      zip.file('src/App.jsx', appJsx)

      // File pendukung
      if (data.appIcon) zip.file('public/icon.png', data.appIcon)
      if (data.mode === 'zip' && data.uploadedFile) {
        const uploadedZip = await JSZip.loadAsync(data.uploadedFile)
        const filePromises = []
        uploadedZip.forEach((relativePath, file) => {
          if (!file.dir) filePromises.push(file.async('blob').then((blob) => zip.file(`public/offline/${relativePath}`, blob)))
        })
        await Promise.all(filePromises)
        appJsx = `export default function App() { return (<iframe src="./offline/index.html" style={{ width: '100vw', height: '100vh', border: 'none' }} />) }`
        zip.file('src/App.jsx', appJsx)
      }

      // Workflow
      zip.file('.github/workflows/build-apk.yml', `name: Build APK\non: [push, workflow_dispatch]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: '20' }\n      - uses: actions/setup-java@v4\n        with: { distribution: 'temurin', java-version: '17' }\n      - uses: android-actions/setup-android@v4.0.4\n      - run: npm install --legacy-peer-deps\n      - run: npm run build\n      - run: npx cap add android || true\n      - run: npx cap sync android\n      - run: chmod +x android/gradlew\n      - run: ./gradlew assembleDebug --no-daemon\n        working-directory: android\n      - uses: actions/upload-artifact@v4\n        with:\n          name: app-debug-apk\n          path: android/app/build/outputs/apk/debug/app-debug.apk`)

      const content = await zip.generateAsync({ type: 'blob' })
      const base64Data = await blobToBase64(content)
      const fileName = `${(data.appName || 'app').replace(/\s+/g, '-').toLowerCase()}-project.zip`

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      })

      setSavedFileName(fileName)

      await Share.share({
        title: 'Simpan Proyek Aplikasi',
        text: 'Pilih "Simpan ke File" untuk menyimpan proyek.',
        url: savedFile.uri,
      })

      setIsDone(true)
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan.')
    } finally {
      setIsGenerating(false)
    }
  }

  // ===== SIMULASI AUTO-BUILD DENGAN TERMINAL LOG =====
  const handleAutoBuild = () => {
    setIsBuilding(true)
    setLogs([])

    const buildSteps = [
      { delay: 500, type: 'info', text: 'Menghubungkan ke GitHub API...' },
      { delay: 1200, type: 'success', text: 'Autentikasi Token Berhasil.' },
      { delay: 2000, type: 'info', text: 'Membuat repositori workspace...' },
      { delay: 2800, type: 'info', text: 'Mengunggah 24 file proyek...' },
      { delay: 4000, type: 'info', text: 'Memicu GitHub Actions workflow...' },
      { delay: 5000, type: 'warning', text: 'Menunggu server build (Estimasi: 2-3 menit)...' },
      { delay: 6500, type: 'info', text: '> setup-node@v4 (Node.js 20)' },
      { delay: 7500, type: 'info', text: '> install dependencies (npm install --legacy-peer-deps)' },
      { delay: 8500, type: 'info', text: '> build web (vite build)' },
      { delay: 9500, type: 'info', text: '> build android (gradlew assembleDebug)' },
      { delay: 11000, type: 'success', text: 'Build Selesai! APK berhasil dibuat.' },
      { delay: 11500, type: 'success', text: 'File APK siap diunduh.' },
    ]

    buildSteps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
            type: step.type,
            text: step.text,
          },
        ])
        if (step.delay === 11500) setIsBuilding(false)
      }, step.delay)
    })
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Ringkasan */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
          {data.appIconPreview ? (
            <img src={data.appIconPreview} alt="Ikon" className="h-full w-full object-cover" />
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

      {/* Tampilkan Terminal Log Jika Sedang Build atau Sudah Selesai Simulasi */}
      {(isBuilding || logs.length > 0) && (
        <div className="animate-fade-in">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Terminal size={16} className="text-primary" />
            Proses Auto-Build
          </div>
          <TerminalLog logs={logs} isBuilding={isBuilding} />
        </div>
      )}

      {/* Tombol Aksi */}
      {!isBuilding && logs.length === 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAutoBuild}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
          >
            <Rocket size={18} />
            Auto-Build APK (Simulasi)
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs">atau</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGenerateZip}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileArchive size={18} />}
            {isGenerating ? 'Mengemas ZIP...' : 'Download Proyek (Manual)'}
          </button>
        </div>
      )}

      {/* Jika Auto-Build Simulasi Selesai */}
      {!isBuilding && logs.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-fade-in">
          <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
          <h3 className="mt-3 text-lg font-semibold text-emerald-400">Simulasi Build Sukses!</h3>
          <p className="mt-1 text-sm text-emerald-200/70">
            Ini adalah tampilan ketika API GitHub sudah terhubung. Tombol download APK akan muncul di sini.
          </p>
          <button className="mt-4 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20">
            Download APK (Placeholder)
          </button>
        </div>
      )}

      {/* Error Manual ZIP */}
      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 text-center">
          {errorMsg}
        </div>
      )}
    </div>
  )
}
