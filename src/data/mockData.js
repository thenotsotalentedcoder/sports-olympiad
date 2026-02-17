// Sports available for registration
export const SPORTS = [
  { id: 'cricket',     name: 'Cricket',      color: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50',     textColor: 'text-blue-700',   bgColor: 'bg-blue-500',   maxPlayers: 15 },
  { id: 'football',   name: 'Football',     color: 'border-green-200 hover:border-green-500 hover:bg-green-50',   textColor: 'text-green-700',  bgColor: 'bg-green-500',  maxPlayers: 18 },
  { id: 'basketball', name: 'Basketball',   color: 'border-orange-200 hover:border-orange-500 hover:bg-orange-50',textColor: 'text-orange-700', bgColor: 'bg-orange-500', maxPlayers: 12 },
  { id: 'volleyball', name: 'Volleyball',   color: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50',textColor: 'text-purple-700', bgColor: 'bg-purple-500', maxPlayers: 12 },
  { id: 'badminton',  name: 'Badminton',    color: 'border-pink-200 hover:border-pink-500 hover:bg-pink-50',      textColor: 'text-pink-700',   bgColor: 'bg-pink-500',   maxPlayers: 8  },
  { id: 'athletics',  name: 'Athletics',    color: 'border-red-200 hover:border-red-500 hover:bg-red-50',         textColor: 'text-red-700',    bgColor: 'bg-red-500',    maxPlayers: 20 },
  { id: 'tabletennis',name: 'Table Tennis', color: 'border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50',textColor: 'text-yellow-700', bgColor: 'bg-yellow-500', maxPlayers: 6  },
  { id: 'hockey',     name: 'Hockey',       color: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50',textColor: 'text-indigo-700', bgColor: 'bg-indigo-500', maxPlayers: 16 },
];

// Fee structure per sport
export const SPORT_FEES = {
  cricket:     15000,
  football:    12000,
  basketball:  10000,
  volleyball:  8000,
  badminton:   7000,
  athletics:   9000,
  tabletennis: 6000,
  hockey:      11000,
};

// Mock universities — 8 real Pakistan universities
export const UNIVERSITIES = [
  { id: 'uni1', name: 'Punjab University',   code: 'PU',   email: 'sports@pu.edu.pk',      password: 'pu123'   },
  { id: 'uni2', name: 'NUST',                code: 'NUST', email: 'athletics@nust.edu.pk',  password: 'nust123' },
  { id: 'uni3', name: 'LUMS',                code: 'LUMS', email: 'sports@lums.edu.pk',     password: 'lums123' },
  { id: 'uni4', name: 'UET Lahore',          code: 'UET',  email: 'sports@uet.edu.pk',      password: 'uet123'  },
  { id: 'uni5', name: 'FAST NUCES',          code: 'FAST', email: 'olympiad@nu.edu.pk',     password: 'fast123' },
  { id: 'uni6', name: 'Quaid-i-Azam University', code: 'QAU', email: 'sports@qau.edu.pk',  password: 'qau123'  },
  { id: 'uni7', name: 'University of Karachi', code: 'UoK', email: 'sports@uok.edu.pk',    password: 'uok123'  },
  { id: 'uni8', name: 'IBA Karachi',         code: 'IBA',  email: 'sports@iba.edu.pk',      password: 'iba123'  },
];

// Admin credentials
export const ADMIN = {
  email: 'admin@olympiad.pk',
  password: 'admin123',
};

// ── Player factory ──────────────────────────────────────────
const p = (name, dob, cnic, status = 'pending', rejectionReason = null) => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  dob,
  cnic,
  cnicFront: `https://placehold.co/400x250/006747/FFFFFF/png?text=CNIC+Front`,
  cnicBack:  `https://placehold.co/400x250/004d34/FFFFFF/png?text=CNIC+Back`,
  status,
  rejectionReason,
  createdAt: new Date().toISOString(),
});

// ── Mock registrations — 12 registrations across all universities ──
export const MOCK_REGISTRATIONS = [
  // ── reg1: Punjab University — Cricket + Football — submitted, mixed player status
  {
    id: 'reg1',
    universityId: 'uni1',
    universityName: 'Punjab University',
    sports: ['cricket', 'football'],
    players: {
      cricket: [
        p('Ahmed Raza Khan',     '2002-03-15', '35202-9876543-1', 'approved'),
        p('Hassan Ali Malik',    '2001-07-22', '35202-9876543-2', 'approved'),
        p('Bilal Ahmed Siddiqui','2003-01-10', '35202-9876543-3', 'approved'),
        p('Kamran Akmal Jr.',    '2002-11-05', '35202-9876543-4', 'approved'),
        p('Sohail Tanvir',       '2004-06-18', '35202-9876543-5', 'pending'),
        p('Iftikhar Hussain',    '2001-09-30', '35202-9876543-6', 'pending'),
        p('Mohammad Wasim',      '2003-04-22', '35202-9876543-7', 'rejected', 'Incomplete CNIC documentation'),
      ],
      football: [
        p('Usman Sheikh',        '2002-05-18', '35202-9876544-1', 'approved'),
        p('Farhan Malik',        '2001-11-25', '35202-9876544-2', 'approved'),
        p('Junaid Akhtar',       '2003-08-14', '35202-9876544-3', 'pending'),
        p('Tariq Aziz',          '2000-12-02', '35202-9876544-4', 'rejected', 'Age exceeds 25-year limit — born in 2000'),
        p('Zubair Rehman',       '2002-07-29', '35202-9876544-5', 'pending'),
      ],
    },
    status: 'submitted',
    submittedAt: '2026-02-10T10:30:00Z',
    totalAmount: 27000,
  },

  // ── reg2: NUST — Basketball + Athletics + Volleyball — submitted, all pending
  {
    id: 'reg2',
    universityId: 'uni2',
    universityName: 'NUST',
    sports: ['basketball', 'athletics', 'volleyball'],
    players: {
      basketball: [
        p('Zain Abbas',          '2002-08-12', '35202-1111111-1', 'pending'),
        p('Saad Raza',           '2003-02-20', '35202-1111111-2', 'pending'),
        p('Owais Rehman',        '2001-10-07', '35202-1111111-3', 'pending'),
        p('Fawad Alam',          '2004-01-15', '35202-1111111-4', 'pending'),
        p('Nasir Hussain',       '2002-06-11', '35202-1111111-5', 'pending'),
      ],
      athletics: [
        p('Hamza Tariq',         '2001-06-05', '35202-1111112-1', 'pending'),
        p('Shahid Afridi II',    '2003-12-01', '35202-1111112-2', 'pending'),
        p('Rizwan Mehmood',      '2002-04-18', '35202-1111112-3', 'pending'),
        p('Asif Iqbal',          '2001-09-27', '35202-1111112-4', 'pending'),
      ],
      volleyball: [
        p('Daniyal Baig',        '2003-07-08', '35202-1111113-1', 'pending'),
        p('Omer Farooq',         '2002-03-14', '35202-1111113-2', 'pending'),
        p('Salman Butt Jr.',     '2004-11-19', '35202-1111113-3', 'pending'),
      ],
    },
    status: 'submitted',
    submittedAt: '2026-02-12T14:20:00Z',
    totalAmount: 27000,
  },

  // ── reg3: LUMS — Badminton + Table Tennis — VERIFIED, all approved
  {
    id: 'reg3',
    universityId: 'uni3',
    universityName: 'LUMS',
    sports: ['badminton', 'tabletennis'],
    players: {
      badminton: [
        p('Ali Raza',            '2002-04-10', '35202-2222222-1', 'approved'),
        p('Fahad Iqbal',         '2003-09-15', '35202-2222222-2', 'approved'),
        p('Haris Sohail',        '2001-12-28', '35202-2222222-3', 'approved'),
        p('Imran Butt',          '2002-08-03', '35202-2222222-4', 'approved'),
      ],
      tabletennis: [
        p('Khurram Manzoor',     '2003-06-22', '35202-2222223-1', 'approved'),
        p('Noman Ali',           '2002-10-16', '35202-2222223-2', 'approved'),
        p('Sharjeel Khan',       '2001-04-05', '35202-2222223-3', 'approved'),
      ],
    },
    status: 'verified',
    submittedAt: '2026-02-08T09:15:00Z',
    totalAmount: 13000,
  },

  // ── reg4: UET Lahore — Football + Hockey — submitted, mostly pending
  {
    id: 'reg4',
    universityId: 'uni4',
    universityName: 'UET Lahore',
    sports: ['football', 'hockey'],
    players: {
      football: [
        p('Adnan Akmal',         '2002-09-14', '35202-3333333-1', 'approved'),
        p('Wahab Riaz Jr.',      '2003-05-27', '35202-3333333-2', 'approved'),
        p('Mohammad Irfan II',   '2002-01-31', '35202-3333333-3', 'pending'),
        p('Shoaib Akhtar III',   '2001-08-13', '35202-3333333-4', 'pending'),
        p('Umar Gul',            '2003-11-04', '35202-3333333-5', 'pending'),
        p('Danish Kaneria Jr.',  '2002-07-19', '35202-3333333-6', 'pending'),
      ],
      hockey: [
        p('Sohail Abbas Jr.',    '2001-02-08', '35202-3333334-1', 'approved'),
        p('Rehan Butt',          '2003-10-22', '35202-3333334-2', 'pending'),
        p('Shakeel Abbasi',      '2002-06-15', '35202-3333334-3', 'pending'),
        p('Tariq Azam',          '2004-03-07', '35202-3333334-4', 'pending'),
        p('Waseem Akram II',     '2001-12-11', '35202-3333334-5', 'pending'),
      ],
    },
    status: 'submitted',
    submittedAt: '2026-02-14T11:45:00Z',
    totalAmount: 23000,
  },

  // ── reg5: FAST NUCES — Cricket + Basketball + Badminton — VERIFIED
  {
    id: 'reg5',
    universityId: 'uni5',
    universityName: 'FAST NUCES',
    sports: ['cricket', 'basketball', 'badminton'],
    players: {
      cricket: [
        p('Babar Azam Fan',      '2002-10-15', '35202-4444444-1', 'approved'),
        p('Shaheen Afridi II',   '2003-02-06', '35202-4444444-2', 'approved'),
        p('Naseem Shah Jr.',     '2001-08-11', '35202-4444444-3', 'approved'),
        p('Mohammad Rizwan II',  '2002-06-01', '35202-4444444-4', 'approved'),
        p('Fakhar Zaman Jr.',    '2003-12-30', '35202-4444444-5', 'approved'),
      ],
      basketball: [
        p('Sarfraz Ahmed Jr.',   '2001-05-22', '35202-4444445-1', 'approved'),
        p('Asad Shafiq Jr.',     '2002-07-14', '35202-4444445-2', 'approved'),
        p('Azhar Ali Jr.',       '2003-03-28', '35202-4444445-3', 'approved'),
      ],
      badminton: [
        p('Shan Masood Jr.',     '2002-09-01', '35202-4444446-1', 'approved'),
        p('Abdullah Shafique',   '2001-11-17', '35202-4444446-2', 'approved'),
        p('Imam-ul-Haq II',      '2003-01-24', '35202-4444446-3', 'approved'),
      ],
    },
    status: 'verified',
    submittedAt: '2026-02-07T08:00:00Z',
    totalAmount: 32000,
  },

  // ── reg6: QAU — Athletics — submitted, mixed
  {
    id: 'reg6',
    universityId: 'uni6',
    universityName: 'Quaid-i-Azam University',
    sports: ['athletics'],
    players: {
      athletics: [
        p('Arshad Nadeem Fan',   '2002-01-02', '35202-5555555-1', 'approved'),
        p('Talha Talib II',      '2003-04-09', '35202-5555555-2', 'approved'),
        p('Nooh Dastgir Fan',    '2001-07-16', '35202-5555555-3', 'pending'),
        p('Inam Butt Fan',       '2002-11-23', '35202-5555555-4', 'pending'),
        p('Qaiser Abbas',        '2003-08-30', '35202-5555555-5', 'rejected', 'Medical fitness certificate missing'),
        p('Rizwan Haider',       '2001-03-05', '35202-5555555-6', 'pending'),
      ],
    },
    status: 'submitted',
    submittedAt: '2026-02-13T16:00:00Z',
    totalAmount: 9000,
  },

  // ── reg7: University of Karachi — Volleyball + Hockey — submitted, all pending
  {
    id: 'reg7',
    universityId: 'uni7',
    universityName: 'University of Karachi',
    sports: ['volleyball', 'hockey'],
    players: {
      volleyball: [
        p('Asim Azam',           '2003-05-12', '35202-6666666-1', 'pending'),
        p('Bilal Asif Jr.',      '2002-02-26', '35202-6666666-2', 'pending'),
        p('Faisal Iqbal Jr.',    '2001-10-08', '35202-6666666-3', 'pending'),
        p('Ghulam Murtaza',      '2003-07-19', '35202-6666666-4', 'pending'),
        p('Hassan Raza Jr.',     '2002-04-03', '35202-6666666-5', 'pending'),
      ],
      hockey: [
        p('Imran Butt Jr.',      '2001-08-15', '35202-6666667-1', 'pending'),
        p('Junaid Khan II',      '2003-01-29', '35202-6666667-2', 'pending'),
        p('Khalid Latif Jr.',    '2002-09-11', '35202-6666667-3', 'pending'),
        p('Lahore Express',      '2001-06-06', '35202-6666667-4', 'pending'),
        p('Mukhtar Ahmed Jr.',   '2003-11-21', '35202-6666667-5', 'pending'),
        p('Naved Ul Hasan Jr.',  '2002-03-17', '35202-6666667-6', 'pending'),
      ],
    },
    status: 'submitted',
    submittedAt: '2026-02-15T09:30:00Z',
    totalAmount: 19000,
  },

  // ── reg8: IBA Karachi — Table Tennis + Badminton — VERIFIED
  {
    id: 'reg8',
    universityId: 'uni8',
    universityName: 'IBA Karachi',
    sports: ['tabletennis', 'badminton'],
    players: {
      tabletennis: [
        p('Omar Associates',     '2002-06-14', '35202-7777777-1', 'approved'),
        p('Parvez Rasool Fan',   '2001-09-28', '35202-7777777-2', 'approved'),
        p('Qasim Akram',         '2003-12-07', '35202-7777777-3', 'approved'),
      ],
      badminton: [
        p('Rameez Raja Jr.',     '2002-08-24', '35202-7777778-1', 'approved'),
        p('Saleem Malik Jr.',    '2001-04-15', '35202-7777778-2', 'approved'),
        p('Tahir Naqqash Jr.',   '2003-02-11', '35202-7777778-3', 'approved'),
        p('Umar Akmal Jr.',      '2002-10-30', '35202-7777778-4', 'approved'),
      ],
    },
    status: 'verified',
    submittedAt: '2026-02-06T07:45:00Z',
    totalAmount: 13000,
  },

  // ── reg9: Punjab University draft (second registration)
  {
    id: 'reg9',
    universityId: 'uni1',
    universityName: 'Punjab University',
    sports: ['hockey', 'athletics'],
    players: {
      hockey: [
        p('Waleed Karim',        '2002-07-04', '35202-8888888-1', 'pending'),
        p('Yasir Shah Fan',      '2003-05-20', '35202-8888888-2', 'pending'),
        p('Zafar Gohar Jr.',     '2001-11-16', '35202-8888888-3', 'pending'),
      ],
      athletics: [
        p('Abid Ali Jr.',        '2002-03-08', '35202-8888889-1', 'pending'),
        p('Azam Khan Jr.',       '2003-09-25', '35202-8888889-2', 'pending'),
      ],
    },
    status: 'draft',
    submittedAt: null,
    totalAmount: 20000,
  },

  // ── reg10: NUST second registration — draft
  {
    id: 'reg10',
    universityId: 'uni2',
    universityName: 'NUST',
    sports: ['cricket'],
    players: {
      cricket: [
        p('Babar Khan',          '2003-01-18', '35202-9999999-1', 'pending'),
        p('Fawad Alam Jr.',      '2002-06-12', '35202-9999999-2', 'pending'),
        p('Imad Wasim Fan',      '2001-11-03', '35202-9999999-3', 'pending'),
      ],
    },
    status: 'draft',
    submittedAt: null,
    totalAmount: 15000,
  },

  // ── reg11: UET second registration — verified
  {
    id: 'reg11',
    universityId: 'uni4',
    universityName: 'UET Lahore',
    sports: ['basketball', 'volleyball'],
    players: {
      basketball: [
        p('Javed Miandad Fan',   '2002-04-17', '35202-1010101-1', 'approved'),
        p('Kamran Younis Fan',   '2003-10-09', '35202-1010101-2', 'approved'),
        p('Liaqat Ali Shah',     '2001-07-31', '35202-1010101-3', 'approved'),
        p('Misbah Fan',          '2002-12-22', '35202-1010101-4', 'approved'),
      ],
      volleyball: [
        p('Naved Ashraf',        '2003-02-14', '35202-1010102-1', 'approved'),
        p('Obaid Kamal',         '2001-08-06', '35202-1010102-2', 'approved'),
        p('Pervez Musharraf Fan','2002-05-27', '35202-1010102-3', 'approved'),
      ],
    },
    status: 'verified',
    submittedAt: '2026-02-09T12:00:00Z',
    totalAmount: 18000,
  },

  // ── reg12: FAST NUCES — football — submitted, some issues
  {
    id: 'reg12',
    universityId: 'uni5',
    universityName: 'FAST NUCES',
    sports: ['football'],
    players: {
      football: [
        p('Qasim Omar Fan',      '2002-08-20', '35202-1212121-1', 'approved'),
        p('Rameez Ahmed',        '2003-04-11', '35202-1212121-2', 'approved'),
        p('Saeed Anwar Jr.',     '2001-01-09', '35202-1212121-3', 'pending'),
        p('Taufeeq Umar Jr.',    '2002-09-14', '35202-1212121-4', 'pending'),
        p('Umar Farooq',         '1999-06-02', '35202-1212121-5', 'rejected', 'Age ineligible — born 1999, exceeds 25-year limit'),
        p('Yousuf Youhana Fan',  '2003-11-28', '35202-1212121-6', 'pending'),
      ],
    },
    status: 'submitted',
    submittedAt: '2026-02-16T10:00:00Z',
    totalAmount: 12000,
  },
];

// Event information
export const EVENT_INFO = {
  name: 'AKU Sports Olympiad 2026',
  tagline: 'Compete. Excel. Triumph.',
  description: 'Hosted by Aga Khan University, Karachi. The premier inter-university sports championship bringing together the best athletic talent from across Pakistan.',
  startDate: '2026-03-15',
  endDate: '2026-03-20',
  registrationDeadline: '2026-02-28',
  venue: 'Aga Khan University Hospital, Karachi',
  eligibility: [
    'Must be a currently enrolled student with valid student ID',
    'Age limit: 18–25 years at time of event',
    'Valid CNIC required for all participants',
    'Medical fitness certificate mandatory',
    'Each university may register multiple sports teams',
    'Minimum 3 players required per team to register a sport',
    'All players must be Pakistani nationals',
  ],
  announcements: [
    {
      id: 1,
      date: '2026-02-17',
      title: 'Verification Starts Tomorrow',
      content: 'Admin review begins Feb 18. Universities with submitted registrations will be notified of any issues within 3 working days.',
    },
    {
      id: 2,
      date: '2026-02-15',
      title: 'Registration Deadline Extended',
      content: 'Registration deadline has been extended to Feb 28, 2026 due to high demand. Over 30 universities already registered!',
    },
    {
      id: 3,
      date: '2026-02-12',
      title: 'Venue Confirmed — AKU Karachi',
      content: 'Event will be held at Aga Khan University Hospital, Karachi. World-class facilities with 5,000 spectator capacity across multiple sports grounds.',
    },
    {
      id: 4,
      date: '2026-02-08',
      title: 'Prize Pool: PKR 5 Million',
      content: 'Total prize pool confirmed at PKR 5,000,000 across all 8 sports categories. Trophy + cash prizes for top 3 teams per sport.',
    },
    {
      id: 5,
      date: '2026-02-05',
      title: 'Medical Fitness Requirements',
      content: 'All registered players must submit a medical fitness certificate from a registered physician. No exceptions.',
    },
  ],
  contact: {
    email: 'olympiad@aku.edu',
    phone: '+92-21-3486-4400',
    address: 'Aga Khan University Hospital, Stadium Road, Karachi 74800',
  },
};

// Data version — bump this to force re-seed on next load
const DATA_VERSION = 'v4';

// Initialize localStorage with mock data
export const initializeMockData = () => {
  const stored = localStorage.getItem('olympiad_initialized');
  if (stored !== DATA_VERSION) {
    localStorage.setItem('registrations', JSON.stringify(MOCK_REGISTRATIONS));
    localStorage.setItem('olympiad_initialized', DATA_VERSION);
    // Clear stale auth so demo credentials still work
    localStorage.removeItem('auth');
  }
};

// Reset mock data (call from browser console: resetMockData())
export const resetMockData = () => {
  localStorage.removeItem('olympiad_initialized');
  localStorage.removeItem('registrations');
  localStorage.removeItem('auth');
  initializeMockData();
  window.location.reload();
};

// Expose reset globally for easy demo reset
if (typeof window !== 'undefined') {
  window.resetMockData = () => {
    localStorage.clear();
    initializeMockData();
    window.location.reload();
  };
}
