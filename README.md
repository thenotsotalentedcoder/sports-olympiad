# National University Olympiad 2026 - Registration System

A modern, minimalist sports event registration and management system built for Aga Khan University's National University Olympiad 2026.

## 🎯 Features

### Public Portal
- **Homepage** - Clean, professional landing page with event information
- **Event Details** - Dates, venue, eligibility criteria, and announcements
- **Sports Showcase** - 8 available sports with registration details
- **Contact Information** - Easy access to event organizers

### University Portal
- **Secure Login** - University authentication system
- **Dashboard** - Overview of all registrations with status tracking
- **Team Registration** - Multi-step registration process:
  - Sport selection from 8 categories
  - Player information entry (name, DOB, CNIC)
  - CNIC document upload (front & back)
  - Draft saving functionality
  - Registration submission
- **Status Tracking** - Real-time status updates (Draft, Submitted, Verified)
- **Invoice Download** - PDF invoice generation for verified registrations

### Admin Portal
- **Admin Dashboard** - Complete overview of all university registrations
- **Registration Review** - Detailed player verification:
  - Document review (CNIC images)
  - Age eligibility verification (18-25 years)
  - Individual player approval/rejection
  - Rejection reason tracking
- **Registration Verification** - Final approval workflow
- **Statistics** - Real-time metrics and analytics

## 🏅 Available Sports

1. Cricket (Max 15 players) - PKR 15,000
2. Football (Max 18 players) - PKR 12,000
3. Basketball (Max 12 players) - PKR 10,000
4. Volleyball (Max 12 players) - PKR 8,000
5. Badminton (Max 8 players) - PKR 7,000
6. Athletics (Max 20 players) - PKR 9,000
7. Table Tennis (Max 6 players) - PKR 6,000
8. Hockey (Max 16 players) - PKR 11,000

## 🎨 Design Philosophy

- **Minimalist & Modern** - Clean lines, thoughtful spacing, professional aesthetic
- **AKU Branding** - Aga Khan University's signature green (#006747)
- **Consistent UI** - Uniform design language across all pages
- **Accessible** - Clear hierarchy, readable typography, intuitive navigation
- **Responsive** - Optimized for all screen sizes

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3
- **Typography**: Plus Jakarta Sans + Archivo
- **Icons**: Custom SVG components
- **Storage**: LocalStorage (no backend required)

## 📦 Installation

```bash
# Navigate to project directory
cd sports-olympiad

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Demo Credentials

### Universities
| University | Email | Password |
|------------|-------|----------|
| Punjab University | sports@pu.edu.pk | pu123 |
| NUST | athletics@nust.edu.pk | nust123 |
| LUMS | sports@lums.edu.pk | lums123 |
| UET Lahore | sports@uet.edu.pk | uet123 |
| FAST NUCES | olympiad@nu.edu.pk | fast123 |

### Admin
- **Email**: admin@olympiad.pk
- **Password**: admin123

## 🗂️ Project Structure

```
sports-olympiad/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx           # Public landing page
│   │   ├── Login.jsx               # Login page (University & Admin)
│   │   ├── UniversityDashboard.jsx # University dashboard
│   │   ├── RegistrationForm.jsx    # Multi-step registration form
│   │   ├── RegistrationDetails.jsx # View registration details
│   │   ├── AdminDashboard.jsx      # Admin overview
│   │   ├── AdminReview.jsx         # Review & verify registrations
│   │   └── Icons.jsx               # SVG icon components
│   ├── data/
│   │   └── mockData.js             # Mock data & constants
│   ├── utils/
│   │   ├── auth.js                 # Authentication utilities
│   │   ├── storage.js              # LocalStorage management
│   │   └── invoice.js              # Invoice generation
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔄 User Flows

### University Registration Flow
1. Visit homepage → Click "Register Now"
2. Login with university credentials
3. Create new registration
4. Select sports to participate in
5. Add players for each sport (with CNIC uploads)
6. Save as draft OR submit for review
7. Track approval status
8. Download invoice once verified

### Admin Verification Flow
1. Login to admin portal
2. View all pending registrations
3. Click "Review & Verify" on a registration
4. Review each player:
   - Check age eligibility
   - View CNIC documents
   - Approve or reject with reason
5. Verify entire registration once all players reviewed
6. University can now download invoice

## 💾 Data Storage

All data is stored in browser's localStorage:
- **auth** - Current user session
- **registrations** - All registration data
- **olympiad_initialized** - Initialization flag

## 🎯 Key Features

### For Universities
- ✅ Draft saving - Resume registration anytime
- ✅ Multi-sport registration in single submission
- ✅ Document upload for player verification
- ✅ Real-time status tracking
- ✅ Downloadable invoices

### For Admins
- ✅ Centralized dashboard with statistics
- ✅ Player-level verification control
- ✅ Age eligibility checking
- ✅ Document review with zoom
- ✅ Rejection reason tracking
- ✅ Bulk registration overview

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

This is a proof of concept for demonstration purposes.

## 👥 Contact

For questions about the Olympiad:
- **Email**: info@olympiad.pk
- **Phone**: +92-51-1234567
- **Location**: National Sports Complex, Islamabad, Pakistan

---

**Built with ❤️ for Aga Khan University**
