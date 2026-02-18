import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';
import { saveRegistration, getRegistrationById } from '../utils/storage';
import { SPORTS, SPORT_FEES } from '../data/mockData';
const SPORT_EMOJI_MAP = { cricket:'🏏', football:'⚽', basketball:'🏀', volleyball:'🏐', badminton:'🏸', athletics:'🏃', tabletennis:'🏓', hockey:'🏒' };
import AppShell from './AppShell';

const ease = [0.16, 1, 0.3, 1];

export default function RegistrationForm() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const user     = getCurrentUser();

  const [selectedSports, setSelectedSports] = useState([]);
  const [players, setPlayers]               = useState({});
  const [activeSport, setActiveSport]       = useState(null);
  const [form, setForm]                     = useState({ name: '', dob: '', cnic: '', cnicFront: null, cnicBack: null });
  const [saving, setSaving]                 = useState(false);

  useEffect(() => {
    if (!user || user.type !== 'university') { navigate('/login'); return; }
    if (id) {
      const reg = getRegistrationById(id);
      if (reg && reg.universityId === user.id) {
        setSelectedSports(reg.sports);
        setPlayers(reg.players);
        setActiveSport(reg.sports[0] || null);
      }
    }
  }, [id]);

  const toggleSport = (sportId) => {
    setSelectedSports(prev => {
      if (prev.includes(sportId)) {
        const np = { ...players }; delete np[sportId];
        setPlayers(np);
        if (activeSport === sportId) setActiveSport(prev.filter(s => s !== sportId)[0] || null);
        return prev.filter(s => s !== sportId);
      }
      if (!activeSport) setActiveSport(sportId);
      return [...prev, sportId];
    });
  };

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const addPlayer = () => {
    if (!activeSport) return;
    if (!form.name.trim() || !form.dob || !form.cnic.trim()) {
      alert('Please fill in name, date of birth, and CNIC number.');
      return;
    }
    const sport   = SPORTS.find(s => s.id === activeSport);
    const current = players[activeSport] || [];
    if (current.length >= sport.maxPlayers) {
      alert(`Maximum ${sport.maxPlayers} players allowed for ${sport.name}.`);
      return;
    }
    const player = {
      id:          Math.random().toString(36).slice(2),
      name:        form.name.trim(),
      dob:         form.dob,
      cnic:        form.cnic.trim(),
      cnicFront:   form.cnicFront || 'https://via.placeholder.com/400x250/006747/ffffff?text=CNIC+Front',
      cnicBack:    form.cnicBack  || 'https://via.placeholder.com/400x250/006747/ffffff?text=CNIC+Back',
      status:      'pending',
      rejectionReason: null,
      createdAt:   new Date().toISOString(),
    };
    setPlayers(p => ({ ...p, [activeSport]: [...(p[activeSport] || []), player] }));
    setForm({ name: '', dob: '', cnic: '', cnicFront: null, cnicBack: null });
  };

  const removePlayer = (sportId, playerId) =>
    setPlayers(p => ({ ...p, [sportId]: p[sportId].filter(pl => pl.id !== playerId) }));

  const totalFee     = selectedSports.reduce((s, sid) => s + SPORT_FEES[sid], 0);
  const totalPlayers = Object.values(players).reduce((s, p) => s + p.length, 0);

  const save = async (submit = false) => {
    if (!selectedSports.length) { alert('Select at least one sport.'); return; }
    if (submit && selectedSports.some(s => !players[s]?.length)) {
      alert('Add at least one player per sport before submitting.');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    saveRegistration({
      id:             id || `reg${Date.now()}`,
      universityId:   user.id,
      universityName: user.name,
      sports:         selectedSports,
      players,
      status:         submit ? 'submitted' : 'draft',
      submittedAt:    submit ? new Date().toISOString() : null,
      totalAmount:    totalFee,
    });
    setSaving(false);
    alert(submit ? 'Registration submitted!' : 'Draft saved!');
    navigate('/university/dashboard');
  };

  return (
    <AppShell user={user} breadcrumb={id ? 'Edit Registration' : 'New Registration'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Team Registration</p>
          <h1 className="font-display text-surface-900 leading-none" style={{ fontSize: '2.5rem' }}>
            {id ? 'EDIT REGISTRATION' : 'NEW REGISTRATION'}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1 — Select Sports */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gold-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <h2 className="font-display text-xl text-surface-900">SELECT SPORTS</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SPORTS.map(sport => {
                    const selected = selectedSports.includes(sport.id);
                    return (
                      <button
                        key={sport.id}
                        onClick={() => toggleSport(sport.id)}
                        className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 ease-smooth cursor-pointer ${
                          selected
                            ? 'border-gold-600 bg-gold-50 shadow-glow'
                            : 'border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50'
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold-600 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className={`w-12 h-12 rounded-2xl ${sport.bgColor} flex items-center justify-center mb-3 shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sport.id]}</span>
                        </div>
                        <p className={`font-semibold text-sm mb-0.5 leading-tight ${selected ? 'text-gold-800' : 'text-surface-800'}`}>{sport.name}</p>
                        <p className="text-xs text-surface-500">PKR {SPORT_FEES[sport.id].toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2 — Add Players */}
            <AnimatePresence>
              {selectedSports.length > 0 && (
                <motion.div
                  key="players"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease }}
                  className="card overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gold-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <h2 className="font-display text-xl text-surface-900">ADD PLAYERS</h2>
                  </div>
                  <div className="p-6">
                    {/* Sport tabs */}
                    <div className="flex gap-2 flex-wrap mb-5 overflow-x-auto">
                      {selectedSports.map(sportId => {
                        const sport  = SPORTS.find(s => s.id === sportId);
                        const count  = players[sportId]?.length || 0;
                        const active = activeSport === sportId;
                        return (
                          <button
                            key={sportId}
                            onClick={() => setActiveSport(sportId)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 ${
                              active
                                ? `${sport.bgColor} text-white shadow-sm`
                                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                            }`}
                          >
                            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sportId]}</span>
                            {sport.name}
                            <span className={`px-1.5 py-0.5 rounded text-2xs font-mono ${active ? 'bg-white/25' : 'bg-surface-200 text-surface-500'}`}>
                              {count}/{sport.maxPlayers}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Player form */}
                    {activeSport && (
                      <div className="bg-surface-50 border border-surface-200 rounded-2xl p-5 mb-5">
                        <p className="text-sm font-semibold text-surface-700 mb-4">
                          Adding player for <strong className="text-gold-700">{SPORTS.find(s => s.id === activeSport)?.name}</strong>
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label htmlFor="pname" className="block text-sm font-semibold text-surface-700 mb-1.5">Full Name</label>
                            <input id="pname" className="input" placeholder="e.g. Ahmed Khan"
                              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                          </div>
                          <div>
                            <label htmlFor="pdob" className="block text-sm font-semibold text-surface-700 mb-1.5">Date of Birth</label>
                            <input id="pdob" type="date" className="input"
                              value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                          </div>
                          <div>
                            <label htmlFor="pcnic" className="block text-sm font-semibold text-surface-700 mb-1.5">CNIC Number</label>
                            <input id="pcnic" className="input font-mono" placeholder="35202-1234567-1"
                              value={form.cnic} onChange={e => setForm(f => ({ ...f, cnic: e.target.value }))} />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-surface-700 mb-1.5">CNIC Front</label>
                            <input type="file" accept="image/*" className="input text-sm" onChange={e => handleFile(e, 'cnicFront')} />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-surface-700 mb-1.5">CNIC Back</label>
                            <input type="file" accept="image/*" className="input text-sm" onChange={e => handleFile(e, 'cnicBack')} />
                          </div>
                        </div>
                        <button onClick={addPlayer} className="btn-primary btn-sm w-full">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Add Player
                        </button>
                      </div>
                    )}

                    {/* Player list per sport */}
                    {selectedSports.map(sportId => {
                      const sport = SPORTS.find(s => s.id === sportId);
                      const list  = players[sportId] || [];
                      if (!list.length) return null;
                      return (
                        <div key={sportId} className="mb-4 last:mb-0">
                          <div className={`sport-chip ${sport.bgColor} mb-3`}>
                            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{SPORT_EMOJI_MAP[sportId]}</span>
                            {sport.name} — {list.length} player{list.length !== 1 ? 's' : ''}
                          </div>
                          <div className="space-y-2">
                            {list.map(pl => (
                              <div key={pl.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl hover:border-surface-200 transition-colors duration-150">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-surface-900 truncate">{pl.name}</p>
                                  <p className="text-xs text-surface-500 font-mono">{pl.cnic} · {pl.dob}</p>
                                </div>
                                <button
                                  onClick={() => removePlayer(sportId, pl.id)}
                                  aria-label="Remove player"
                                  className="w-8 h-8 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors duration-150 cursor-pointer flex-shrink-0"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-[4.5rem]">
              <h2 className="font-display text-xl text-surface-900 mb-5">SUMMARY</h2>

              <div className="space-y-3 mb-5">
                {[
                  { label: 'Sports selected',  value: selectedSports.length },
                  { label: 'Total players',    value: totalPlayers          },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center text-sm">
                    <span className="text-surface-500">{s.label}</span>
                    <span className="font-bold text-surface-900">{s.value}</span>
                  </div>
                ))}
              </div>

              {selectedSports.length > 0 && (
                <div className="border-t border-surface-100 pt-4 mb-5 space-y-2">
                  <p className="section-label mb-3">Fee Breakdown</p>
                  {selectedSports.map(sportId => {
                    const sport = SPORTS.find(s => s.id === sportId);
                    return (
                      <div key={sportId} className="flex justify-between text-sm">
                        <span className="text-surface-500 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${sport.bgColor}`} />
                          {sport.name}
                        </span>
                        <span className="font-semibold text-surface-900">PKR {SPORT_FEES[sportId].toLocaleString()}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between pt-3 border-t border-surface-100">
                    <span className="font-bold text-surface-900">Total</span>
                    <span className="font-display text-2xl text-gold-700 leading-none">PKR {totalFee.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button onClick={() => save(false)} disabled={saving} className="btn-secondary btn-md w-full">
                  {saving ? 'Saving…' : 'Save as Draft'}
                </button>
                <button onClick={() => save(true)} disabled={saving} className="btn-primary btn-md w-full">
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : 'Submit Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
