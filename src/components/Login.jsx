import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUniversity, loginAdmin } from '../utils/auth';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

export default function Login({ isAdmin = false }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 650));
    const user = isAdmin ? loginAdmin(email, password) : loginUniversity(email, password);
    if (user) {
      navigate(isAdmin ? '/admin/dashboard' : '/university/dashboard');
    } else {
      setError('Invalid credentials. Please check and try again.');
      setLoading(false);
    }
  };

  const demos = isAdmin
    ? [{ label: 'Admin Account', email: 'admin@olympiad.pk', password: 'admin123' }]
    : [
        { label: 'Punjab University',  email: 'sports@pu.edu.pk',      password: 'pu123'   },
        { label: 'NUST',               email: 'athletics@nust.edu.pk',  password: 'nust123' },
        { label: 'LUMS',               email: 'sports@lums.edu.pk',     password: 'lums123' },
        { label: 'UET Lahore',         email: 'sports@uet.edu.pk',      password: 'uet123'  },
        { label: 'FAST NUCES',         email: 'olympiad@nu.edu.pk',     password: 'fast123' },
        { label: 'IBA Karachi',        email: 'sports@iba.edu.pk',      password: 'iba123'  },
      ];

  return (
    <div className="min-h-screen bg-surface-900 flex overflow-hidden">
      {/* Left panel — dark brand block */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-aku-600 items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-10" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        {/* Big display number */}
        <div
          className="absolute bottom-4 right-4 leading-none select-none pointer-events-none opacity-10"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14rem' }}
          aria-hidden="true"
        >
          {isAdmin ? 'AD' : 'UNI'}
        </div>
        <div className="relative z-10 max-w-xs">
          <div className="mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-aku-200 text-sm font-semibold uppercase tracking-widest mb-3">AKU OLYMPIAD 2026</p>
            <h1
              className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}
            >
              {isAdmin ? 'ADMIN\nPORTAL' : 'UNIVERSITY\nPORTAL'}
            </h1>
          </div>
          <div className="space-y-3">
            {[
              isAdmin ? 'Review all university submissions' : 'Register your sports teams',
              isAdmin ? 'Approve or reject player eligibility' : 'Upload player CNIC documents',
              isAdmin ? 'Generate verified invoices' : 'Track registration status',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-aku-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-aku-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="font-display text-lg text-surface-900">AKU OLYMPIAD 2026</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="font-display text-surface-900 leading-none mb-2" style={{ fontSize: '2.5rem' }}>
              {isAdmin ? 'SIGN IN' : 'SIGN IN'}
            </h2>
            <p className="text-surface-500 text-sm">
              {isAdmin ? 'Access the admin management panel' : 'Access your university registration portal'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-surface-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder={isAdmin ? 'admin@olympiad.pk' : 'you@university.edu.pk'}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-surface-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl"
              >
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </motion.div>
            )}

            <button type="submit" className="btn-primary btn-md w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </motion.form>

          {/* Demo credentials */}
          <motion.div variants={fadeUp} className="mt-8 pt-6 border-t border-surface-100">
            <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-3">Demo Accounts</p>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {demos.map((d, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 bg-surface-50 rounded-xl border border-surface-100 hover:border-surface-200 transition-colors duration-150">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-800 truncate">{d.label}</p>
                    <p className="text-xs font-mono text-surface-400 truncate">{d.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEmail(d.email); setPassword(d.password); }}
                    className="btn-secondary btn-sm flex-shrink-0 text-xs px-3 py-1 min-h-[28px]"
                  >
                    Fill
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Back */}
          <motion.div variants={fadeUp} className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost btn-sm text-surface-400 hover:text-surface-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to homepage
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
