import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import SearchBar from './SearchBar'
import Footer from './Footer'

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SearchBar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
