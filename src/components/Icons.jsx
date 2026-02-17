// ── Consistent 24×24 Heroicons-style SVG icons ────────────
// All use viewBox="0 0 24 24", stroke-based, strokeWidth 1.5

const icon = (d) => (props = {}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className || 'w-5 h-5'}
    aria-hidden="true"
  >
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

export const Icons = {
  Trophy:   icon('M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'),
  Calendar: icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
  Location: icon(['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z']),
  Clock:    icon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'),
  Check:    icon('M5 13l4 4L19 7'),
  User:     icon(['M16 7a4 4 0 11-8 0 4 4 0 018 0z', 'M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z']),
  Building: icon('M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'),
  Arrow:    icon('M17 8l4 4m0 0l-4 4m4-4H3'),
  Logout:   icon('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'),
  Plus:     icon('M12 4v16m8-8H4'),
  Trash:    icon('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'),
  Eye:      icon(['M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']),
  Download: icon('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'),
  X:        icon('M6 18L18 6M6 6l12 12'),
  Chevron:  icon('M9 5l7 7-7 7'),
  Shield:   icon('M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'),
  Warn:     icon('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'),
  Info:     icon('M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'),
  Doc:      icon(['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2', 'M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4']),
};

// ── Sport emoji icons ───────────────────────────────────────
const SPORT_EMOJI = {
  cricket:     '🏏',
  football:    '⚽',
  basketball:  '🏀',
  volleyball:  '🏐',
  badminton:   '🏸',
  athletics:   '🏃',
  tabletennis: '🏓',
  hockey:      '🏒',
};

export function SportIcon({ sportId, className = 'w-5 h-5', size = '1.1rem' }) {
  const emoji = SPORT_EMOJI[sportId];
  if (!emoji) return null;
  return (
    <span
      style={{ fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}

// Large sport emoji for card display
export function SportEmoji({ sportId, size = '1.5rem' }) {
  const emoji = SPORT_EMOJI[sportId];
  if (!emoji) return null;
  return (
    <span style={{ fontSize: size, lineHeight: 1 }} role="img" aria-label={sportId}>
      {emoji}
    </span>
  );
}
