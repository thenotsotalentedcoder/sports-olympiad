import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';
import { getRegistrationById } from '../utils/storage';
import { downloadInvoicePDF } from '../utils/invoice';
import { SPORTS } from '../data/mockData';
const SPORT_EMOJI_MAP = { cricket:'🏏', football:'⚽', basketball:'🏀', volleyball:'🏐', badminton:'🏸', athletics:'🏃', tabletennis:'🏓', hockey:'🏒' };
import AppShell from './AppShell';

const ease = [0.16, 1, 0.3, 1];
const STATUS_MAP = {
  pending:  { cls: 'badge-pending',  label: 'Pending Review' },
  approved: { cls: 'badge-approved', label: 'Approved' },
  rejected: { cls: 'badge-rejected', label: 'Rejected' },
};

export default function RegistrationDetails() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const user     = getCurrentUser();
  const [reg, setReg]         = useState(null);
  const [zoomImg, setZoomImg] = useState(null);

  useEffect(() => {
    if (!user || user.type !== 'university') { navigate('/login'); return; }
    const r = getRegistrationById(id);
    if (!r || r.universityId !== user.id) { navigate('/university/dashboard'); return; }
    setReg(r);
  }, [id]);

  if (!reg) return (
    <AppShell user={user}>
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-4">
        {[1, 2].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
      </div>
    </AppShell>
  );

  const regStatus = {
    draft:     'badge-draft',
    submitted: 'badge-submitted',
    verified:  'badge-verified',
  };

  return (
    <AppShell user={user} breadcrumb="Registration Details">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <p className="section-label mb-2">Registration #{reg.id}</p>
            <h1 className="font-display text-surface-900 leading-none" style={{ fontSize: '2.5rem' }}>
              TEAM DETAILS
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={regStatus[reg.status] || 'badge-draft'}>
              {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
            </span>
            {reg.status === 'verified' && (
              <button onClick={() => downloadInvoicePDF(reg)} className="btn btn-sm bg-gold-600 text-white hover:bg-gold-700 active:scale-[0.97]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Invoice
              </button>
            )}
            {reg.status === 'draft' && (
              <button onClick={() => navigate(`/university/register/${reg.id}`)} className="btn-primary btn-sm">
                Continue Editing
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Players per sport */}
          <div className="lg:col-span-2 space-y-6">
            {reg.sports.map(sportId => {
              const sport   = SPORTS.find(s => s.id === sportId);
              const players = reg.players[sportId] || [];
              return (
                <motion.div
                  key={sportId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="card overflow-hidden"
                >
                  <div className={`${sport.bgColor} px-6 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sportId]}</span>
                      </div>
                      <div>
                        <h2 className="font-display text-white text-xl">{sport.name.toUpperCase()}</h2>
                        <p className="text-xs text-white/70">{players.length} registered players</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60">Approved</p>
                      <p className="font-display text-2xl text-white leading-none">
                        {players.filter(p => p.status === 'approved').length}/{players.length}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-surface-100">
                    {players.map((player, i) => {
                      const s = STATUS_MAP[player.status] || STATUS_MAP.pending;
                      return (
                        <div key={player.id} className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 text-sm flex-shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <p className="font-semibold text-surface-900">{player.name}</p>
                                <p className="text-xs text-surface-500 font-mono mt-0.5">{player.cnic}</p>
                                <p className="text-xs text-surface-500 mt-0.5">
                                  DOB: {new Date(player.dob).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                </p>
                              </div>
                            </div>
                            <span className={s.cls}>{s.label}</span>
                          </div>

                          {player.rejectionReason && (
                            <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-xs font-bold text-red-800">Rejection Reason</p>
                                <p className="text-xs text-red-700 mt-0.5">{player.rejectionReason}</p>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            {[{ label: 'CNIC Front', src: player.cnicFront }, { label: 'CNIC Back', src: player.cnicBack }].map(img => (
                              <div key={img.label}>
                                <p className="text-xs font-semibold text-surface-500 mb-1.5">{img.label}</p>
                                <button onClick={() => setZoomImg(img.src)} className="block w-full cursor-zoom-in" aria-label={`View ${img.label}`}>
                                  <img
                                    src={img.src} alt={img.label}
                                    className="w-full h-28 object-cover rounded-xl border border-surface-200 hover:border-gold-400 hover:shadow-card-md transition-all duration-200"
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-[4.5rem]">
              <h2 className="font-display text-xl text-surface-900 mb-5">SUMMARY</h2>
              <div className="space-y-3 divide-y divide-surface-100">
                <div className="flex justify-between pb-3 text-sm">
                  <span className="text-surface-500">Status</span>
                  <span className={regStatus[reg.status] || 'badge-draft'}>{reg.status}</span>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <span className="text-surface-500">Submitted</span>
                  <span className="font-semibold text-surface-900">
                    {reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <span className="text-surface-500">Sports</span>
                  <span className="font-semibold text-surface-900">{reg.sports.length}</span>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <span className="text-surface-500">Total Players</span>
                  <span className="font-semibold text-surface-900">{Object.values(reg.players).flat().length}</span>
                </div>
                <div className="pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-surface-500 text-sm">Total Fee</span>
                    <span className="font-display text-2xl text-gold-700 leading-none">PKR {reg.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image zoom */}
      <AnimatePresence>
        {zoomImg && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoomImg(null)}
            className="fixed inset-0 bg-surface-900/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            role="dialog" aria-label="CNIC image"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              transition={{ duration: 0.25, ease }}
              className="relative max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img src={zoomImg} alt="CNIC document" className="w-full rounded-2xl shadow-card-xl" />
              <button
                onClick={() => setZoomImg(null)}
                aria-label="Close"
                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow-card-lg flex items-center justify-center text-surface-600 hover:text-surface-900 cursor-pointer transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
