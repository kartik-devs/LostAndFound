import { useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LogIn, LogOut, Shield, User, Settings, Sparkles, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { currentUser, logout } = useAuth()

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/items', label: 'Found Items' },
      { to: '/report', label: 'Report Found' },
      { to: '/help', label: 'Help' },
      { to: '/reviews', label: 'Reviews' },
      { to: '/sources', label: 'Sources' },
    ],
    [],
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
      {/* Main navbar */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo section with enhanced styling */}
        <Link to="/" className="group flex items-center gap-3 transition-transform hover:scale-105">
          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-2xl school-gradient text-lg font-bold text-white shadow-lg ring-2 ring-white/10">
              LF
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              Campus Lost & Found
            </div>
            <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
              Report and reclaim faster
            </div>
          </div>
        </Link>

        {/* Navigation links - centered */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/60 hover:text-white hover:scale-105',
                  isActive && 'bg-school-blue text-white shadow-lg shadow-blue-900/25',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User actions section */}
        <div className="flex items-center gap-3">
          {/* Admin/Settings for logged in users */}
          {currentUser?.role === 'admin' && (
            <div className="hidden items-center gap-2 md:flex">
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700/60 hover:border-slate-600',
                    isActive && 'bg-school-blue border-school-blue text-white shadow-lg shadow-blue-900/25',
                  )
                }
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </NavLink>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700/60 hover:border-slate-600',
                    isActive && 'bg-school-red border-school-red text-white shadow-lg shadow-red-900/25',
                  )
                }
              >
                <Shield className="h-4 w-4" />
                Admin
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700/60 hover:border-slate-600',
                    isActive && 'bg-school-blue border-school-blue text-white shadow-lg shadow-blue-900/25',
                  )
                }
              >
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
            </div>
          )}

          {/* User profile or auth buttons */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    'hidden items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700/60 hover:border-slate-600 md:flex',
                    isActive && 'bg-school-blue border-school-blue text-white shadow-lg shadow-blue-900/25',
                  )
                }
              >
                <User className="h-4 w-4" />
                <span className="max-w-24 truncate">{currentUser.name}</span>
              </NavLink>
              <button
                onClick={logout}
                className="group flex items-center gap-2 rounded-xl bg-school-red px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition-all hover:opacity-90 hover:scale-105 hover:shadow-red-900/40"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="group flex items-center gap-2 rounded-xl border border-slate-600/50 bg-slate-800/60 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-slate-200 backdrop-blur-sm transition-all hover:bg-slate-700/80 hover:border-slate-500 hover:scale-105 hover:shadow-lg min-w-[100px] sm:min-w-[120px] justify-center"
              >
                <LogIn className="h-4 w-4 transition-transform group-hover:scale-110" />
                Log in
              </Link>
              <Link
                to="/signup"
                className="group flex items-center justify-center gap-2 rounded-xl school-gradient px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition-all hover:scale-105 hover:shadow-red-900/40 min-w-[100px] sm:min-w-[120px]"
              >
                <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="border-t border-slate-800/50 bg-slate-900/60 backdrop-blur-sm lg:hidden">
        <div className="mx-auto w-full max-w-7xl px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white',
                    isActive && 'bg-school-blue text-white shadow-md',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {currentUser?.role === 'admin' && (
              <>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white',
                      isActive && 'bg-school-blue text-white shadow-md',
                    )
                  }
                >
                  Analytics
                </NavLink>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white',
                      isActive && 'bg-school-red text-white shadow-md',
                    )
                  }
                >
                  Admin
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white',
                      isActive && 'bg-school-blue text-white shadow-md',
                    )
                  }
                >
                  Settings
                </NavLink>
              </>
            )}
            {currentUser && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white',
                    isActive && 'bg-school-blue text-white shadow-md',
                  )
                }
              >
                Profile
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
