import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function AppShell() {
  return (
    <div className="min-h-full">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        <Outlet />
      </main>
    </div>
  )
}
