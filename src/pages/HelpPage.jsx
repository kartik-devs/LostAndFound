import { Link } from 'react-router-dom'

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold text-white">Help</div>
        <div className="mt-1 text-sm text-slate-400">How to use the Campus Lost & Found app.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="1) Browse items">
          Go to <Link to="/items">Found Items</Link>, then use search and category filters to find your item.
        </Card>
        <Card title="2) Report a found item">
          If you found something, go to <Link to="/report">Report Found</Link>, upload a photo, and submit.
          Admin approval is required before it appears publicly.
        </Card>
        <Card title="3) Claim / Inquiry">
          Open an item and submit the claim/inquiry form with your contact details and proof of ownership.
        </Card>
        <Card title="4) Admin review">
          Admins use the <Link to="/admin">Admin Dashboard</Link> to approve/reject postings and manage claims.
        </Card>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="text-sm font-semibold text-white">FAQ</div>
        <div className="mt-4 space-y-4 text-sm text-slate-300">
          <div>
            <div className="font-semibold text-white">Where is my data stored?</div>
            <div className="mt-1 text-slate-400">
              This version uses your browser’s localStorage (no backend server). Data stays on this device/browser.
            </div>
          </div>
          <div>
            <div className="font-semibold text-white">Why do items need approval?</div>
            <div className="mt-1 text-slate-400">
              Approval helps reduce spam and ensures listings are reviewed before becoming visible to everyone.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-slate-400">{children}</div>
    </div>
  )
}
