import { useState } from 'react'
import { Palette, Smartphone, Layout, Check } from 'lucide-react'

const COLOR_PRESETS = [
  { name: 'Ungu Default', hex: '#5c5cff' },
  { name: 'Biru Laut', hex: '#0ea5e9' },
  { name: 'Hijau Emerald', hex: '#10b981' },
  { name: 'Merah Rose', hex: '#f43f5e' },
  { name: 'Oranye', hex: '#f97316' },
  { name: 'Kuning', hex: '#eab308' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Abu Gelap', hex: '#3f3f46' },
]

export default function Step2({ data, update }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 01. Splash Screen */}
      <section>
        <SectionHeader
          num="01"
          title="Splash Screen"
          desc="Latar belakang layar loading saat aplikasi pertama dibuka."
        />
        
        <div className="space-y-4">
          {/* Custom Color Picker */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-700 shadow-inner"
              style={{ backgroundColor: data.splashColor }}
            >
              <input
                type="color"
                value={data.splashColor}
                onChange={(e) => update({ splashColor: e.target.value })}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                title="Pilih Warna Kustom"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Warna Kustom</div>
              <div className="mt-1 font-mono text-xs uppercase text-zinc-400">
                {data.splashColor}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800 px-3 py-1.5 text-[10px] font-medium text-zinc-400">
              Ketuk kotak warna
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <div className="mb-2 text-xs font-medium text-zinc-500">Atau pilih warna cepat:</div>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => update({ splashColor: color.hex })}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 transition ${
                    data.splashColor === color.hex
                      ? 'border-primary bg-primary/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className="h-6 w-6 rounded-full shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300">
                    {color.name.split(' ')[0]}
                  </span>
                  {data.splashColor === color.hex && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5 text-white">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02. Warna Tema */}
      <section>
        <SectionHeader
          num="02"
          title="Warna Tema"
          desc="Warna utama untuk tombol, tautan, dan elemen aktif di dalam aplikasi."
        />
        
        <div className="space-y-4">
          {/* Custom Color Picker */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-700 shadow-inner"
              style={{ backgroundColor: data.themeColor }}
            >
              <input
                type="color"
                value={data.themeColor}
                onChange={(e) => update({ themeColor: e.target.value })}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                title="Pilih Warna Kustom"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Warna Kustom</div>
              <div className="mt-1 font-mono text-xs uppercase text-zinc-400">
                {data.themeColor}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800 px-3 py-1.5 text-[10px] font-medium text-zinc-400">
              Ketuk kotak warna
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <div className="mb-2 text-xs font-medium text-zinc-500">Atau pilih warna cepat:</div>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => update({ themeColor: color.hex })}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 transition ${
                    data.themeColor === color.hex
                      ? 'border-primary bg-primary/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className="h-6 w-6 rounded-full shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300">
                    {color.name.split(' ')[0]}
                  </span>
                  {data.themeColor === color.hex && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5 text-white">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03. Live Preview */}
      <section>
        <SectionHeader
          num="03"
          title="Pratinjau Tampilan"
          desc="Gambaran kasar bagaimana aplikasimu akan terlihat."
        />
        
        <div className="mx-auto max-w-[280px] overflow-hidden rounded-[2rem] border-[6px] border-zinc-800 bg-zinc-950 shadow-2xl">
          {/* Splash Screen Mockup */}
          <div
            className="flex h-48 flex-col items-center justify-center gap-3 transition-colors duration-300"
            style={{ backgroundColor: data.splashColor }}
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
              {data.appIconPreview ? (
                <img
                  src={data.appIconPreview}
                  alt="Ikon"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <Smartphone size={24} className="text-white" />
              )}
            </div>
            <div className="text-sm font-bold text-white shadow-sm">
              {data.appName || 'Aplikasi Saya'}
            </div>
            <div className="mt-2 h-1 w-8 animate-pulse rounded-full bg-white/50" />
          </div>

          {/* App Content Mockup */}
          <div className="bg-zinc-950 p-4 pb-6">
            <div className="mb-4 h-2 w-1/3 rounded-full bg-zinc-800" />
            <div className="mb-2 h-2 w-full rounded-full bg-zinc-800/50" />
            <div className="mb-6 h-2 w-4/5 rounded-full bg-zinc-800/50" />
            
            <div className="flex gap-2">
              <button
                className="flex-1 rounded-lg py-2 text-xs font-semibold text-white transition-colors duration-300"
                style={{ backgroundColor: data.themeColor }}
              >
                Tombol Utama
              </button>
              <button className="flex-1 rounded-lg border border-zinc-800 py-2 text-xs font-semibold text-zinc-300">
                Batal
              </button>
            </div>
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
