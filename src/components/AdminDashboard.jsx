import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';
import { getRegistrations } from '../utils/storage';
import { SPORTS } from '../data/mockData';
const SPORT_EMOJI_MAP = { cricket:'🏏', football:'⚽', basketball:'🏀', volleyball:'🏐', badminton:'🏸', athletics:'🏃', tabletennis:'🏓', hockey:'🏒' };
import AppShell from './AppShell';

const ease    = [0.16, 1, 0.3, 1];
const fadeUp  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } };
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

const FILTERS = [
  { id: 'all',       label: 'All'           },
  { id: 'submitted', label: 'Pending Review' },
  { id: 'verified',  label: 'Verified'       },
];

function exportCSV(registrations) {
  const rows = [
    ['Registration ID', 'University', 'Sport', 'Player Name', 'Date of Birth', 'CNIC', 'Player Status', 'Rejection Reason', 'Registration Status', 'Submitted At', 'Total Fee (PKR)'],
  ];
  registrations.forEach(reg => {
    reg.sports.forEach(sportId => {
      const players = reg.players[sportId] || [];
      if (!players.length) {
        rows.push([reg.id, reg.universityName, sportId, '—', '—', '—', '—', '—', reg.status, reg.submittedAt || '', reg.totalAmount || 0]);
      } else {
        players.forEach(p => {
          rows.push([
            reg.id,
            reg.universityName,
            SPORTS.find(s => s.id === sportId)?.name || sportId,
            p.name,
            p.dob,
            p.cnic,
            p.status,
            p.rejectionReason || '',
            reg.status,
            reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString('en-GB') : '',
            reg.totalAmount || 0,
          ]);
        });
      }
    });
  });

  const csv = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `aku-olympiad-registrations-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter]               = useState('all');
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    if (!user || user.type !== 'admin') { navigate('/admin/login'); return; }
    setTimeout(() => { setRegistrations(getRegistrations()); setLoading(false); }, 400);
  }, []);

  const visible = registrations.filter(r =>
    r.status !== 'draft' && (filter === 'all' || r.status === filter)
  );

  const stats = [
    { label: 'Total Received', value: registrations.filter(r => r.status !== 'draft').length, color: 'text-surface-900', icon: '📥' },
    { label: 'Pending Review', value: registrations.filter(r => r.status === 'submitted').length, color: 'text-amber-600', icon: '⏳' },
    { label: 'Verified',       value: registrations.filter(r => r.status === 'verified').length,  color: 'text-gold-600',  icon: '✅' },
    { label: 'Total Players',  value: registrations.reduce((s, r) => s + Object.values(r.players).flat().length, 0), color: 'text-blue-600', icon: '👥' },
  ];

  return (
    <AppShell user={user} breadcrumb="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-8">
          <motion.div variants={fadeUp} className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="section-label mb-2">Administration</p>
              <h1 className="font-display text-surface-900 leading-none" style={{ fontSize: '2.5rem' }}>
                REGISTRATION MANAGEMENT
              </h1>
            </div>
            {!loading && registrations.length > 0 && (
              <motion.button
                onClick={() => exportCSV(registrations.filter(r => r.status !== 'draft'))}
                className="btn btn-md bg-surface-900 text-white hover:bg-surface-800 active:scale-[0.97]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export to Excel
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="stat-card group hover:shadow-card-md transition-all duration-200" whileHover={{ y: -2 }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl" role="img" aria-hidden="true">{s.icon}</span>
              </div>
              {loading
                ? <div className="skeleton h-10 w-10 mb-1" />
                : <motion.p className={`stat-value ${s.color}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 + 0.3, duration: 0.4, ease }}>
                    {s.value}
                  </motion.p>
              }
              <p className="stat-label">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`btn btn-sm flex-shrink-0 ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {f.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded text-2xs font-mono ${filter === f.id ? 'bg-white/20' : 'bg-surface-100 text-surface-500'}`}>
                {f.id === 'all'
                  ? registrations.filter(r => r.status !== 'draft').length
                  : registrations.filter(r => r.status === f.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-surface-900">REGISTRATIONS</h2>
            <span className="text-sm text-surface-400 font-medium">{visible.length} shown</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-36 w-full" />)}
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-surface-900 mb-1">NO RESULTS</h3>
              <p className="text-sm text-surface-500">Try a different filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {visible.map((reg, i) => {
                const totalP    = Object.values(reg.players).flat().length;
                const approvedP = Object.values(reg.players).flat().filter(p => p.status === 'approved').length;
                const pendingP  = Object.values(reg.players).flat().filter(p => p.status === 'pending').length;
                const isPending = reg.status === 'submitted';
                return (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease }}
                    className="p-6 hover:bg-surface-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-surface-900 flex items-center justify-center font-display text-white text-sm flex-shrink-0">
                          {reg.universityName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-surface-900">{reg.universityName}</h3>
                          <p className="text-xs text-surface-400 font-mono mt-0.5">
                            #{reg.id} · {new Date(reg.submittedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPending
                          ? <span className="badge-pending">Pending Review</span>
                          : <span className="badge-verified">Verified</span>
                        }
                      </div>
                    </div>

                    {/* Sports */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {reg.sports.map(sid => {
                        const sport = SPORTS.find(s => s.id === sid);
                        return (
                          <motion.div key={sid} className={`sport-chip ${sport.bgColor}`} whileHover={{ scale: 1.05 }}>
                            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sid]}</span>
                            {sport.name}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap items-center gap-6 mb-4 pb-4 border-b border-surface-100 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-surface-300" />
                        <span className="text-surface-600">Total: <strong className="text-surface-900">{totalP}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-surface-600">Approved: <strong className="text-green-700">{approvedP}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-surface-600">Pending: <strong className="text-amber-700">{pendingP}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-xs text-surface-500 mb-0.5">Registration Fee</p>
                        <p className="font-display text-2xl text-surface-900 leading-none">PKR {reg.totalAmount?.toLocaleString()}</p>
                      </div>
                      <button onClick={() => navigate(`/admin/review/${reg.id}`)} className="btn-primary btn-md">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        {isPending ? 'Review & Verify' : 'View Registration'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
