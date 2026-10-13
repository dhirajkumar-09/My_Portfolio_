# 🌐 Dhiraj Kumar - Personal Portfolio & Systems Hub

A personal portfolio website engineered for **DHIRAJ KUMAR**, a B.Tech Computer Science & Engineering (IoT Specialization) 2nd-year student at **Bakhtiyarpur College of Engineering, Patna, India**.

Designed with a modern "startup-founder" aesthetic: dark/light theme, interactive IoT canvas particle mesh, glassmorphism cards, Framer Motion transitions, custom cursor glow, dynamic Firebase Firestore integration, and a protected Admin Dashboard (`/admin`).

---

## 🌟 Key Highlights

- **Hero Section**: Dynamic roles typing animation (*"CSE Student"*, *"IoT Enthusiast"*, *"Full-Stack Developer"*, *"Problem Solver"*), career value statement, instant resume download, direct contact CTA, and live terminal badge.
- **About Section**: Career objective bio, engineering pillars (IoT & Hardware Interfacing, Full-Stack Architecture, DSA), and animated counters (*10+ Projects, 12+ Tech, 2+ Years Learning, 150+ DSA*).
- **Education Timeline**: Vertical interactive milestone timeline highlighting:
  - **B.Tech CSE (IoT Specialization)**, Bakhtiyarpur College of Engineering, Patna (2nd Year, 2023–2027)
  - **Senior Secondary (Class XII)**, UHS Mirzaganj, Jamui: 74.0%
  - **Secondary (Class X)**, UHS Mirzaganj, Jamui: 90.0% Distinction
- **Technical Skills**: Filterable visual proficiency bars and icon chips across Languages (*Python, Java, C*), Web (*React, JavaScript, HTML5/CSS3, Tailwind*), Database (*Firebase, SQL*), Tools (*Git, GitHub, VS Code*), and Soft Skills.
- **Projects Showcase**: Filterable cards and deep-dive architectural modal:
  1. 🏟️ **Stadium Controller**: Software-based crowd management and bottleneck detection system for stadiums with telemetry and alerts.
  2. 🤝 **Darpan (Sathi)**: Empathetic AI-powered companion web app providing emotional support, speech synthesis, and mood reflection.
  3. 📚 **EduForge**: Algorithmic exam-preparation platform creating personalized study roadmaps and weighted syllabus breakdowns.
- **Contact & Inbox**: Anti-spam honeypot + rate limiting, instant writes to Firestore `messages`, email notification dispatch to `dhirajku00021@gmail.com`, celebratory confetti, and direct contact details.
- **Protected Admin Portal (`/admin`)**:
  - Firebase Authentication (Email/Password or Google Sign-In)
  - Full CRUD for Projects, Skills, Education, and Bio
  - Upload & replace Resume PDF
  - Visitor Inbox view: real-time updates, read/unread filters, search, delete, and direct "Reply via Email" mailto helper
  - One-click Firestore Seeder
- **Extra Polish**: Preloader, theme toggle persisted in `localStorage`, desktop custom cursor glow, skeleton loaders, and 404 page.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite 8 |
| **Styling & Design** | Tailwind CSS 3.4 + Glassmorphism + Responsive Design |
| **Motion & Animation** | Framer Motion 12 + Canvas Particle Mesh |
| **Icons** | Lucide React + Custom SVG Brand Badges |
| **Database & Auth** | Firebase 12 (Cloud Firestore, Firebase Authentication, Cloud Storage) |
| **Email Delivery** | EmailJS / Firebase Trigger Email extension |
| **Effects** | Canvas Confetti |

---

## 📁 Project Structure

```
c:\My_Portfolio\
├── public/
│   ├── favicon.svg             # Custom geometric neon DK favicon
│   ├── resume.pdf              # Downloadable resume PDF
│   └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky glass navbar with active section indicator
│   │   ├── Footer.jsx          # Socials, campus info, back-to-top button
│   │   ├── CustomCursor.jsx    # Desktop cursor ambient glow
│   │   ├── ParticleBackground.jsx # Canvas IoT constellation node mesh
│   │   ├── ThemeToggle.jsx     # Dark / Light theme toggle
│   │   ├── Preloader.jsx       # Startup-aesthetic loading screen
│   │   ├── SectionHeading.jsx  # Consistent animated section titles
│   │   ├── ProjectModal.jsx    # Deep-dive architecture modal
│   │   ├── SocialIcons.jsx     # SVG brand icons
│   │   └── Toast.jsx           # Success / error toast notifications
│   ├── sections/
│   │   ├── Hero.jsx            # Typing roles, value statement, CTAs
│   │   ├── About.jsx           # Bio, pillars, stats counters
│   │   ├── Education.jsx       # Vertical interactive timeline
│   │   ├── Skills.jsx          # Grouped skill category cards & bars
│   │   ├── Projects.jsx        # Filterable project catalog & skeletons
│   │   └── Contact.jsx         # Contact form, anti-spam, inbox dispatch
│   ├── pages/
│   │   ├── Home.jsx            # Portfolio landing page
│   │   ├── Admin.jsx           # Protected CRUD & inbox dashboard
│   │   └── NotFound.jsx        # 404 error page
│   ├── services/
│   │   ├── firebase.js         # Firebase initialization & fallback
│   │   ├── portfolioService.js # Firestore CRUD & real-time listeners
│   │   └── emailService.js     # EmailJS inbox dispatcher
│   ├── context/
│   │   ├── ThemeContext.jsx    # Dark/light theme context
│   │   └── AuthContext.jsx     # Admin auth state & demo mode
│   ├── data/
│   │   └── defaultPortfolioData.js # Preloaded resume & project data
│   ├── App.jsx                 # Route splitting & suspense
│   ├── main.jsx                # App entrypoint & providers
│   └── index.css               # Tailwind directives & glass utilities
├── scripts/
│   └── seed.js                 # Standalone Firestore seeder
├── firestore.rules             # Production Firestore security rules
├── storage.rules               # Production Storage security rules
├── firebase.json               # Firebase Hosting configuration
├── tailwind.config.js          # Custom theme colors & glow keyframes
├── .env.example                # Environment variables template
├── FIREBASE_SETUP.md           # Step-by-step Firebase guide
├── EMAIL_SETUP.md              # Email notification guide
└── DEPLOYMENT.md               # Firebase & Vercel deployment guide
```

---

## 🚀 Quickstart (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Local Preview)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: The portfolio includes complete offline fallback data, so it runs immediately out-of-the-box even before you link Firebase credentials!)*

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔐 Accessing the Admin Dashboard

- Navigate to `/admin` (or click the **Admin** button in the navbar).
- You can sign in using **Email/Password**, **Google Sign-In**, or click **Instant Demo Admin Access** to evaluate all CRUD tools immediately.
- The Admin Panel allows you to:
  - Add, edit, or delete projects
  - Inspect visitor inquiries and mark as read/unread
  - Reply via email with prefilled subject lines
  - Edit bio and upload a new resume PDF
  - Seed Firestore with one click

---

## 🛡️ Security Rules

The repository includes production-ready [`firestore.rules`](./firestore.rules) and [`storage.rules`](./storage.rules):
- **Public**: Can read profile, projects, skills, education.
- **Public**: Can only `create` on `messages` with validated string fields (no reads, updates, or deletes).
- **Admin**: Only authenticated admin (`dhirajku00021@gmail.com`) can read messages and write to any collection.

---

## 👤 Author

**Dhiraj Kumar**  
- **Degree**: B.Tech in Computer Science & Engineering (IoT Specialization), 2nd Year (2023–2027)  
- **Institution**: Bakhtiyarpur College of Engineering, Patna, Bihar, India  
- **Email**: [dhirajku00021@gmail.com](mailto:dhirajku00021@gmail.com)  
