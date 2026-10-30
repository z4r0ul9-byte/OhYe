import { Camera, MapPin, HardDrive, Bell, Mic, Contact, Check } from 'lucide-react'

const PERMISSIONS_LIST = [
  {
    id: 'camera',
    title: 'Kamera',
    desc: 'Untuk memotret atau memindai QR Code.',
    icon: Camera,
  },
  {
    id: 'location',
    title: 'Lokasi (GPS)',
    desc: 'Untuk fitur peta, arah, atau lokasi saat ini.',
    icon: MapPin,
  },
  {
    id: 'storage',
    title: 'Penyimpanan',
    desc: 'Untuk menyimpan atau mengunggah file.',
    icon: HardDrive,
  },
  {
    id: 'notification',
    title: 'Notifikasi',
    desc: 'Untuk mengirim pesan atau pengingat.',
    icon: Bell,
  },
  {
    id: 'microphone',
    title: 'Mikrofon',
    desc: 'Untuk merekam suara atau panggilan audio.',
    icon: Mic,
  },
  {
    id: 'contacts',
    title: 'Kontak',
    desc: 'Untuk membaca daftar kontak di HP.',
    icon: Contact,
  },
]

export default function Step4({ data, update }) {
  const handleToggle = (permissionId) => {
    const currentPermissions = data.permissions || []
    let newPermissions

    if (currentPermissions.includes(permissionId)) {
      newPermissions = currentPermissions.filter((id) => id !== permissionId)
    } else {
      newPermissions = [...currentPermissions, permissionId]
    }

    update({ permissions: newPermissions })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-white mb-1">
            Izin Akses
          </h2>
          <p className="text-sm text-zinc-500">
            Pilih izin yang dibutuhkan oleh fitur aplikasimu. Pengguna akan dimintai persetujuan saat aplikasi pertama kali dibuka.
          </p>
        </div>

        <div className="space-y-3">
          {PERMISSIONS_LIST.map((permission) => {
            const Icon = permission.icon
            const isChecked = (data.permissions || []).includes(permission.id)

            return (
              <div
                key={permission.id}
                onClick={() => handleToggle(permission.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                  isChecked
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg p-2 transition-colors ${
                      isChecked ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isChecked ? 'text-white' : 'text-zinc-300'}`}>
                      {permission.title}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                      {permission.desc}
                    </div>
                  </div>
                </div>

                {/* Custom Checkbox */}
                <div
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                    isChecked
                      ? 'border-primary bg-primary text-white'
                      : 'border-zinc-600 bg-transparent text-transparent'
                  }`}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
