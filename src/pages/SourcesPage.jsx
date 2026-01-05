export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-white">Sources / Credits</div>
        <div className="mt-1 text-sm text-slate-400">Documentation of third-party sources used.</div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="text-sm font-semibold text-white">Libraries</div>
        <div className="mt-3 space-y-3 text-sm text-slate-300">
          <div>
            <div className="font-semibold text-white">React + Vite</div>
            <div className="text-slate-400">Frontend framework + dev tooling.</div>
          </div>
          <div>
            <div className="font-semibold text-white">react-router-dom</div>
            <div className="text-slate-400">Client-side routing.</div>
          </div>
          <div>
            <div className="font-semibold text-white">Tailwind CSS</div>
            <div className="text-slate-400">Utility-first styling.</div>
          </div>
          <div>
            <div className="font-semibold text-white">lucide-react</div>
            <div className="text-slate-400">Icon set.</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="text-sm font-semibold text-white">Assets</div>
        <div className="mt-2 text-sm text-slate-400">
          No external images are bundled by default. Uploaded images are stored in the browser as data URLs.
        </div>
      </div>
    </div>
  )
}
