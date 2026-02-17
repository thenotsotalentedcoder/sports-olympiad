import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { EVENT_INFO, SPORTS, SPORT_FEES } from '../data/mockData';

const ease = [0.16, 1, 0.3, 1];
const fadeUp   = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger  = { show: { transition: { staggerChildren: 0.08 } } };
const staggerFast = { show: { transition: { staggerChildren: 0.05 } } };

const SPORT_EMOJI = { cricket:'🏏', football:'⚽', basketball:'🏀', volleyball:'🏐', badminton:'🏸', athletics:'🏃', tabletennis:'🏓', hockey:'🏒' };

// Sport details for modal
const SPORT_DETAILS = {
  cricket:     { format: 'T20 · Round Robin + Knockouts', minTeams: 4, field: '22-yard pitch / outdoor ground', duration: '3 hours per match', rules: ['15 players per squad, 11 playing', 'ICC T20 rules apply', 'No-ball: free hit rule enforced', 'DRS not available — umpire final'] },
  football:    { format: '7-a-side · Group Stage + Finals', minTeams: 4, field: 'Astroturf / outdoor pitch', duration: '70 min per match (2×35)', rules: ['18-player squad, 7 on field', 'FIFA futsal-adapted rules', 'Rolling substitutions allowed', 'Yellow/Red card system active'] },
  basketball:  { format: '5-on-5 · Round Robin + Finals', minTeams: 4, field: 'Indoor court', duration: '40 min per game (4×10)', rules: ['12-player squad, 5 playing', 'FIBA standard rules', 'Shot clock: 24 seconds', 'Overtime: 5-min periods'] },
  volleyball:  { format: 'Best of 3 sets · League format', minTeams: 4, field: 'Indoor/outdoor court', duration: 'Best of 3 sets', rules: ['12-player squad, 6 playing', 'FIVB rally-point system', 'Libero position allowed', 'Sets to 25 (final to 15)'] },
  badminton:   { format: 'Singles + Doubles · Knockout', minTeams: 2, field: 'Indoor shuttle court', duration: 'Best of 3 games (21 pts)', rules: ['8 players per team', 'BWF standard rules', 'Mixed doubles included', 'Rally-point scoring system'] },
  athletics:   { format: 'Track & Field · Points Championship', minTeams: 2, field: 'AKU athletic track', duration: 'Full-day heats + finals', rules: ['Up to 20 athletes per team', '100m, 200m, 400m, 800m, 1500m', 'Long jump, shot put, high jump', 'Relay: 4×100m and 4×400m'] },
  tabletennis: { format: 'Singles + Doubles · Knockout', minTeams: 2, field: 'Indoor TT hall', duration: 'Best of 5 games (11 pts)', rules: ['6 players per team', 'ITTF standard rules', 'Service: 2 serves alternating', 'Deuce at 10–10, 2-point margin'] },
  hockey:      { format: '11-a-side · Round Robin + Finals', minTeams: 4, field: 'AKU astroturf', duration: '70 min per match (2×35)', rules: ['16-player squad, 11 playing', 'FIH field hockey rules', 'Rolling substitutions allowed', 'Penalty corners: standard rules'] },
};

function InView({ children, delay = 0, y = 28 }) {
  const ref  = useRef(null);
  const inVw = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inVw ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// ── Countdown hook ───────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ── Sport Detail Modal ───────────────────────────────────────
function SportModal({ sport, onClose }) {
  const details = SPORT_DETAILS[sport.id] || {};
  const fee = SPORT_FEES[sport.id];

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${sport.name} sport details`}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-card-xl overflow-hidden"
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease }}
      >
        {/* Header */}
        <div className={`${sport.bgColor} px-6 pt-6 pb-8 relative overflow-hidden`}>
          <div className="absolute bottom-0 right-4 font-display text-white/10 leading-none select-none pointer-events-none" style={{ fontSize: '7rem' }} aria-hidden="true">
            {SPORT_EMOJI[sport.id]}
          </div>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <span style={{ fontSize: '2rem', lineHeight: 1 }} role="img" aria-label={sport.name}>
                  {SPORT_EMOJI[sport.id]}
                </span>
              </div>
              <h2 className="font-display text-white text-4xl leading-none mb-1">{sport.name.toUpperCase()}</h2>
              <p className="text-white/70 text-sm font-semibold">{details.format}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors duration-150 flex-shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Max Players', value: sport.maxPlayers },
              { label: 'Min Teams', value: details.minTeams || 4 },
              { label: 'Entry Fee', value: `PKR ${fee?.toLocaleString() || '—'}` },
            ].map((s, i) => (
              <div key={i} className="bg-surface-50 rounded-2xl p-3 text-center border border-surface-100">
                <p className="font-display text-surface-900 text-xl leading-none mb-1">{s.value}</p>
                <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Field & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-aku-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-aku-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider mb-0.5">Venue</p>
                <p className="text-sm text-surface-800 font-semibold leading-snug">{details.field}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-aku-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-aku-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider mb-0.5">Duration</p>
                <p className="text-sm text-surface-800 font-semibold leading-snug">{details.duration}</p>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div>
            <p className="text-xs text-surface-400 font-bold uppercase tracking-wider mb-3">Key Rules</p>
            <ul className="space-y-2">
              {(details.rules || []).map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-aku-600/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-aku-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-surface-600">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility note */}
          <div className="flex items-start gap-3 bg-aku-600/8 border border-aku-600/20 rounded-2xl p-4">
            <svg className="w-4 h-4 text-aku-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-aku-800">Players must be enrolled students aged 18–25. Valid CNIC and student ID required at registration.</p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6">
          <a
            href="/login"
            onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => window.location.href = '/login', 200); }}
            className="btn btn-lg bg-aku-600 text-white hover:bg-aku-500 w-full justify-center cursor-pointer"
          >
            Register for {sport.name}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Navbar — transparent overlay on hero ───────────────────
function NavBar({ navigate }) {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-aku-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="font-display text-xl text-white leading-none tracking-wide">AKU OLYMPIAD</p>
            <p className="text-xs text-white/50 font-semibold tracking-widest leading-none mt-0.5">2026 · KARACHI</p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:inline-flex btn btn-sm bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-[0.97]"
          >
            University Portal
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="btn btn-sm bg-aku-600 text-white hover:bg-aku-500 active:scale-[0.97] shadow-glow"
          >
            Admin Login
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

// ── Hero ────────────────────────────────────────────────────
function HeroSection({ navigate }) {
  const countdown = useCountdown('2026-03-15T00:00:00');

  return (
    <section className="relative min-h-screen bg-surface-900 overflow-hidden flex flex-col">
      {/* BG layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,103,71,0.35),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-dot-grid opacity-15" />
      </div>

      {/* Left accent line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-aku-600 opacity-80" />

      {/* Large watermark */}
      <div
        className="absolute bottom-8 right-0 leading-none select-none pointer-events-none overflow-hidden"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(10rem,22vw,20rem)', color: 'rgba(0,103,71,0.10)', lineHeight: 1 }}
        aria-hidden="true"
      >
        2026
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 w-full">
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-8">

            {/* Left: headline + subtext + CTAs */}
            <div className="lg:max-w-2xl">
              {/* Badge */}
              <motion.div variants={fadeUp} className="mb-8">
                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-aku-600/20 border border-aku-600/40 text-aku-300 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-aku-400 animate-pulse" />
                  Registrations Open — Deadline Feb 28, 2026
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp}>
                <h1 className="font-display text-white leading-none mb-2" style={{ fontSize: 'clamp(3.5rem,8vw,8rem)' }}>
                  NATIONAL
                </h1>
                <h1 className="font-display leading-none mb-2" style={{ fontSize: 'clamp(3.5rem,8vw,8rem)', color: '#45ae86' }}>
                  UNIVERSITY
                </h1>
                <h1 className="font-display text-white leading-none" style={{ fontSize: 'clamp(3.5rem,8vw,8rem)' }}>
                  OLYMPIAD
                </h1>
              </motion.div>

              {/* Subtext */}
              <motion.p variants={fadeUp} className="text-lg text-surface-400 max-w-xl mt-6 mb-8 leading-relaxed">
                Hosted by <span className="text-white font-semibold">Aga Khan University, Karachi</span> —
                Pakistan's premier inter-university sports championship.
              </motion.p>

              {/* Countdown — mobile only */}
              <motion.div variants={fadeUp} className="mb-8 lg:hidden">
                <p className="text-xs text-surface-500 font-bold uppercase tracking-widest mb-3">Event Begins In</p>
                <div className="flex items-end gap-3">
                  {[
                    { value: countdown.days,    label: 'Days'  },
                    { value: countdown.hours,   label: 'Hours' },
                    { value: countdown.minutes, label: 'Mins'  },
                    { value: countdown.seconds, label: 'Secs'  },
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="bg-white/8 border border-white/12 rounded-2xl px-3 py-3 min-w-[60px] text-center">
                        <motion.span
                          key={unit.value}
                          initial={{ y: -6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2, ease }}
                          className="font-display text-white leading-none block"
                          style={{ fontSize: '1.75rem' }}
                        >
                          {String(unit.value).padStart(2, '0')}
                        </motion.span>
                      </div>
                      <span className="text-surface-500 text-[10px] font-semibold uppercase tracking-wider mt-1.5">{unit.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => navigate('/login')}
                  className="btn btn-lg bg-aku-600 text-white hover:bg-aku-500 active:scale-[0.97] group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Register Your Team
                  <motion.svg
                    className="w-5 h-5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </motion.button>
                <motion.button
                  onClick={() => document.getElementById('sports')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn btn-lg bg-white/8 text-white border border-white/20 hover:bg-white/15 active:scale-[0.97]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore Sports
                </motion.button>
              </motion.div>
            </div>

            {/* Right: countdown — desktop only */}
            <motion.div variants={fadeUp} className="hidden lg:flex flex-col items-center flex-shrink-0">
              <p className="text-xs text-surface-500 font-bold uppercase tracking-widest mb-6 self-start">Event Begins In</p>
              {/* Big countdown blocks */}
              <div className="flex items-end gap-2">
                {[
                  { value: countdown.days,    label: 'Days'    },
                  { value: countdown.hours,   label: 'Hours'   },
                  { value: countdown.minutes, label: 'Minutes' },
                  { value: countdown.seconds, label: 'Seconds' },
                ].map((unit, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <div className="flex flex-col items-center">
                      <div className="bg-white/8 border border-white/12 rounded-2xl px-5 py-5 min-w-[88px] text-center">
                        <motion.span
                          key={unit.value}
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.25, ease }}
                          className="font-display text-white leading-none block"
                          style={{ fontSize: '3.25rem' }}
                        >
                          {String(unit.value).padStart(2, '0')}
                        </motion.span>
                      </div>
                      <span className="text-surface-500 text-xs font-semibold uppercase tracking-wider mt-2">{unit.label}</span>
                    </div>
                    {i < 3 && (
                      <span className="font-display text-white/25 leading-none mb-8" style={{ fontSize: '2rem' }}>:</span>
                    )}
                  </div>
                ))}
              </div>
              {/* Mar 15 label */}
              <div className="mt-6 px-5 py-3 bg-aku-600/15 border border-aku-600/30 rounded-2xl flex items-center gap-2 self-stretch justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-aku-400 animate-pulse flex-shrink-0" />
                <span className="text-sm text-aku-300 font-semibold">March 15, 2026 · AKU Karachi</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { value: '8',         label: 'Sports'       },
            { value: '30+',       label: 'Universities'  },
            { value: 'PKR 5M',    label: 'Prize Pool'    },
            { value: 'Mar 15–20', label: 'Event Dates'   },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.5, ease }}
              className="py-6 px-4 md:px-8 text-center"
            >
              <p className="font-display text-2xl sm:text-3xl text-white leading-none">{s.value}</p>
              <p className="text-xs text-surface-500 font-semibold mt-1.5 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Sports Grid — clickable ──────────────────────────────────
function SportsGrid() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="sports" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <InView>
          <div className="flex items-end justify-between mb-16 gap-4 flex-wrap">
            <div>
              <p className="section-label mb-3">Compete In</p>
              <h2 className="font-display leading-none text-surface-900" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
                AVAILABLE SPORTS
              </h2>
            </div>
            <p className="text-surface-400 text-sm max-w-xs text-right leading-relaxed">
              8 disciplines. Click any sport<br />to view details and rules.
            </p>
          </div>
        </InView>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {SPORTS.map((sport, i) => (
            <motion.button
              key={sport.id}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2, ease } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(sport)}
              className="group relative bg-white border-2 border-surface-100 rounded-2xl p-5 cursor-pointer hover:border-aku-300 hover:shadow-card-lg transition-all duration-300 overflow-hidden text-left"
            >
              {/* Hover tint */}
              <div className="absolute inset-0 bg-aku-600 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 rounded-2xl" />
              {/* Index watermark */}
              <span
                className="absolute top-3 right-4 font-display leading-none select-none text-surface-100 group-hover:text-aku-100 transition-colors duration-300"
                style={{ fontSize: '3.5rem' }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${sport.bgColor} flex items-center justify-center mb-4 shadow-card-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-card-lg`}>
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }} role="img" aria-label={sport.name}>
                    {SPORT_EMOJI[sport.id]}
                  </span>
                </div>
                <p className="font-semibold text-surface-900 text-base mb-0.5 group-hover:text-aku-700 transition-colors duration-200">{sport.name}</p>
                <p className="text-xs text-surface-400">{sport.maxPlayers} players max</p>
                <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-aku-700">PKR {SPORT_FEES[sport.id]?.toLocaleString()}</span>
                  <svg className="w-4 h-4 text-surface-300 group-hover:text-aku-500 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Sport detail modal */}
      <AnimatePresence>
        {selected && (
          <SportModal sport={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── How to Register — 3-step guide ──────────────────────────
function HowToRegister({ navigate }) {
  const steps = [
    {
      num: '01',
      title: 'Create Account & Log In',
      desc: 'Use your university\'s registered email to access the portal. Each institution gets a dedicated sports coordinator account.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      detail: 'Contact your university\'s sports department for access credentials.',
    },
    {
      num: '02',
      title: 'Select Sports & Add Players',
      desc: 'Choose from 8 disciplines, build your squad roster with player details, upload CNIC photos, and save as draft anytime.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      detail: 'Age eligibility (18–25) is auto-verified. You\'ll see warnings for any violations.',
    },
    {
      num: '03',
      title: 'Submit & Download Invoice',
      desc: 'Submit your registration for admin review. Once verified, download your official AKU invoice to complete fee payment.',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      detail: 'Admin review takes 3–5 business days. Track status in real time.',
    },
  ];

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <InView>
          <div className="flex items-end justify-between mb-16 gap-4 flex-wrap">
            <div>
              <p className="section-label mb-3">Step-by-Step</p>
              <h2 className="font-display leading-none text-surface-900" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
                HOW TO REGISTER
              </h2>
            </div>
            <motion.button
              onClick={() => navigate('/login')}
              className="btn btn-md bg-aku-600 text-white hover:bg-aku-500 active:scale-[0.97]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Registration
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </div>
        </InView>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] h-px bg-surface-200 z-0" />

          {steps.map((step, i) => (
            <InView key={i} delay={i * 0.1}>
              <motion.div
                className="relative bg-white border-2 border-surface-100 rounded-3xl p-8 hover:border-aku-200 hover:shadow-card-lg transition-all duration-300 group"
                whileHover={{ y: -4, transition: { duration: 0.2, ease } }}
              >
                {/* Step number bubble */}
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-aku-600 flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-300">
                  <span className="font-display text-white text-xl leading-none">{step.num}</span>
                </div>

                {/* Watermark number */}
                <span
                  className="absolute top-4 right-5 font-display text-surface-50 leading-none select-none pointer-events-none group-hover:text-aku-50 transition-colors duration-300"
                  style={{ fontSize: '4.5rem' }}
                  aria-hidden="true"
                >
                  {step.num}
                </span>

                <div className="w-10 h-10 rounded-xl bg-aku-600/8 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-aku-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>

                <h3 className="font-display text-surface-900 text-2xl leading-tight mb-3 group-hover:text-aku-700 transition-colors duration-200">
                  {step.title.toUpperCase()}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed mb-4">{step.desc}</p>
                <div className="pt-4 border-t border-surface-100">
                  <p className="text-xs text-surface-400 italic leading-relaxed">{step.detail}</p>
                </div>
              </motion.div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Downloads Section ─────────────────────────────────────────
function Downloads() {
  const files = [
    {
      title: 'Sports Rulebook 2026',
      desc: 'Complete rules and regulations for all 8 sports at AKU Olympiad 2026.',
      size: '2.4 MB · PDF',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'bg-blue-500',
    },
    {
      title: 'Registration Guidelines',
      desc: 'Step-by-step guide for sports coordinators on registering university teams.',
      size: '1.1 MB · PDF',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      color: 'bg-aku-600',
    },
    {
      title: 'Code of Conduct',
      desc: 'Expected standards of behaviour for all participants, coaches, and spectators.',
      size: '0.8 MB · PDF',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'bg-orange-500',
    },
    {
      title: 'Eligibility Criteria',
      desc: 'Detailed age, enrollment, and CNIC verification requirements for all athletes.',
      size: '0.5 MB · PDF',
      icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2',
      color: 'bg-purple-500',
    },
  ];

  // Mock download handler — shows alert since no real files exist
  const handleDownload = (title) => {
    // In a real system, this would be a real file URL
    const a = document.createElement('a');
    a.href = '#';
    alert(`Demo: "${title}" would download here.\nIn production, this links to a real PDF file.`);
  };

  return (
    <section className="py-28 bg-surface-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <InView>
          <div className="mb-16">
            <p className="section-label mb-3">Resources</p>
            <h2 className="font-display leading-none text-surface-900" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
              DOWNLOADS
            </h2>
            <p className="text-surface-400 text-base mt-4 max-w-lg leading-relaxed">
              All official documents for AKU Olympiad 2026. Download rulebooks, guidelines, and forms before registering.
            </p>
          </div>
        </InView>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {files.map((file, i) => (
            <InView key={i} delay={i * 0.08}>
              <motion.div
                className="group bg-white border-2 border-surface-100 rounded-3xl p-6 hover:border-surface-200 hover:shadow-card-lg transition-all duration-300 flex flex-col"
                whileHover={{ y: -3, transition: { duration: 0.2, ease } }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${file.color} rounded-2xl flex items-center justify-center mb-5 shadow-card-md group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={file.icon} />
                  </svg>
                </div>

                <h3 className="font-semibold text-surface-900 text-base mb-2 leading-snug group-hover:text-aku-700 transition-colors duration-200">
                  {file.title}
                </h3>
                <p className="text-xs text-surface-400 leading-relaxed mb-5 flex-1">{file.desc}</p>

                <div className="border-t border-surface-100 pt-4 flex items-center justify-between">
                  <span className="text-xs text-surface-400 font-mono">{file.size}</span>
                  <motion.button
                    onClick={() => handleDownload(file.title)}
                    className="btn btn-sm bg-surface-50 text-surface-700 border border-surface-200 hover:bg-aku-600 hover:text-white hover:border-aku-600 transition-all duration-200 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Download ${file.title}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </motion.button>
                </div>
              </motion.div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Eligibility + Announcements ─────────────────────────────
function InfoSection() {
  return (
    <section className="py-28 bg-surface-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aku-600/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Eligibility */}
          <div>
            <InView>
              <p className="section-label mb-3 text-aku-400">Who Can Participate</p>
              <h2 className="font-display text-white mb-10" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>
                ELIGIBILITY
              </h2>
            </InView>
            <ul className="space-y-4">
              {EVENT_INFO.eligibility.map((item, i) => (
                <InView key={i} delay={i * 0.06}>
                  <li className="flex items-start gap-4 group">
                    <motion.div
                      className="mt-0.5 w-6 h-6 rounded-lg bg-aku-600/20 border border-aku-600/40 flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-aku-600 group-hover:border-aku-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg className="w-3.5 h-3.5 text-aku-400 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <span className="text-surface-300 text-sm leading-relaxed">{item}</span>
                  </li>
                </InView>
              ))}
            </ul>
          </div>

          {/* Announcements */}
          <div>
            <InView>
              <p className="section-label mb-3 text-aku-400">Latest Updates</p>
              <h2 className="font-display text-white mb-10" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>
                ANNOUNCEMENTS
              </h2>
            </InView>
            <div className="space-y-3">
              {EVENT_INFO.announcements.map((a, i) => (
                <InView key={a.id} delay={i * 0.07}>
                  <motion.div
                    className="group bg-white/5 border border-white/10 rounded-2xl p-5 cursor-default transition-all duration-200"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)', y: -2 }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs font-semibold text-aku-400 font-mono">
                        {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {i === 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-aku-600/20 border border-aku-600/30 text-aku-400 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-aku-400 animate-pulse" />
                          New
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white mb-1 text-sm">{a.title}</h3>
                    <p className="text-xs text-surface-400 leading-relaxed">{a.content}</p>
                  </motion.div>
                </InView>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Key Dates ─────────────────────────────────────────────────
function KeyDates() {
  const dates = [
    { label: 'Registration Opens',   date: 'Feb 1, 2026',      status: 'done',     },
    { label: 'Registration Closes',  date: 'Feb 28, 2026',     status: 'active',   },
    { label: 'Verification Period',  date: 'Mar 1–10, 2026',   status: 'upcoming', },
    { label: 'Event Begins',         date: 'Mar 15, 2026',     status: 'upcoming', },
  ];

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <InView>
          <div className="mb-16">
            <p className="section-label mb-3">Timeline</p>
            <h2 className="font-display leading-none text-surface-900" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
              KEY DATES
            </h2>
          </div>
        </InView>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {dates.map((d, i) => (
            <InView key={i} delay={i * 0.08}>
              <motion.div
                className={`relative rounded-2xl p-7 border-2 overflow-hidden h-full min-h-[200px] flex flex-col justify-between ${
                  d.status === 'done'   ? 'bg-aku-600   border-aku-600   text-white' :
                  d.status === 'active' ? 'bg-surface-900 border-surface-800 text-white' :
                  'bg-white border-surface-200 text-surface-700'
                }`}
                whileHover={{ y: -3, transition: { duration: 0.2, ease } }}
              >
                <span
                  className="absolute bottom-3 right-4 font-display leading-none select-none pointer-events-none"
                  style={{
                    fontSize: '5rem',
                    opacity: d.status === 'upcoming' ? 0.05 : 0.12,
                    color: d.status !== 'upcoming' ? 'white' : 'black',
                  }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 text-base ${
                    d.status === 'done'   ? 'bg-white/20' :
                    d.status === 'active' ? 'bg-aku-600' :
                    'bg-surface-100'
                  }`}>
                    {d.status === 'done' ? (
                      <svg style={{width:'18px',height:'18px'}} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : d.status === 'active' ? (
                      <svg style={{width:'16px',height:'16px'}} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg style={{width:'16px',height:'16px'}} fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                    d.status === 'upcoming' ? 'text-surface-400' : 'opacity-60'
                  }`}>{d.label}</p>
                  <p className={`font-display text-2xl leading-none ${d.status === 'upcoming' ? 'text-surface-800' : ''}`}>
                    {d.date}
                  </p>
                </div>

                {d.status === 'active' && (
                  <div className="relative z-10 mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-aku-400 animate-pulse" />
                    <span className="text-xs font-semibold text-aku-400">Currently Active</span>
                  </div>
                )}
              </motion.div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────
function CTASection({ navigate }) {
  return (
    <section className="py-28 bg-surface-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aku-600/60 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-aku-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-3">
            <InView>
              <p className="section-label text-aku-400 mb-4">Ready to Compete?</p>
              <h2 className="font-display text-white leading-none mb-6" style={{ fontSize: 'clamp(2.5rem,7vw,6rem)' }}>
                REGISTER YOUR<br /><span style={{ color: '#45ae86' }}>UNIVERSITY</span><br />TODAY
              </h2>
              <p className="text-surface-400 text-lg mb-8 leading-relaxed max-w-lg">
                Spots are limited. Secure your university's place in Pakistan's biggest inter-university sports championship before the deadline.
              </p>
            </InView>
            <InView delay={0.1}>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => navigate('/login')}
                  className="btn btn-lg bg-aku-600 text-white hover:bg-aku-500 active:scale-[0.97] shadow-glow-lg group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => navigate('/admin/login')}
                  className="btn btn-lg bg-white/8 text-white border border-white/20 hover:bg-white/15 active:scale-[0.97]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Admin Portal
                </motion.button>
              </div>
            </InView>
          </div>

          {/* Right: contact cards */}
          <div className="lg:col-span-2">
            <InView delay={0.15}>
              <div className="space-y-3">
                {[
                  { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email Us', value: EVENT_INFO.contact.email },
                  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Call Us', value: EVENT_INFO.contact.phone },
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Venue', value: 'AKU Hospital, Stadium Road, Karachi' },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease }}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 hover:border-white/18 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-aku-600/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-aku-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 font-semibold uppercase tracking-wider mb-0.5">{c.label}</p>
                      <p className="text-sm text-white font-semibold truncate">{c.value}</p>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5, ease }}
                  className="flex items-center gap-3 bg-aku-600/15 border border-aku-600/30 rounded-2xl p-4"
                >
                  <span className="w-2 h-2 rounded-full bg-aku-400 animate-pulse flex-shrink-0" />
                  <p className="text-sm text-aku-300 font-semibold">Registration closes <span className="text-white">Feb 28, 2026</span></p>
                </motion.div>
              </div>
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="relative">
        <NavBar navigate={navigate} />
        <HeroSection navigate={navigate} />
      </div>
      <main>
        <SportsGrid />
        <HowToRegister navigate={navigate} />
        <InfoSection />
        <KeyDates />
        <Downloads />
        <CTASection navigate={navigate} />
      </main>
      <footer className="bg-surface-900 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-aku-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="font-display text-surface-400 text-sm tracking-wide">AKU OLYMPIAD 2026</span>
          </div>
          <p className="text-xs text-surface-600">© 2026 Aga Khan University, Karachi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
