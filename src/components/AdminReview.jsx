import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';
import { getRegistrationById, updatePlayerStatus, updateRegistrationStatus } from '../utils/storage';
import { SPORTS } from '../data/mockData';
const SPORT_EMOJI_MAP = { cricket:'🏏', football:'⚽', basketball:'🏀', volleyball:'🏐', badminton:'🏸', athletics:'🏃', tabletennis:'🏓', hockey:'🏒' };
import AppShell from './AppShell';

const ease = [0.16, 1, 0.3, 1];
const STATUS_CFG = {
  pending:  { cls: 'badge-pending',  label: 'Pending'  },
  approved: { cls: 'badge-approved', label: 'Approved' },
  rejected: { cls: 'badge-rejected', label: 'Rejected' },
};

function calcAge(dob) {
  const birth = new Date(dob), now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() ||
     (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age;
}

// Build a flat key for each player: "sportId::playerId"
function playerKey(sportId, playerId) { return `${sportId}::${playerId}`; }

export default function AdminReview() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const user     = getCurrentUser();

  const [reg, setReg]                   = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null); // { sportId, playerId } | 'batch'
  const [rejectReason, setRejectReason] = useState('');
  const [zoomImg, setZoomImg]           = useState(null);
  const [verifying, setVerifying]       = useState(false);
  const [selected, setSelected]         = useState(new Set()); // Set of playerKey strings

  useEffect(() => {
    if (!user || user.type !== 'admin') { navigate('/admin/login'); return; }
    load();
  }, [id]);

  const load = () => {
    const r = getRegistrationById(id);
    if (!r) { navigate('/admin/dashboard'); return; }
    setReg(r);
    setSelected(new Set()); // clear selection on reload
  };

  // ── Individual actions ──────────────────────────────────────
  const approve = (sportId, playerId) => {
    updatePlayerStatus(reg.id, sportId, playerId, 'approved', null);
    load();
  };

  const submitReject = () => {
    if (!rejectReason.trim()) { alert('Please provide a rejection reason.'); return; }
    if (rejectTarget === 'batch') {
      // batch reject all selected pending players
      selected.forEach(key => {
        const [sId, pId] = key.split('::');
        const player = (reg.players[sId] || []).find(p => p.id === pId);
        if (player?.status === 'pending') {
          updatePlayerStatus(reg.id, sId, pId, 'rejected', rejectReason.trim());
        }
      });
    } else {
      updatePlayerStatus(reg.id, rejectTarget.sportId, rejectTarget.playerId, 'rejected', rejectReason.trim());
    }
    setRejectTarget(null);
    setRejectReason('');
    load();
  };

  // ── Batch actions ───────────────────────────────────────────
  const batchApprove = () => {
    selected.forEach(key => {
      const [sId, pId] = key.split('::');
      const player = (reg.players[sId] || []).find(p => p.id === pId);
      if (player?.status === 'pending') {
        updatePlayerStatus(reg.id, sId, pId, 'approved', null);
      }
    });
    load();
  };

  const togglePlayer = (sportId, playerId, isSelected) => {
    const key = playerKey(sportId, playerId);
    setSelected(prev => {
      const next = new Set(prev);
      if (isSelected) next.add(key); else next.delete(key);
      return next;
    });
  };

  const toggleAll = () => {
    const allPending = [];
    if (reg) {
      reg.sports.forEach(sId => {
        (reg.players[sId] || []).forEach(p => {
          if (p.status === 'pending') allPending.push(playerKey(sId, p.id));
        });
      });
    }
    const allSelected = allPending.every(k => selected.has(k));
    setSelected(allSelected ? new Set() : new Set(allPending));
  };

  const pendingKeys = reg ? reg.sports.flatMap(sId =>
    (reg.players[sId] || []).filter(p => p.status === 'pending').map(p => playerKey(sId, p.id))
  ) : [];

  const selectedPendingCount = [...selected].filter(k => pendingKeys.includes(k)).length;
  const allPendingSelected   = pendingKeys.length > 0 && pendingKeys.every(k => selected.has(k));

  // ── Verify ──────────────────────────────────────────────────
  const verify = async () => {
    const allDone = reg.sports.every(sid =>
      (reg.players[sid] || []).every(p => p.status !== 'pending')
    );
    if (!allDone) { alert('Review all players before verifying.'); return; }
    setVerifying(true);
    await new Promise(r => setTimeout(r, 600));
    updateRegistrationStatus(reg.id, 'verified');
    alert('Registration verified successfully!');
    navigate('/admin/dashboard');
  };

  if (!reg) return (
    <AppShell user={user}>
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
      </div>
    </AppShell>
  );

  const allPlayers   = Object.values(reg.players).flat();
  const pendingCount = allPlayers.filter(p => p.status === 'pending').length;
  const approved     = allPlayers.filter(p => p.status === 'approved').length;
  const rejected     = allPlayers.filter(p => p.status === 'rejected').length;
  const progress     = allPlayers.length ? ((approved + rejected) / allPlayers.length) * 100 : 0;

  return (
    <AppShell user={user} breadcrumb={`Review — ${reg.universityName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <p className="section-label mb-2">Reviewing Registration</p>
            <h1 className="font-display text-surface-900 leading-none mb-2" style={{ fontSize: '2.2rem' }}>
              {reg.universityName.toUpperCase()}
            </h1>
            <p className="text-sm text-surface-500 font-mono">
              #{reg.id} · Submitted {new Date(reg.submittedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>
          {reg.status !== 'verified' && (
            <button
              onClick={verify}
              disabled={verifying || pendingCount > 0}
              className="btn btn-md bg-gold-600 text-white hover:bg-gold-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
            >
              {verifying ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  {pendingCount > 0 ? `${pendingCount} Pending…` : 'Verify Registration'}
                </>
              )}
            </button>
          )}
        </div>

        {/* ── Batch toolbar ── */}
        <AnimatePresence>
          {pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
              className="mb-6 flex items-center gap-3 flex-wrap p-4 bg-surface-50 border border-surface-200 rounded-2xl"
            >
              {/* Select all */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allPendingSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-surface-300 text-gold-600 cursor-pointer accent-gold-600"
                />
                <span className="text-sm font-semibold text-surface-700">
                  {allPendingSelected ? 'Deselect All' : 'Select All Pending'}
                </span>
                <span className="text-xs text-surface-400 font-mono">({pendingCount} pending)</span>
              </label>

              <div className="flex-1" />

              <AnimatePresence>
                {selectedPendingCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm font-semibold text-surface-600">
                      {selectedPendingCount} selected
                    </span>
                    <button
                      onClick={batchApprove}
                      className="btn btn-sm bg-green-600 text-white hover:bg-green-700 active:scale-[0.97]"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve All
                    </button>
                    <button
                      onClick={() => setRejectTarget('batch')}
                      className="btn-danger btn-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject All
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Batch reject reason modal ── */}
        <AnimatePresence>
          {rejectTarget === 'batch' && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              role="dialog" aria-label="Batch rejection reason"
            >
              <motion.div
                className="bg-white rounded-3xl p-6 w-full max-w-md shadow-card-xl"
                initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
                transition={{ duration: 0.25, ease }}
                onClick={e => e.stopPropagation()}
              >
                <h3 className="font-display text-2xl text-surface-900 mb-1">REJECT {selectedPendingCount} PLAYERS</h3>
                <p className="text-sm text-surface-500 mb-5">This reason will be applied to all selected pending players.</p>
                <label htmlFor="batchReason" className="block text-sm font-semibold text-surface-700 mb-1.5">Rejection Reason</label>
                <textarea
                  id="batchReason"
                  rows={4}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="input resize-none text-sm mb-4"
                  placeholder="State the reason for rejection (required)…"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={submitReject} className="flex-1 btn-danger btn-md">Confirm Rejection</button>
                  <button onClick={() => { setRejectTarget(null); setRejectReason(''); }} className="btn-secondary btn-md">Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Players */}
          <div className="lg:col-span-2 space-y-6">
            {reg.sports.map(sportId => {
              const sport   = SPORTS.find(s => s.id === sportId);
              const players = reg.players[sportId] || [];
              return (
                <div key={sportId} className="card overflow-hidden">
                  <div className={`${sport.bgColor} px-6 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sportId]}</span>
                      </div>
                      <div>
                        <h2 className="font-display text-white text-xl">{sport.name.toUpperCase()}</h2>
                        <p className="text-xs text-white/70">{players.length} players</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60">Approved</p>
                      <p className="font-display text-2xl text-white">
                        {players.filter(p => p.status === 'approved').length}/{players.length}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-surface-100">
                    {players.map((player, i) => {
                      const age       = calcAge(player.dob);
                      const ageOk     = age >= 18 && age <= 25;
                      const statusCfg = STATUS_CFG[player.status] || STATUS_CFG.pending;
                      const isRej     = rejectTarget?.playerId === player.id && rejectTarget !== 'batch';
                      const key       = playerKey(sportId, player.id);
                      const isChecked = selected.has(key);

                      return (
                        <div key={player.id} className={`p-5 transition-colors duration-150 ${isChecked ? 'bg-gold-50/50' : ''}`}>
                          {/* Info row */}
                          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                            <div className="flex items-center gap-3">
                              {/* Checkbox — only for pending */}
                              {player.status === 'pending' && reg.status !== 'verified' && (
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => togglePlayer(sportId, player.id, e.target.checked)}
                                  className="w-4 h-4 rounded border-surface-300 cursor-pointer accent-gold-600 flex-shrink-0"
                                  aria-label={`Select ${player.name}`}
                                />
                              )}
                              <div className="w-9 h-9 rounded-full bg-surface-100 flex items-center justify-center text-sm font-bold text-surface-500 flex-shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <p className="font-semibold text-surface-900">{player.name}</p>
                                <p className="text-xs text-surface-500 font-mono">{player.cnic}</p>
                                <p className="text-xs mt-0.5">
                                  <span className="text-surface-500">Age: </span>
                                  <span className={`font-semibold ${ageOk ? 'text-surface-900' : 'text-red-600'}`}>{age} yrs</span>
                                  {!ageOk && <span className="ml-1 text-red-500 text-xs">(must be 18–25)</span>}
                                </p>
                              </div>
                            </div>
                            <span className={statusCfg.cls}>{statusCfg.label}</span>
                          </div>

                          {/* Age warning */}
                          {!ageOk && (
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                              <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <p className="text-xs text-amber-800 font-medium">Age ineligible — {age} years old. Players must be 18–25.</p>
                            </div>
                          )}

                          {/* Rejection reason */}
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

                          {/* CNIC images */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {[{ label: 'CNIC Front', src: player.cnicFront }, { label: 'CNIC Back', src: player.cnicBack }].map(img => (
                              <div key={img.label}>
                                <p className="text-xs font-semibold text-surface-500 mb-1.5">{img.label}</p>
                                <button onClick={() => setZoomImg(img.src)} className="block w-full cursor-zoom-in" aria-label={`View ${img.label}`}>
                                  <img src={img.src} alt={img.label}
                                    className="w-full h-28 object-cover rounded-xl border border-surface-200 hover:border-gold-400 hover:shadow-card-md transition-all duration-200" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Individual actions */}
                          {player.status === 'pending' && reg.status !== 'verified' && (
                            <AnimatePresence mode="wait">
                              {!isRej ? (
                                <motion.div key="btns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                                  <button onClick={() => approve(sportId, player.id)} className="flex-1 btn btn-sm bg-green-600 text-white hover:bg-green-700 active:scale-[0.97]">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Approve
                                  </button>
                                  <button onClick={() => setRejectTarget({ sportId, playerId: player.id })} className="flex-1 btn-danger btn-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reject
                                  </button>
                                </motion.div>
                              ) : (
                                <motion.div key="form" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                                  <textarea
                                    rows={3}
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    className="input resize-none text-sm"
                                    placeholder="State the reason for rejection (required)…"
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <button onClick={submitReject} className="flex-1 btn-danger btn-sm">Confirm Rejection</button>
                                    <button onClick={() => { setRejectTarget(null); setRejectReason(''); }} className="btn-secondary btn-sm">Cancel</button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-[4.5rem]">
              <h2 className="font-display text-xl text-surface-900 mb-5">REVIEW PROGRESS</h2>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-surface-500 mb-2">
                  <span>Players reviewed</span>
                  <span className="font-mono font-semibold">{approved + rejected}/{allPlayers.length}</span>
                </div>
                <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease }}
                    className="h-full bg-gold-600 rounded-full"
                  />
                </div>
                <p className="text-xs text-surface-400 mt-1.5 text-right">{Math.round(progress)}% complete</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: 'Approved', value: approved,     color: 'text-green-700 bg-green-50 border-green-100' },
                  { label: 'Pending',  value: pendingCount, color: 'text-amber-700 bg-amber-50 border-amber-100' },
                  { label: 'Rejected', value: rejected,     color: 'text-red-700 bg-red-50 border-red-100'       },
                ].map(s => (
                  <div key={s.label} className={`p-3 rounded-xl border text-center ${s.color}`}>
                    <p className="font-display text-2xl leading-none">{s.value}</p>
                    <p className="text-xs font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Per-sport */}
              <div className="space-y-2 mb-5">
                {reg.sports.map(sportId => {
                  const sport = SPORTS.find(s => s.id === sportId);
                  const sp    = reg.players[sportId] || [];
                  const app   = sp.filter(p => p.status === 'approved').length;
                  const rej   = sp.filter(p => p.status === 'rejected').length;
                  const pen   = sp.filter(p => p.status === 'pending').length;
                  return (
                    <div key={sportId} className="px-3 py-2.5 border border-surface-100 rounded-xl">
                      <div className={`sport-chip ${sport.bgColor} mb-2`}>
                        <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sportId]}</span>
                        {sport.name}
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-center text-xs">
                        <div><p className="font-bold text-green-700">{app}</p><p className="text-surface-400">Appr.</p></div>
                        <div><p className="font-bold text-amber-600">{pen}</p><p className="text-surface-400">Pend.</p></div>
                        <div><p className="font-bold text-red-600">{rej}</p><p className="text-surface-400">Rej.</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-surface-100 pt-4 mb-4">
                <p className="text-xs text-surface-500 mb-1">Registration Fee</p>
                <p className="font-display text-2xl text-gold-700 leading-none">PKR {reg.totalAmount?.toLocaleString()}</p>
              </div>

              <button
                onClick={verify}
                disabled={verifying || pendingCount > 0 || reg.status === 'verified'}
                className="btn btn-md w-full bg-gold-600 text-white hover:bg-gold-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
              >
                {reg.status === 'verified'
                  ? 'Already Verified'
                  : pendingCount > 0
                  ? `${pendingCount} Still Pending`
                  : 'Verify Registration'}
              </button>
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
            role="dialog" aria-label="Document preview"
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
                aria-label="Close preview"
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
