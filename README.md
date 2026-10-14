# 💎 Dhiraj Kumar — Computer Science & IoT Engineering Portfolio

<div align="center">

![Portfolio Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.2-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

**An ultra-premium, interactive animated portfolio showcasing Computer Science, IoT Hardware Telemetry & Full-Stack Web Engineering.**

[Explore Live Demo](https://github.com/dhirajkumar-09/My_Portfolio_) • [Report Bug](https://github.com/dhirajkumar-09/My_Portfolio_/issues) • [Request Feature](https://github.com/dhirajkumar-09/My_Portfolio_/issues)

</div>

---

## 🌟 Highlights & Key Features

- **⚡ 100% Zero-Backend Architecture**:
  - No database latency, no Firebase setup, and no auth hurdles.
  - All portfolio content is centralized in a single modular data file: [`src/data/portfolioData.js`](src/data/portfolioData.js).
  - Edit your JSX/data documentation directly in code and changes hot-reload instantly!
- **💼 Interactive Hero Showcase**:
  - High-impact typography, status pill, real-time typing animation cycling technical roles.
  - Instant resume download, direct project links, and live GitHub telemetry.
- **🏅 Executive Highlights Ribbon**:
  - 4 quick impact metrics (`10+ Projects Built`, `14+ Tech Stack`, `150+ DSA Solved`, `Top 1% Commitment`).
- **🏛️ Core Engineering Focus Pillars**:
  - Dynamic cards highlighting competencies in *IoT & Embedded Systems*, *Modern Full-Stack Architecture*, *Data Structures & Algorithms*, and *System Design & Telemetry Pipelines*.
- **📊 Interactive Project Showcase & Deep-Dive Modal**:
  - Filterable portfolio cards by category (*IoT & Systems*, *AI & Web*, *Full-Stack*).
  - High-resolution modal with key architectural highlights, metrics, live URLs, and GitHub source links.
- **🎓 Academic Milestones & Timeline**:
  - Structured chronological education path from B.Tech CSE (Bakhtiyarpur College of Engineering, Patna) to Senior Secondary.
- **📬 Responsive Contact Hub**:
  - Direct email messaging, local message history caching, anti-spam rate limiting, and celebratory confetti.
- **🌓 Adaptive Theme Engine**:
  - Seamless dark and light modes with custom cursor glow, glassmorphism, and responsive design across all devices.

---

## 📁 Repository Structure

```text
c:\My_Portfolio\
├── public/
│   ├── favicon.svg             # Custom geometric monogram favicon
│   └── resume.pdf              # Downloadable resume PDF
├── src/
│   ├── assets/                 # Static images and icons
│   ├── components/             # Reusable UI & animation components
│   │   ├── CustomCursor.jsx    # Fluid desktop cursor glow
│   │   ├── Footer.jsx          # Footer with navigation & socials
│   │   ├── Navbar.jsx          # Frosted glass navbar with active section spy
│   │   ├── ParticleBackground.jsx # Constellation node background mesh
│   │   ├── Preloader.jsx       # Elegant startup preloader animation
│   │   ├── ProjectModal.jsx    # Project deep-dive modal
│   │   ├── SectionHeading.jsx  # Reusable section title component
│   │   ├── SocialIcons.jsx     # Clean SVG brand vectors (GitHub, LinkedIn)
│   │   ├── ThemeToggle.jsx     # Dark / Light theme toggle switch
│   │   └── Toast.jsx           # Notification toast alerts
│   ├── context/
│   │   └── ThemeContext.jsx    # Persistent dark/light theme state
│   ├── data/
│   │   └── portfolioData.js    # 🌟 MASTER DATA HUB (Edit everything here!)
│   ├── pages/
│   │   ├── Home.jsx            # Main single-page portfolio layout
│   │   └── NotFound.jsx        # 404 fallback page
│   ├── sections/
│   │   ├── Hero.jsx            # Hero section with dynamic typing & ribbon
│   │   ├── About.jsx           # Bio, metrics & engineering focus pillars
│   │   ├── Education.jsx       # Chronological academic milestones
│   │   ├── Skills.jsx          # Filterable skills with category badges
│   │   ├── Projects.jsx        # Filterable project showcase grid
│   │   ├── Certificates.jsx    # Verified credentials & certifications
│   │   └── Contact.jsx         # Contact form & social connection hub
│   ├── services/
│   │   ├── emailService.js     # EmailJS contact delivery helper
│   │   └── githubService.js    # Live GitHub profile & repo statistics
│   ├── App.jsx                 # Application routes & fallback suspense
│   ├── index.css               # Tailwind CSS & global styles
│   └── main.jsx                # Application root mounting
├── package.json                # Project dependencies and scripts
├── tailwind.config.js          # Tailwind styling configuration
├── vite.config.js              # Vite bundler configuration
└── README.md                   # Repository documentation
```

---

## 🛠️ How to Customize Your Portfolio

All data across the entire website is centralized in **[`src/data/portfolioData.js`](src/data/portfolioData.js)**. You do not need to touch any complex components to update your information.

### 1. Update Profile & Bio
Open [`src/data/portfolioData.js`](src/data/portfolioData.js) and edit `profileData`:
```javascript
export const profileData = {
  name: "Dhiraj Kumar",
  title: "B.Tech CSE (IoT Specialization) & Software Engineer",
  college: "Bakhtiyarpur College of Engineering, Patna",
  year: "2nd Year Student (2023 - 2027)",
  email: "dhirajku00021@gmail.com",
  phone: "+91 9876543210",
  typingPrefix: "> I am a",
  roles: [
    "Full-Stack Web Developer",
    "IoT & Embedded Systems Engineer",
    "Computer Science Student",
    "Algorithmic Problem Solver"
  ],
  tagline: "Engineering scalable software architectures, real-time IoT hardware telemetry...",
  ...
};
```

### 2. Add or Edit Projects
Add an object to the `projectsData` array in [`src/data/portfolioData.js`](src/data/portfolioData.js):
```javascript
export const projectsData = [
  {
    id: "my-new-project",
    title: "Project Title",
    shortDescription: "One-line summary of what it does.",
    description: "Detailed description of the architecture and problems solved.",
    category: "Full-Stack", // 'IoT & Systems' | 'AI & Web' | 'Full-Stack'
    featured: true,
    image: "https://your-image-url.com",
    techStack: ["React", "Python", "Tailwind CSS"],
    liveUrl: "https://myproject.com",
    githubUrl: "https://github.com/...",
    metrics: "Key metric or achievement"
  },
  ...
];
```

### 3. Update Skills & Certifications
Simply edit `skillsData` or `certificatesData` in the same file to add new technologies or credentials.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/dhirajkumar-09/My_Portfolio_.git
cd My_Portfolio_
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the live website.

### 4. Build for production
```bash
npm run build
```
The optimized static build will be generated in the `dist/` directory, ready to deploy.

---

## 🚢 One-Click Deployment

This portfolio has **zero backend dependencies**, meaning it can be deployed for free in seconds on:

- **Vercel**: Import the GitHub repo and click **Deploy**. (Framework preset: `Vite`)
- **Netlify**: Connect your repository, set build command `npm run build`, and publish directory `dist`.
- **GitHub Pages**: Build the project and deploy the `dist/` folder using `gh-pages`.

---

## 📜 License & Credits

- Engineered by **[Dhiraj Kumar](https://github.com/dhirajkumar-09)**.
- Built with React, Vite, Tailwind CSS, Framer Motion, and Lucide Icons.
- Released under the [MIT License](LICENSE).
