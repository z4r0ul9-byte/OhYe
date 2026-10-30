import { useEffect, useRef } from 'react'

export default function TerminalLog({ logs, isBuilding }) {
  const containerRef = useRef(null)

  // Auto-scroll ke bawah setiap kali ada log baru
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="rounded-xl border border-zinc-800 bg-black p-4 shadow-inner overflow-hidden flex flex-col h-72">
      {/* Header Terminal */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-2">
        <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
        <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
        <span className="ml-2 text-[10px] font-mono text-zinc-500">build-logger — bash</span>
      </div>

      {/* Area Log */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {logs.length === 0 && (
          <div className="text-zinc-600 italic">Menunggu antrean build...</div>
        )}
        
        {logs.map((log, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-zinc-600 shrink-0">[{log.time}]</span>
            <span 
              className={
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warning' ? 'text-yellow-400' :
                'text-zinc-300'
              }
            >
              {log.text}
            </span>
          </div>
        ))}

        {/* Kursor berkedip saat proses berjalan */}
        {isBuilding && (
          <div className="flex gap-2 text-zinc-300">
            <span className="text-zinc-600 shrink-0">[{new Date().toLocaleTimeString('id-ID', { hour12: false })}]</span>
            <span className="w-2 h-3.5 bg-primary animate-pulse inline-block"></span>
          </div>
        )}
      </div>
    </div>
  )
}
