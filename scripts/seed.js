/**
 * Seed Script for Dhiraj Kumar Portfolio
 * Run with: node scripts/seed.js
 *
 * Requirements:
 * - A valid .env or populated Firebase config in this script.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Firebase configuration not found in environment. Please setup .env first.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data payloads
const profile = {
  name: "Dhiraj Kumar",
  title: "B.Tech CSE (IoT Specialization)",
  college: "Bakhtiyarpur College of Engineering, Patna",
  year: "2nd Year Student (2023 - 2027)",
  location: "Patna, Bihar, India",
  email: "dhirajku00021@gmail.com",
  roles: [
    "CSE Student",
    "IoT Enthusiast",
    "Full-Stack Developer",
    "Problem Solver"
  ],
  tagline: "Engineering intelligent IoT ecosystems and scalable web architectures that bridge physical hardware with modern cloud intelligence.",
  bio: "Motivated, detail-oriented B.Tech student in Computer Science & Engineering with IoT Specialization at Bakhtiyarpur College of Engineering, Patna. Actively seeking an internship or entry-level software/IoT developer role to engineer real-world systems, learn from industry leaders, and contribute impactful solutions.",
  resumeUrl: "/resume.pdf",
  github: "https://github.com/dhirajkumar-09/My_Portfolio_",
  linkedin: "https://linkedin.com",
  stats: {
    projectsCount: "10+",
    techStackCount: "12+",
    yearsLearning: "2+",
    dsaSolved: "150+"
  }
};

const projects = [
  {
    id: "stadium-controller",
    title: "Stadium Controller",
    shortDescription: "Software-based crowd management and monitoring system for stadiums.",
    description: "A comprehensive software-based system engineered to monitor and manage crowd density and movement at sports stadiums in real time. Incorporates entry/exit gate telemetry, bottleneck detection algorithms, and operational heatmaps to elevate attendee safety and optimize security logistics.",
    category: "IoT & Systems",
    featured: true,
    order: 1,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=80",
    techStack: ["Python", "IoT Sensors", "Real-Time Telemetry", "Computer Vision", "Firebase"],
    liveUrl: "https://stadium-controller.web.app",
    githubUrl: "https://github.com/dhirajkumar-09/My_Portfolio_",
    metrics: "Real-time gate telemetry & emergency bottleneck alerts",
    keyFeatures: [
      "Real-time crowd flow density heatmaps across multiple stadium sectors",
      "Automated turnstile & gate throttling during threshold exceedance",
      "Instant security alert triggers for emergency response dispatch",
      "Historical attendance analytics for event management optimization"
    ]
  },
  {
    id: "darpan-sathi",
    title: "Darpan (Sathi)",
    shortDescription: "AI-powered compassionate companion web app supporting emotional wellness.",
    description: "An empathetic AI-powered companion web application designed to support individuals experiencing loneliness. Provides active empathetic listening, guided mental wellness reflections, and personalized conversational companionship within a private, judgment-free space.",
    category: "AI & Web",
    featured: true,
    order: 2,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    techStack: ["React", "JavaScript", "Generative AI", "Web Speech API", "Tailwind CSS", "Firebase"],
    liveUrl: "https://darpan-sathi.web.app",
    githubUrl: "https://github.com/dhirajkumar-09/My_Portfolio_",
    metrics: "Interactive voice-enabled empathetic conversation",
    keyFeatures: [
      "Natural conversational interface with contextual sentiment analysis",
      "Interactive voice input and synthesized speech response for accessibility",
      "Mood tracking dashboard with calming breathing exercise guides",
      "Zero-data-leakage client-side privacy architecture"
    ]
  },
  {
    id: "eduforge",
    title: "EduForge",
    shortDescription: "Personalized study roadmaps and exam-specific syllabus decomposition platform.",
    description: "An intelligent exam-preparation platform that generates algorithmic, personalized study roadmaps and comprehensive syllabus breakdowns for competitive exams. Enables students to structure their timelines, track topic mastery, and prepare with maximum efficiency.",
    category: "Full-Stack",
    featured: true,
    order: 3,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    techStack: ["React", "Node.js", "Firebase Firestore", "Tailwind CSS", "Chart.js"],
    liveUrl: "https://eduforge-prep.web.app",
    githubUrl: "https://github.com/dhirajkumar-09/My_Portfolio_",
    metrics: "Algorithmic day-by-day roadmap generator",
    keyFeatures: [
      "Automated syllabus deconstruction with weighted topic priority scoring",
      "Dynamic timeline generator adjusting to individual study speed",
      "Visual milestone progress trackers with performance analytics",
      "Curated practice question banks categorized by difficulty"
    ]
  }
];

const education = [
  {
    id: "btech-cse",
    degree: "B.Tech in Computer Science & Engineering (IoT Specialization)",
    institution: "Bakhtiyarpur College of Engineering, Patna",
    affiliation: "Department of Science & Technology, Govt. of Bihar / AKU",
    location: "Patna, Bihar",
    period: "2023 - Present",
    score: "Currently Pursuing (2nd Year)",
    current: true,
    details: [
      "Specialization coursework: IoT Architecture, Microcontrollers, Embedded Systems, Sensor Interfacing",
      "Core CS: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks",
      "Active participant in technical symposiums, hackathons, and hardware prototyping workshops"
    ]
  },
  {
    id: "12th-intermediate",
    degree: "Senior Secondary (Class XII - Science / PCM)",
    institution: "UHS Mirzaganj, Jamui",
    affiliation: "Bihar School Examination Board (BSEB)",
    location: "Jamui, Bihar",
    period: "2021 - 2023",
    score: "74.0%",
    current: false,
    details: [
      "Majors: Physics, Chemistry, Mathematics, English, Hindi",
      "Developed strong quantitative analysis and logical deduction foundations",
      "Participated in school science exhibitions and mathematics competitions"
    ]
  },
  {
    id: "10th-matriculation",
    degree: "Secondary Examination (Class X)",
    institution: "UHS Mirzaganj, Jamui",
    affiliation: "Bihar School Examination Board (BSEB)",
    location: "Jamui, Bihar",
    period: "2020 - 2021",
    score: "90.0% (Distinction)",
    current: false,
    details: [
      "Ranked among top scholastic achievers with 90% distinction score",
      "Demonstrated early academic excellence in Science and Mathematics"
    ]
  }
];

const skills = [
  {
    category: "Languages",
    items: [
      { name: "Python", level: 85, icon: "Code2", tag: "Advanced" },
      { name: "Java", level: 80, icon: "Coffee", tag: "Intermediate" },
      { name: "C", level: 80, icon: "Terminal", tag: "Intermediate" }
    ]
  },
  {
    category: "Web Development",
    items: [
      { name: "JavaScript (ES6+)", level: 85, icon: "FileCode", tag: "Advanced" },
      { name: "React", level: 82, icon: "Atom", tag: "Intermediate" },
      { name: "HTML5 & CSS3", level: 90, icon: "Layout", tag: "Expert" },
      { name: "Tailwind CSS", level: 88, icon: "Palette", tag: "Advanced" }
    ]
  },
  {
    category: "Database & Backend",
    items: [
      { name: "Firebase (Firestore & Auth)", level: 84, icon: "Flame", tag: "Advanced" },
      { name: "SQL (Basic / Relational)", level: 75, icon: "Database", tag: "Intermediate" }
    ]
  },
  {
    category: "Tools & DevOps",
    items: [
      { name: "Git", level: 85, icon: "GitBranch", tag: "Advanced" },
      { name: "GitHub", level: 85, icon: "Github", tag: "Advanced" },
      { name: "VS Code", level: 92, icon: "Cpu", tag: "Expert" }
    ]
  },
  {
    category: "Core Computer Science",
    items: [
      { name: "Data Structures & Algorithms (DSA)", level: 80, icon: "Layers", tag: "Proficient" },
      { name: "IoT Architecture & Sensors", level: 82, icon: "Radio", tag: "Specialization" },
      { name: "Object-Oriented Programming (OOP)", level: 85, icon: "Box", tag: "Proficient" }
    ]
  },
  {
    category: "Soft Skills",
    items: [
      { name: "Problem Solving", level: 90, icon: "CheckCircle", tag: "Core" },
      { name: "Communication", level: 85, icon: "MessageSquare", tag: "Key" },
      { name: "Teamwork & Collaboration", level: 88, icon: "Users", tag: "Key" },
      { name: "Leadership", level: 82, icon: "Award", tag: "Key" },
      { name: "Time Management", level: 86, icon: "Clock", tag: "Key" }
    ]
  }
];

async function runSeed() {
  console.log("🚀 Starting Firestore seed for Dhiraj Kumar Portfolio...");

  // 1. Profile
  console.log("📝 Writing Profile document...");
  await setDoc(doc(db, "profile", "main"), {
    ...profile,
    updatedAt: serverTimestamp()
  });

  // 2. Projects
  console.log("💻 Writing Projects collection...");
  for (const proj of projects) {
    await setDoc(doc(db, "projects", proj.id), {
      ...proj,
      updatedAt: serverTimestamp()
    });
  }

  // 3. Education
  console.log("🎓 Writing Education collection...");
  for (const edu of education) {
    await setDoc(doc(db, "education", edu.id), {
      ...edu,
      updatedAt: serverTimestamp()
    });
  }

  // 4. Skills
  console.log("⚡ Writing Skills collection...");
  for (const [idx, sCat] of skills.entries()) {
    await setDoc(doc(db, "skills", `category_${idx}`), {
      ...sCat,
      order: idx,
      updatedAt: serverTimestamp()
    });
  }

  console.log("✅ Seed completed successfully! All resume data is now in Firestore.");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("❌ Seed failed with error:", err);
  process.exit(1);
});
