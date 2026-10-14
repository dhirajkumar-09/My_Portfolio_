/**
 * ==============================================================================
 *                      DHIRAJ KUMAR - PORTFOLIO DATA HUB
 * ==============================================================================
 *
 * HOW TO EDIT YOUR PORTFOLIO:
 * ---------------------------
 * You can edit any details in this file directly to update your live website!
 * - Profile & Bio: Edit the `profileData` object below.
 * - Hero Typing Roles: Edit `profileData.roles` array.
 * - Projects: Edit, add, or remove entries in the `projectsData` array.
 * - Education: Edit entries in the `educationData` array.
 * - Skills: Add or customize skills in the `skillsData` array.
 * - Certificates: Update credentials in the `certificatesData` array.
 *
 * All changes in this file reflect instantly across the entire portfolio website!
 * ==============================================================================
 */

// ==============================================================================
// 1. PROFILE & EXECUTIVE BIO DATA
// ==============================================================================
export const profileData = {
  name: "Dhiraj Kumar",
  title: "B.Tech CSE (IoT Specialization) & Strategic Management Aspirant",
  college: "Bakhtiyarpur College of Engineering, Patna",
  year: "2nd Year Student (2023 - 2027)",
  affiliation: "Dept. of Science & Technology, Govt. of Bihar",
  location: "Patna, Bihar, India",
  email: "dhirajku00021@gmail.com",
  phone: "+91 9876543210",

  // Lead prefix shown before the animated typing cursor in the Hero section
  typingPrefix: "> I am a",

  // Cycling roles in the Hero typing animation (Edit or add as many as you like)
  roles: [
    "Business & Management Strategist",
    "FinTech & Systems Developer",
    "Product Operations Manager",
    "Quantitative Problem Solver",
    "IoT & Embedded Engineer"
  ],

  // Executive tagline / value statement
  tagline:
    "Bridging scalable software architecture with strategic business management, financial systems, and high-impact product operations.",

  // Primary biography narrative
  bio:
    "Motivated, detail-oriented B.Tech Computer Science student specializing in IoT at Bakhtiyarpur College of Engineering, Patna, with a deep passion for Business Management, Fintech systems, and strategic operations. Focused on building high-performance software, telemetry pipelines, and commercially viable technology products.",

  aboutHeading: "About My Journey & Vision",
  aboutSubtitle: "Combining engineering discipline with business strategy to engineer high-impact technology.",
  aboutBadge: "Leadership & Technical Aspirations",
  aboutTitle: "B.Tech CSE Student & Business Technologist",
  aboutBio2:
    "Currently in my 2nd year (2023–2027), I focus on writing clean, modular code, designing hardware telemetry pipelines, and building accessible full-stack apps. Whether managing crowd flows in stadiums, creating empathetic AI tools, or modeling financial systems, I thrive on turning complex problems into elegant, scalable solutions.",

  // Strategic Focus Pillars (Displayed as interactive cards in the About section)
  pillars: [
    {
      title: "Business Management & FinTech",
      desc: "Passionate about capital efficiency, strategic operations, fintech algorithms, and commercial product scalability."
    },
    {
      title: "IoT & Embedded Engineering",
      desc: "Integrating microcontrollers, real-time telemetry, and hardware protocols with cloud dashboards for automated monitoring."
    },
    {
      title: "Modern Full-Stack Web Architecture",
      desc: "Crafting responsive, high-performance web applications using React, modern JavaScript, Tailwind CSS, and scalable APIs."
    },
    {
      title: "Data Structures & Quantitative Analysis",
      desc: "Writing optimized algorithms with a disciplined approach to time-space complexity, OOP patterns, and data modeling."
    }
  ],

  // Links & Resumes
  resumeUrl: "/resume.pdf",
  github: "https://github.com/dhirajkumar-09/My_Portfolio_",
  linkedin: "https://linkedin.com",

  // Quantifiable Impact Metrics (Displayed in the About Section)
  stats: {
    projectsCount: "10+",
    techStackCount: "14+",
    yearsLearning: "2+",
    dsaSolved: "150+"
  }
};

// ==============================================================================
// 2. FEATURED PROJECTS DATA
// ==============================================================================
export const projectsData = [
  {
    id: "stadium-controller",
    title: "Stadium Dynamic Entry Controller",
    shortDescription: "Software-based crowd management and real-time gate telemetry system.",
    description:
      "A comprehensive software-based system engineered to monitor and manage crowd density and movement at sports stadiums in real time. Incorporates entry/exit gate telemetry, bottleneck detection algorithms, and operational heatmaps to elevate attendee safety and optimize security logistics.",
    category: "IoT & Systems",
    featured: true,
    order: 1,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=80",
    techStack: ["Python", "IoT Sensors", "Real-Time Telemetry", "Computer Vision", "Tailwind CSS"],
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
    title: "Darpan (Sathi) - Empathetic AI",
    shortDescription: "AI-powered compassionate companion web app supporting emotional wellness.",
    description:
      "An empathetic AI-powered companion web application designed to support individuals experiencing loneliness. Provides active empathetic listening, guided mental wellness reflections, and personalized conversational companionship within a private, judgment-free space.",
    category: "AI & Web",
    featured: true,
    order: 2,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    techStack: ["React", "JavaScript", "Generative AI", "Web Speech API", "Tailwind CSS"],
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
    title: "EduForge - Exam Roadmap Engine",
    shortDescription: "Personalized study roadmaps and exam-specific syllabus decomposition platform.",
    description:
      "An intelligent exam-preparation platform that generates algorithmic, personalized study roadmaps and comprehensive syllabus breakdowns for competitive exams. Enables students to structure their timelines, track topic mastery, and prepare with maximum efficiency.",
    category: "Full-Stack",
    featured: true,
    order: 3,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    techStack: ["React", "JavaScript", "Tailwind CSS", "Chart.js", "REST APIs"],
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

// ==============================================================================
// 3. EDUCATION & ACADEMIC MILESTONES
// ==============================================================================
export const educationData = [
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
      "Business & Tech: Technical symposiums, hackathons, engineering innovation, and product leadership workshops"
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
      "Developed strong quantitative analysis, mathematical modeling, and logical deduction foundations",
      "Active participant in science exhibitions and scholastic competitions"
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

// ==============================================================================
// 4. SKILLS & TECHNICAL DOMAINS
// ==============================================================================
export const skillsData = [
  {
    id: "business-mgmt",
    category: "Business & Management",
    items: [
      { name: "Strategic Management", level: 88, icon: "Award", tag: "Strategy" },
      { name: "Financial & Quantitative Systems", level: 85, icon: "TrendingUp", tag: "Finance" },
      { name: "Product Operations", level: 84, icon: "Sliders", tag: "Operations" },
      { name: "Team Leadership", level: 90, icon: "Users", tag: "Core" }
    ]
  },
  {
    id: "languages",
    category: "Programming Languages",
    items: [
      { name: "Python", level: 88, icon: "Code2", tag: "Advanced" },
      { name: "Java", level: 82, icon: "Coffee", tag: "Intermediate" },
      { name: "C", level: 80, icon: "Terminal", tag: "Intermediate" }
    ]
  },
  {
    id: "web",
    category: "Full-Stack Web Development",
    items: [
      { name: "JavaScript (ES6+)", level: 88, icon: "FileCode", tag: "Advanced" },
      { name: "React", level: 85, icon: "Atom", tag: "Advanced" },
      { name: "HTML5 & CSS3", level: 92, icon: "Layout", tag: "Expert" },
      { name: "Tailwind CSS", level: 90, icon: "Palette", tag: "Advanced" }
    ]
  },
  {
    id: "systems-iot",
    category: "Systems & IoT Hardware",
    items: [
      { name: "IoT Architecture & Sensors", level: 84, icon: "Radio", tag: "Specialization" },
      { name: "Microcontrollers & Telemetry", level: 82, icon: "Cpu", tag: "Hardware" },
      { name: "Embedded Protocols", level: 78, icon: "Layers", tag: "Intermediate" }
    ]
  },
  {
    id: "core-cs",
    category: "Core Computer Science",
    items: [
      { name: "Data Structures & Algorithms (DSA)", level: 82, icon: "Layers", tag: "Proficient" },
      { name: "Object-Oriented Programming (OOP)", level: 86, icon: "Box", tag: "Proficient" },
      { name: "Git & GitHub Version Control", level: 88, icon: "GitBranch", tag: "Advanced" }
    ]
  },
  {
    id: "soft-skills",
    category: "Professional Competencies",
    items: [
      { name: "Problem Solving", level: 92, icon: "CheckCircle", tag: "Core" },
      { name: "Communication", level: 86, icon: "MessageSquare", tag: "Key" },
      { name: "Analytical Thinking", level: 90, icon: "Sparkles", tag: "Key" },
      { name: "Time Management", level: 88, icon: "Clock", tag: "Key" }
    ]
  }
];

// ==============================================================================
// 5. CERTIFICATES & CREDENTIALS
// ==============================================================================
export const certificatesData = [
  {
    id: "cert-iot-embedded",
    title: "Internet of Things (IoT) & Embedded Systems Prototyping",
    issuer: "Bakhtiyarpur College of Engineering",
    issueDate: "2024",
    credentialId: "BCE-IOT-2024-089",
    credentialUrl: "https://github.com/dhirajkumar-09/My_Portfolio_",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    skills: ["IoT Architecture", "Sensors", "Microcontrollers", "Embedded C"],
    category: "IoT & Hardware",
    featured: true,
    order: 1
  },
  {
    id: "cert-python-dsa",
    title: "Python Data Structures & Algorithmic Problem Solving",
    issuer: "HackerRank / Coding Assessment",
    issueDate: "2024",
    credentialId: "HR-PY-DSA-55421",
    credentialUrl: "https://github.com/dhirajkumar-09/My_Portfolio_",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    skills: ["Python", "DSA", "Algorithms", "Optimization"],
    category: "Programming",
    featured: true,
    order: 2
  },
  {
    id: "cert-web-dev",
    title: "Modern Full-Stack Web Development with React & Tailwind",
    issuer: "Coursera / Meta Open Academy",
    issueDate: "2023",
    credentialId: "CERT-META-FS-99120",
    credentialUrl: "https://github.com/dhirajkumar-09/My_Portfolio_",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    skills: ["React", "JavaScript", "REST APIs", "Tailwind CSS"],
    category: "Web Development",
    featured: true,
    order: 3
  }
];
