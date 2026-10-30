# App Builder — Web-to-App Generator

Aplikasi React + Vite + Tailwind CSS yang di-wrap jadi APK Android via **Capacitor**, di-build otomatis lewat **GitHub Actions**.

## 🎯 Status Proyek

- ✅ **Step 1 — Aplikasi** (selesai): pilih mode konversi, upload file/URL/HTML, nama app, ikon app
- 🚧 Step 2 — Tampilan (placeholder)
- 🚧 Step 3 — Fitur (placeholder)
- 🚧 Step 4 — Izin (placeholder)
- 🚧 Step 5 — Selesai (placeholder)

## 📂 Struktur File

```

.
├── .github/workflows/build-apk.yml   # Auto-build APK via GitHub Actions
├── index.html
├── package.json
├── vite.config.js                    # base: './' untuk WebView Android
├── tailwind.config.js                # tema dark + aksen #5c5cff
├── postcss.config.js
├── capacitor.config.ts               # config wrap Android
└── src/
├── main.jsx
├── index.css
├── App.jsx                       # state wizard + navigasi 5 step
└── components/Wizard/
├── WizardLayout.jsx          # shell: header, indikator, footer
├── StepIndicator.jsx         # 5 bulatan progress
├── Step1.jsx                 # ⭐ fitur utama Step 1
└── PlaceholderStep.jsx       # step 2–5 sementara

```

## 🛠️ Cara Menjalankan

### Mode Development (opsional)
```bash
npm install
npm run dev
```

### Build APK (Otomatis via GitHub)

Cukup **push ke branch `main`** → GitHub Actions akan otomatis build APK.
Download APK dari tab **Actions → Build APK → Artifacts** atau dari tab **Releases**.

## 📱 Cara Install APK ke HP Android

1. Buka link download APK di browser HP.
2. Buka file `.apk` dari notification / file manager.
3. Jika muncul peringatan "Install from unknown source" → aktifkan izin untuk browser/file manager.
4. Ketuk **Install** → buka aplikasi.

## ⚠️ Catatan Teknis

- `android/` **TIDAK** di-commit (ada di `.gitignore`). CI membuatnya otomatis via `npx cap add android`.
- Kalau nanti butuh custom icon/splash Android, kita akan generate asset-nya di sesi berikutnya.
- appId `com.appbuilder.generator` bisa diganti di `capacitor.config.ts` (harus unik).

