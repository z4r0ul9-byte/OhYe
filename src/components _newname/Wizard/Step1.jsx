import { useRef } from 'react'
import {
  Globe,
  FolderArchive,
  FileText,
  Images,
  Code2,
  Radio,
  Upload,
  X,
  Check,
  Link as LinkIcon,
} from 'lucide-react'

const MODES = [
  { id: 'website', label: 'Situs Web', desc: 'Wrap URL jadi aplikasi', icon: Globe },
  { id: 'zip',     label: 'ZIP Offline', desc: 'Bundle HTML/CSS/JS offline', icon: FolderArchive },
  { id: 'docs',    label: 'Dokumen', desc: 'PDF / DOCX / PPTX', icon: FileText },
  { id: 'gallery', label: 'Galeri', desc: 'Kumpulan gambar', icon: Images },
  { id: 'html',    label: 'HTML Kustom', desc: 'Tulis HTML langsung', icon: Code2 },
  { id: 'livedev', label: 'Live Dev', desc: 'Preview live editor', icon: Radio },
]

export default function Step1({ data, update }) {
  const fileInputRef = useRef(null)
  const iconInputRef = useRef(null)

  const needsUrl = data.mode === 'website'
  const needsHtml = data.mode === 'html'
  const needsFile = ['zip', 'docs', 'gallery'].includes(data.mode)
  const needsNone = data.mode === 'livedev'

  const acceptForMode =
    data.mode === 'zip' ? '.zip' :
    data.mode === 'docs' ? '.pdf,.doc,.docx,.ppt,.pptx' :
    data.mode === 'gallery' ? 'image/*' : ''

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    update({
      uploadedFile: file,
      uploadedFileName: file.name,
      uploadedFileSize: file.size,
    })
  }

  const handleIcon = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      update({ appIcon: file, appIconPreview: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">
      {/* 01. Mode Konversi */}
      <section>
        <SectionHeader
          num="01"
          title="Mode Konversi"
          desc="Pilih bagaimana aplikasi kamu akan dibuat."
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {MODES.map((m) => {
            const Icon = m.icon
            const active = data.mode === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => update({ mode: m.id })}
                className={`relative flex flex-col items-start gap-2.5 rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/60'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                <div
                  className={`rounded-lg p-2 transition-colors ${
                    active ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{m.label}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-zinc-500">{m.desc}</div>
                </div>
                {active && (
                  <div className="absolute right-2 top-2 rounded-full bg-primary p-0.5 text-white">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* 02a. URL Situs Web */}
      {needsUrl && (
        <section>
          <SectionHeader
            num="02"
            title="URL Situs Web"
            desc="Alamat web yang akan dibungkus jadi aplikasi."
          />
          <div className="relative">
            <LinkIcon
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="url"
              value={data.websiteUrl}
              onChange={(e) => update({ websiteUrl: e.target.value })}
              placeholder="https://contoh.com"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </section>
      )}

      {/* 02b. Textarea HTML */}
      {needsHtml && (
        <section>
          <SectionHeader
            num="02"
            title="Kode HTML"
            desc="Paste kode HTML lengkap di sini."
          />
          <textarea
            value={data.html}
            onChange={(e) => update({ html: e.target.value })}
            rows={12}
            spellCheck={false}
            placeholder={'<!DOCTYPE html>\n<html>\n  <body>\n    Halo Dunia\n  </body>\n</html>'}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xs font-mono leading-relaxed text-zinc-200 placeholder-zinc-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </section>
      )}

      {/* 02c. Upload File (zip/docs/gallery) */}
      {needsFile && (
        <section>
          <SectionHeader
            num="02"
            title="Upload File"
            desc={
              data.mode === 'zip'
                ? 'Unggah file ZIP berisi HTML/CSS/JS kamu.'
                : data.mode === 'docs'
                  ? 'Unggah dokumen PDF/DOCX/PPTX.'
                  : 'Unggah satu atau lebih gambar (bisa diulang setelah ini).'
            }
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptForMode}
            onChange={handleFile}
            className="hidden"
          />
          <div
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
              data.uploadedFileName
                ? 'border-primary/40 bg-primary/5'
                : 'border-zinc-800 hover:border-primary/50'
            }`}
          >
            {data.uploadedFileName ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={20} className="shrink-0 text-primary" />
                <div className="min-w-0 text-left">
                  <div className="truncate text-sm font-medium text-white">
                    {data.uploadedFileName}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {((data.uploadedFileSize || 0) / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      uploadedFile: null,
                      uploadedFileName: null,
                      uploadedFileSize: null,
                    })
                  }
                  className="ml-2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400"
                  aria-label="Hapus file"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto flex flex-col items-center gap-2 text-zinc-500 transition hover:text-primary"
              >
                <Upload size={28} />
                <span className="text-sm">Ketuk untuk pilih file</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* 02d. Info Live Dev */}
      {needsNone && (
        <section>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm leading-relaxed text-zinc-400">
            Mode <span className="font-semibold text-primary">Live Dev</span> akan menyediakan
            editor kode langsung di step berikutnya. Untuk sekarang, kamu hanya perlu mengisi nama
            dan ikon aplikasi.
          </div>
        </section>
      )}

      {/* 03. Nama Aplikasi */}
      <section>
        <SectionHeader
          num="03"
          title="Nama Aplikasi"
          desc="Nama yang tampil di home screen Android."
        />
        <input
          type="text"
          value={data.appName}
          onChange={(e) => update({ appName: e.target.value })}
          placeholder="Contoh: Toko Saya"
          maxLength={40}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="mt-1.5 text-right text-[11px] tabular-nums text-zinc-600">
          {data.appName.length}/40
        </div>
      </section>

      {/* 04. Ikon Aplikasi */}
      <section>
        <SectionHeader
          num="04"
          title="Ikon Aplikasi"
          desc="PNG persegi, minimal 512×512px."
        />
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            {data.appIconPreview ? (
              <img
                src={data.appIconPreview}
                alt="Ikon aplikasi"
                className="h-full w-full object-cover"
              />
            ) : (
              <Upload size={20} className="text-zinc-600" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={iconInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleIcon}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => iconInputRef.current?.click()}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              {data.appIconPreview ? 'Ganti Ikon' : 'Pilih Ikon'}
            </button>
            {data.appIconPreview && (
              <button
                type="button"
                onClick={() => update({ appIcon: null, appIconPreview: null })}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:text-red-400"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ num, title, desc }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="mt-0.5 font-mono text-[11px] text-primary/60">{num}</div>
      <div>
        <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
        {desc && <p className="mt-0.5 text-sm text-zinc-500">{desc}</p>}
      </div>
    </div>
  )
}
