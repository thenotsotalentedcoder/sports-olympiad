import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../utils/auth';

export default function AppShell({ user, children, breadcrumb }) {
  const navigate  = useNavigate();
  const isAdmin   = user?.type === 'admin';
  const initials  = isAdmin ? 'AD' : (user?.name?.slice(0, 2)?.toUpperCase() || 'UN');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 sticky top-0 z-40 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/university/dashboard')}
              className="flex items-center gap-2.5 flex-shrink-0 group cursor-pointer"
              aria-label="Go to dashboard"
            >
              <div className="w-8 h-8 bg-aku-600 rounded-xl flex items-center justify-center group-hover:bg-aku-700 transition-colors duration-200">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="font-display text-base text-surface-900 group-hover:text-aku-700 transition-colors duration-200 hidden sm:inline">
                AKU OLYMPIAD
              </span>
            </button>
            {breadcrumb && (
              <>
                <svg className="w-4 h-4 text-surface-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-sm text-surface-600 font-medium truncate">{breadcrumb}</span>
              </>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-full">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-2xs font-bold ${isAdmin ? 'bg-amber-500' : 'bg-aku-600'}`}>
                {initials[0]}
              </div>
              <span className="text-xs font-semibold text-surface-700 max-w-[140px] truncate">
                {isAdmin ? 'Administrator' : user?.name}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-2xs font-bold bg-amber-100 text-amber-700">
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="btn-ghost btn-sm text-surface-500 hover:text-red-600 hover:bg-red-50"
              aria-label="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
