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
  Rocket,
  Terminal,
  Download,
  AlertCircle,
  Trash2,
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
  
  const [isBuilding, setIsBuilding] = useState(false)
  const [logs, setLogs] = useState([])
  const [apkUrl, setApkUrl] = useState('')
  const [repoInfo, setRepoInfo] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const modeInfo = MODE_LABELS[data.mode] || { label: '-', icon: Smartphone }
  const ModeIcon = modeInfo.icon

  const addLog = (text, type = 'info') => {
    setLogs((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        type,
        text,
      },
    ])
  }

  // --- GENERATE FILE PROYEK ---
  const generateProjectFiles = async () => {
    const zip = new JSZip()

    // 1. PERBAIKAN CAPACITOR CONFIG (Wajib untuk iframe lokal)
    zip.file('capacitor.config.json', JSON.stringify({ 
      appId: 'com.generated.app', 
      appName: data.appName || 'My App', 
      webDir: 'dist',
      server: {
        androidScheme: 'https',
        allowNavigation: ['*']
      },
      android: {
        allowMixedContent: true
      }
    }, null, 2))

    // 2. PACKAGE JSON
    zip.file('package.json', `{\n  "name": "generated-app",\n  "private": true,\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "@capacitor/android": "^6.1.2",\n    "@capacitor/core": "^6.1.2",\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  },\n  "devDependencies": {\n    "@capacitor/cli": "^6.1.2",\n    "@vitejs/plugin-react": "^4.3.2",\n    "typescript": "^5.6.2",\n    "vite": "^5.4.8"\n  }\n}`)
    
    zip.file('vite.config.js', `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()], base: './' })`)
    
    // 3. INDEX HTML (Tambahkan loading text sebagai fallback)
    zip.file('index.html', `<!doctype html>\n<html lang="en">\n<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${data.appName}</title></head>\n<body style="background-color: #000; color: #fff; font-family: sans-serif;">\n<div id="root"><div style="text-align:center; padding: 50px;">Memuat Aplikasi...</div></div>\n<script type="module" src="/src/main.jsx"></script></body>\n</html>`)
    
    zip.file('src/main.jsx', `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.jsx'\n\nReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)`)

    // 4. LOGIKA APP.JSX
    let appJsx = ''
    
    if (data.mode === 'website') {
      // Untuk mode website, gunakan iframe dengan http/https
      appJsx = `export default function App() { return (<iframe src="${data.websiteUrl}" style={{ width: '100vw', height: '100vh', border: 'none', backgroundColor: '#fff' }} allow="geolocation; microphone; camera" />) }`
    } else if (data.mode === 'html') {
      appJsx = `export default function App() { return (<div dangerouslySetInnerHTML={{ __html: \`${(data.html || '').replace(/`/g, '\\`')}\` }} style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }} />) }`
    } else if (data.mode === 'zip' && data.uploadedFile) {
      // PERBAIKAN: Deteksi lokasi index.html secara otomatis (jika di dalam folder)
      const uploadedZip = await JSZip.loadAsync(data.uploadedFile)
      const filePromises = []
      let indexHtmlPath = 'index.html' // Default jika di luar

      uploadedZip.forEach((relativePath, file) => {
        if (!file.dir) {
          if (relativePath.toLowerCase().endsWith('index.html')) {
            indexHtmlPath = relativePath; // Update path jika ditemukan di dalam folder
          }
          filePromises.push(file.async('blob').then((blob) => zip.file(`public/offline/${relativePath}`, blob)))
        }
      })
      await Promise.all(filePromises)
      
      // Gunakan path yang ditemukan
      appJsx = `export default function App() { return (<iframe src="./offline/${indexHtmlPath}" style={{ width: '100vw', height: '100vh', border: 'none', backgroundColor: '#fff' }} />) }`
      zip.file('src/App.jsx', appJsx)
    } else {
      appJsx = `export default function App() { return (<div style={{ color: 'white', backgroundColor: '#000', height: '100vh', padding: 20 }}><h1>${data.appName}</h1><p>Mode: ${data.mode}</p></div>) }`
    }
    
    // Simpan App.jsx utama (untuk mode selain zip)
    if (data.mode !== 'zip') {
      zip.file('src/App.jsx', appJsx)
    }

    if (data.appIcon) zip.file('public/icon.png', data.appIcon)

    return zip
  }

  // --- DOWNLOAD ZIP MANUAL ---
  const handleGenerateZip = async () => {
    setIsGenerating(true)
    setErrorMsg('')

    try {
      const zip = await generateProjectFiles()
      zip.file('.github/workflows/build-apk.yml', `name: Build APK\non: [push, workflow_dispatch]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: '20' }\n      - uses: actions/setup-java@v4\n        with: { distribution: 'temurin', java-version: '17' }\n      - uses: android-actions/setup-android@v4.0.4\n      - run: npm install --legacy-peer-deps\n      - run: npm run build\n      - run: npx cap add android || true\n      - run: npx cap sync android\n      - run: chmod +x android/gradlew\n      - run: ./gradlew assembleDebug --no-daemon\n        working-directory: android\n      - uses: actions/upload-artifact@v4\n        with:\n          name: app-debug-apk\n          path: android/app/build/outputs/apk/debug/app-debug.apk`)

      const content = await zip.generateAsync({ type: 'blob' })
      const base64Data = await blobToBase64(content)
      const fileName = `${(data.appName || 'app').replace(/\s+/g, '-').toLowerCase()}-project.zip`

      const savedFile = await Filesystem.writeFile({ path: fileName, data: base64Data, directory: Directory.Cache })
      setSavedFileName(fileName)
      await Share.share({ title: 'Simpan Proyek Aplikasi', text: 'Pilih "Simpan ke File" untuk menyimpan proyek.', url: savedFile.uri })
      setIsDone(true)
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan.')
    } finally {
      setIsGenerating(false)
    }
  }

  // --- AUTO BUILD VIA GITHUB API ---
  const handleAutoBuild = async () => {
    const token = localStorage.getItem('github_token')
    if (!token) {
      setErrorMsg('Token GitHub belum diatur. Buka menu Pengaturan (ikon roda gigi).')
      return
    }

    setIsBuilding(true)
    setLogs([])
    setApkUrl('')
    setRepoInfo(null)
    setErrorMsg('')

    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }

    try {
      addLog('Memverifikasi Token GitHub...')
      const userRes = await fetch('https://api.github.com/user', { headers })
      if (!userRes.ok) throw new Error('Token tidak valid atau kadaluarsa.')
      const user = await userRes.json()
      const username = user.login

      const repoName = `app-builder-${Date.now()}`
      addLog(`Membuat repositori baru: ${username}/${repoName}...`)
      const repoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST', headers, body: JSON.stringify({ name: repoName, private: true, auto_init: false }),
      })
      if (!repoRes.ok) throw new Error('Gagal membuat repositori. Pastikan Token punya akses "repo".')

      setRepoInfo({ owner: username, repo: repoName })

      addLog('Mengemas proyek ke dalam ZIP...')
      const zip = await generateProjectFiles()
      
      const workflowYml = `name: Build APK
on: [push, workflow_dispatch]
permissions:
  contents: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Unzip Project
        run: unzip project.zip -d .
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - uses: android-actions/setup-android@v4.0.4
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - run: npx cap add android || true
      - run: npx cap sync android
      - run: chmod +x android/gradlew
      - run: ./gradlew assembleDebug --no-daemon
        working-directory: android
      - uses: softprops/action-gh-release@v2
        with:
          tag_name: build-\${{ github.run_number }}
          files: android/app/build/outputs/apk/debug/app-debug.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`

      const zipBase64 = await zip.generateAsync({ type: 'base64' })
      const workflowBase64 = btoa(unescape(encodeURIComponent(workflowYml)))

      addLog('Mengunggah file proyek (project.zip)...')
      const uploadZipRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/project.zip`, {
        method: 'PUT', headers, body: JSON.stringify({ message: 'Upload project zip', content: zipBase64 }),
      })
      if (!uploadZipRes.ok) throw new Error('Gagal mengunggah file proyek.')

      addLog('Mengunggah konfigurasi workflow (Auto-Fix applied)...')
      const uploadWfRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/.github/workflows/build-apk.yml`, {
        method: 'PUT', headers, body: JSON.stringify({ message: 'Add workflow', content: workflowBase64 }),
      })
      if (!uploadWfRes.ok) throw new Error('Gagal mengunggah workflow. Pastikan Token punya akses "workflow".')

      addLog('Semua file berhasil diunggah!', 'success')
      addLog('Menunggu GitHub Actions memulai build...', 'warning')

      let isSuccess = false
      let retries = 0
      const maxRetries = 40

      while (!isSuccess && retries < maxRetries) {
        await new Promise((r) => setTimeout(r, 15000))
        addLog(`Memeriksa status build... (${retries + 1}/${maxRetries})`)
        
        const runsRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/actions/runs`, { headers })
        const runsData = await runsRes.json()
        
        if (runsData.workflow_runs && runsData.workflow_runs.length > 0) {
          const latestRun = runsData.workflow_runs[0]
          
          if (latestRun.status === 'completed') {
            if (latestRun.conclusion === 'success') {
              isSuccess = true
              addLog('Build Sukses! Mempersiapkan link download...', 'success')
              
              const releaseRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/releases/latest`, { headers })
              const releaseData = await releaseRes.json()
              
              if (releaseData.assets && releaseData.assets.length > 0) {
                const apkAsset = releaseData.assets.find((a) => a.name.endsWith('.apk'))
                if (apkAsset) {
                  setApkUrl(apkAsset.browser_download_url)
                  addLog('APK Siap diunduh!', 'success')
                }
              }
            } else {
              addLog(`Build Gagal. Kesimpulan: ${latestRun.conclusion}`, 'error')
              setErrorMsg('Build gagal di server GitHub. Periksa log lengkap di repositori Anda.')
              break
            }
          }
        }
        retries++
      }
    } catch (err) {
      addLog(err.message, 'error')
      setErrorMsg(err.message)
    } finally {
      setIsBuilding(false)
    }
  }

  const handleDeleteRepo = async () => {
    if (!repoInfo) return
    const token = localStorage.getItem('github_token')
    if (!token) return

    setIsDeleting(true)
    try {
      const res = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
      })
      if (res.ok) {
        addLog('Repositori berhasil dihapus dari GitHub.', 'success')
        setRepoInfo(null)
      } else {
        addLog('Gagal menghapus repositori.', 'error')
      }
    } catch (err) {
      addLog('Terjadi kesalahan saat menghapus repo.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
          {data.appIconPreview ? <img src={data.appIconPreview} alt="Ikon" className="h-full w-full object-cover" /> : <Smartphone size={24} className="text-zinc-600" />}
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-white">{data.appName || 'Aplikasi Tanpa Nama'}</h2>
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-primary">
          <ModeIcon size={14} /> <span>{modeInfo.label}</span>
        </div>
      </div>

      {(isBuilding || logs.length > 0) && (
        <div className="animate-fade-in">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Terminal size={16} className="text-primary" /> Proses Auto-Build
          </div>
          <TerminalLog logs={logs} isBuilding={isBuilding} />
        </div>
      )}

      {!isBuilding && logs.length === 0 && (
        <div className="space-y-3">
          <button type="button" onClick={handleAutoBuild} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600">
            <Rocket size={18} /> Auto-Build APK (Via GitHub)
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs">atau</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <button type="button" onClick={handleGenerateZip} disabled={isGenerating} className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50">
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <FileArchive size={18} />}
            {isGenerating ? 'Mengemas ZIP...' : 'Download Proyek (Manual)'}
          </button>
        </div>
      )}

      {!isBuilding && apkUrl && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-fade-in">
          <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
          <h3 className="mt-3 text-lg font-semibold text-emerald-400">Build Sukses!</h3>
          <p className="mt-1 mb-4 text-sm text-emerald-200/70">APK aplikasi Anda sudah berhasil dirakit oleh GitHub.</p>
          
          <div className="space-y-3">
            <a href={apkUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600">
              <Download size={18} /> Download APK
            </a>

            {repoInfo && (
              <button onClick={handleDeleteRepo} disabled={isDeleting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3.5 text-sm font-semibold text-red-400 border border-red-500/20 transition hover:bg-red-500/20 disabled:opacity-50">
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                {isDeleting ? 'Menghapus Repositori...' : 'Hapus Repositori dari GitHub'}
              </button>
            )}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 text-center">
          <AlertCircle size={20} /> <span>{errorMsg}</span>
        </div>
      )}
    </div>
  )
}
