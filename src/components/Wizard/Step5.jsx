import { useState } from 'react'
import JSZip from 'jszip'
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
  FileArchive,
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
  const [errorMsg, setErrorMsg] = useState('')

  const modeInfo = MODE_LABELS[data.mode] || { label: '-', icon: Smartphone }
  const ModeIcon = modeInfo.icon

  const handleGenerate = async () => {
    setIsGenerating(true)
    setErrorMsg('')

    try {
      const zip = new JSZip()

      // 1. package.json untuk proyek yang di-generate
      zip.file(
        'package.json',
        `{
  "name": "generated-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@capacitor/android": "^6.1.2",
    "@capacitor/core": "^6.1.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.1.2",
    "@vitejs/plugin-react": "^4.3.2",
    "typescript": "^5.6.2",
    "vite": "^5.4.8"
  }
}`
      )

      // 2. capacitor.config.json
      zip.file(
        'capacitor.config.json',
        JSON.stringify(
          {
            appId: 'com.generated.app',
            appName: data.appName || 'My App',
            webDir: 'dist',
          },
          null,
          2
        )
      )

      // 3. vite.config.js
      zip.file(
        'vite.config.js',
        `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
})`
      )

      // 4. index.html
      zip.file(
        'index.html',
        `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${data.appName || 'App'}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
      )

      // 5. src/main.jsx
      zip.file(
        'src/main.jsx',
        `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`
      )

      // 6. src/App.jsx (Dinamis berdasarkan pilihan mode)
      let appJsx = ''
      if (data.mode === 'website') {
        appJsx = `export default function App() {
  return (
    <iframe
      src="${data.websiteUrl}"
      style={{ width: '100vw', height: '100vh', border: 'none', margin: 0, padding: 0 }}
      allow="geolocation; microphone; camera; midi; encrypted-media; fullscreen"
    />
  )
}`
      } else if (data.mode === 'html') {
        const escapedHtml = data.html.replace(/`/g, '\\`')
        appJsx = `export default function App() {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} 
      style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }} 
    />
  )
}`
      } else {
        appJsx = `export default function App() {
  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#000', height: '100vh' }}>
      <h1>${data.appName || 'Aplikasi'}</h1>
      <p>Mode: ${data.mode}</p>
      <p>File: ${data.uploadedFileName || '-'}</p>
      <p>File yang di-upload (${data.uploadedFileName || 'file'}) perlu dimasukkan secara manual ke folder public/ agar dapat diakses secara offline.</p>
    </div>
  )
}`
      }
      zip.file('src/App.jsx', appJsx)

      // 7. .github/workflows/build-apk.yml (Menggunakan v4.0.4 untuk Android SDK)
      zip.file(
        '.github/workflows/build-apk.yml',
        `name: Build APK
on:
  push:
    branches: [main, master]
  workflow_dispatch:
permissions:
  contents: write
jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Setup Java 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Setup Android SDK
        uses: android-actions/setup-android@v4.0.4
      - name: Install dependencies
        run: npm install
      - name: Build web (Vite)
        run: npm run build
      - name: Add Android platform
        run: npx cap add android || true
      - name: Sync Capacitor
        run: npx cap sync android
      - name: Make gradlew executable
        run: chmod +x android/gradlew
      - name: Build Debug APK
        working-directory: android
        run: ./gradlew assembleDebug --no-daemon
      - name: Upload APK as artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
      - name: Create GitHub Release
        if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        uses: softprops/action-gh-release@v2
        with:
          tag_name: build-\${{ github.run_number }}
          name: Build #\${{ github.run_number }}
          files: android/app/build/outputs/apk/debug/app-debug.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`
      )

      // 8. Generate ZIP dan picu download
      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(data.appName || 'app')
        .replace(/\s+/g, '-')
        .toLowerCase()}-project.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsDone(true)
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Terjadi kesalahan saat membuat file ZIP.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
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

      {/* Tombol Generate */}
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
              Mengemas Proyek (.zip)...
            </>
          ) : (
            <>
              <FileArchive size={18} />
              Download Proyek (ZIP)
            </>
          )}
        </button>
      ) : (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-fade-in">
          <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
          <h3 className="mt-3 text-lg font-semibold text-emerald-400">Berhasil Di-generate!</h3>
          <p className="mt-1 text-sm text-emerald-200/70">
            File ZIP berisi proyek aplikasimu sudah diunduh. Silakan cari file tersebut di folder <b>Download</b> HP kamu.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 text-center">
          {errorMsg}
        </div>
      )}
    </div>
  )
}
