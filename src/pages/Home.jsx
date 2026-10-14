import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ParticleBackground from '../components/ParticleBackground';
import Preloader from '../components/Preloader';
import Toast from '../components/Toast';

import Hero from '../sections/Hero';
import About from '../sections/About';
import Education from '../sections/Education';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Certificates from '../sections/Certificates';
import Contact from '../sections/Contact';

import {
  profileData,
  projectsData,
  educationData,
  skillsData,
  certificatesData
} from '../data/portfolioData';

export default function Home() {
  const [profile] = useState(profileData);
  const [projects] = useState(projectsData);
  const [educationList] = useState(educationData);
  const [skillsList] = useState(skillsData);
  const [certificates] = useState(certificatesData);
  const [toast, setToast] = useState(null);

  const hasCertificates = Boolean(certificates && certificates.length > 0);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Intro Preloader */}
      <Preloader profile={profile} />

      {/* Particle background */}
      <ParticleBackground />

      {/* Interactive desktop cursor glow */}
      <CustomCursor />

      {/* Sticky glass navigation */}
      <Navbar hasCertificates={hasCertificates} />

      <main className="relative z-10">
        <Hero profile={profile} />
        <About profile={profile} />
        <Education educationList={educationList} />
        <Skills skillsList={skillsList} />
        <Projects projects={projects} loading={false} />
        {hasCertificates && <Certificates certificates={certificates} />}
        <Contact profile={profile} onToast={setToast} />
      </main>

      <Footer profile={profile} />

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
