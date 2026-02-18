import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';
import { getRegistrationsByUniversity } from '../utils/storage';
import { downloadInvoicePDF } from '../utils/invoice';
import { SPORTS } from '../data/mockData';
import AppShell from './AppShell';

const ease = [0.16, 1, 0.3, 1];
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

const SPORT_EMOJI_MAP = { cricket:'🏏', football:'⚽', basketball:'🏀', volleyball:'🏐', badminton:'🏸', athletics:'🏃', tabletennis:'🏓', hockey:'🏒' };

const STATUS_MAP = {
  draft:     { label: 'Draft',     cls: 'badge-draft'      },
  submitted: { label: 'Submitted', cls: 'badge-submitted'  },
  verified:  { label: 'Verified',  cls: 'badge-verified'   },
};

export default function UniversityDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.type !== 'university') { navigate('/login'); return; }
    setTimeout(() => {
      setRegistrations(getRegistrationsByUniversity(user.id));
      setLoading(false);
    }, 400);
  }, []);

  const stats = [
    { label: 'Total',     value: registrations.length,                                        color: 'text-surface-900', icon: '📋' },
    { label: 'Drafts',    value: registrations.filter(r => r.status === 'draft').length,      color: 'text-surface-500', icon: '✏️' },
    { label: 'Submitted', value: registrations.filter(r => r.status === 'submitted').length,  color: 'text-blue-600',    icon: '📤' },
    { label: 'Verified',  value: registrations.filter(r => r.status === 'verified').length,   color: 'text-gold-600',     icon: '✅' },
  ];

  const totalPlayers = registrations.reduce((s, r) => s + Object.values(r.players).flat().length, 0);

  return (
    <AppShell user={user} breadcrumb="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-8">
          <motion.div variants={fadeUp} className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="section-label mb-2">Welcome Back</p>
              <h1 className="font-display text-surface-900 leading-none" style={{ fontSize: '2.5rem' }}>
                {user?.name?.toUpperCase()}
              </h1>
              {!loading && totalPlayers > 0 && (
                <p className="text-sm text-surface-500 mt-1.5">
                  {totalPlayers} players registered across {registrations.length} submission{registrations.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <motion.button
              onClick={() => navigate('/university/register')}
              className="btn-primary btn-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Registration
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="stat-card group hover:shadow-card-md transition-all duration-200"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl" role="img" aria-hidden="true">{s.icon}</span>
              </div>
              {loading
                ? <div className="skeleton h-10 w-10 mb-1" />
                : <motion.p
                    className={`stat-value ${s.color}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 + 0.3, duration: 0.4, ease }}
                  >{s.value}</motion.p>
              }
              <p className="stat-label">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Deadline reminder if any submitted */}
        {!loading && registrations.some(r => r.status === 'draft') && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease }}
            className="flex items-center gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 rounded-2xl"
          >
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800 font-medium">
              You have draft registrations. <span className="font-bold">Registration deadline is Feb 28, 2026.</span>
            </p>
          </motion.div>
        )}

        {/* Registrations list */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-surface-900">YOUR REGISTRATIONS</h2>
            <span className="text-sm text-surface-400 font-medium">{registrations.length} total</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2].map(i => <div key={i} className="skeleton h-40 w-full" />)}
            </div>
          ) : registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="text-5xl mb-5" role="img" aria-label="clipboard">📋</div>
              <h3 className="font-display text-2xl text-surface-900 mb-2">NO REGISTRATIONS YET</h3>
              <p className="text-sm text-surface-500 mb-6 max-w-xs">Create your first team registration for AKU Olympiad 2026.</p>
              <button onClick={() => navigate('/university/register')} className="btn-primary btn-md">
                Create Registration
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <div className="divide-y divide-surface-100">
                {registrations.map((reg, i) => {
                  const statusInfo   = STATUS_MAP[reg.status] || STATUS_MAP.draft;
                  const totalP       = Object.values(reg.players).reduce((s, p) => s + p.length, 0);
                  const approvedP    = Object.values(reg.players).flat().filter(p => p.status === 'approved').length;
                  return (
                    <motion.div
                      key={reg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4, ease }}
                      className="p-6 hover:bg-surface-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-11 h-11 rounded-xl bg-surface-900 flex items-center justify-center font-display text-white text-sm flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </motion.div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <h3 className="font-semibold text-surface-900">Registration #{reg.id}</h3>
                              <span className={statusInfo.cls}>{statusInfo.label}</span>
                            </div>
                            <p className="text-xs text-surface-400 font-mono">
                              {reg.submittedAt
                                ? new Date(reg.submittedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })
                                : 'Not submitted'}
                              &nbsp;·&nbsp;{totalP} players&nbsp;·&nbsp;{reg.sports.length} sport{reg.sports.length !== 1 ? 's' : ''}
                              {approvedP > 0 && ` · ${approvedP} approved`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-2xl text-surface-900 leading-none">PKR {reg.totalAmount?.toLocaleString()}</p>
                          <p className="text-xs text-surface-400 mt-1">Registration fee</p>
                        </div>
                      </div>

                      {/* Sport chips */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {reg.sports.map(sportId => {
                          const sport    = SPORTS.find(s => s.id === sportId);
                          const approved = reg.players[sportId]?.filter(p => p.status === 'approved').length || 0;
                          const total    = reg.players[sportId]?.length || 0;
                          return (
                            <motion.div
                              key={sportId}
                              className={`sport-chip ${sport.bgColor}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sportId]}</span>
                              {sport.name}
                              <span className="bg-black/20 rounded px-1 font-mono text-2xs">{approved}/{total}</span>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => navigate(`/university/registration/${reg.id}`)} className="btn-secondary btn-sm">
                          View Details
                        </button>
                        {reg.status === 'draft' && (
                          <button onClick={() => navigate(`/university/register/${reg.id}`)} className="btn-secondary btn-sm">
                            Continue Editing
                          </button>
                        )}
                        {reg.status === 'verified' && (
                          <button
                            onClick={() => downloadInvoicePDF(reg)}
                            className="btn btn-sm bg-gold-600 text-white hover:bg-gold-700 active:scale-[0.97]"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Invoice
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
