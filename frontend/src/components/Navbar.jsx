import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const { isLoggedIn, user, logout }  = useUser();

  const links = [
    { label: 'Home',     to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Gallery',  to: '/gallery' },
    { label: 'Contact',  to: '/contact' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  // Initials avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧹</span>
            <span className="text-white font-bold text-xl tracking-tight">SparkleClean</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                {l.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/booking')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Book Now
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm truncate">{user?.name}</p>
                        <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/booking"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        📅 Book a Service
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 px-4 pb-4 space-y-1">
          {isLoggedIn && (
            <div className="flex items-center gap-3 py-3 border-b border-slate-700 mb-2">
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.email}</p>
              </div>
            </div>
          )}

          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-2 font-medium text-sm"
            >
              {l.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <Link
                to="/booking"
                onClick={() => setMenuOpen(false)}
                className="block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-lg text-center transition-colors text-sm mt-2"
              >
                Book Now
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-400 hover:text-red-300 py-2 font-medium text-sm"
              >
                🚪 Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-2 font-medium text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-lg text-center transition-colors text-sm mt-1"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
