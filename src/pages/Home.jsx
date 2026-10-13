import React, { useState, useEffect } from 'react';
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
  subscribeToProfile,
  subscribeToProjects,
  subscribeToEducation,
  subscribeToSkills,
  subscribeToCertificates
} from '../services/portfolioService';
import {
  defaultProfile,
  defaultProjects,
  defaultEducation,
  defaultSkills,
  defaultCertificates
} from '../data/defaultPortfolioData';

export default function Home() {
  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState(defaultProjects);
  const [educationList, setEducationList] = useState(defaultEducation);
  const [skillsList, setSkillsList] = useState(defaultSkills);
  const [certificates, setCertificates] = useState(defaultCertificates);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // 1. Subscribe to profile
    const unsubProfile = subscribeToProfile((data) => {
      if (data) setProfile(data);
    });

    // 2. Subscribe to projects
    setProjectsLoading(true);
    const unsubProjects = subscribeToProjects((data) => {
      if (data && data.length > 0) setProjects(data);
      setProjectsLoading(false);
    });

    // 3. Subscribe to education
    const unsubEducation = subscribeToEducation((data) => {
      if (data && data.length > 0) setEducationList(data);
    });

    // 4. Subscribe to skills
    const unsubSkills = subscribeToSkills((data) => {
      if (data && data.length > 0) setSkillsList(data);
    });

    // 5. Subscribe to certificates
    const unsubCerts = subscribeToCertificates((data) => {
      if (data && data.length > 0) setCertificates(data);
    });

    return () => {
      if (typeof unsubProfile === 'function') unsubProfile();
      if (typeof unsubProjects === 'function') unsubProjects();
      if (typeof unsubEducation === 'function') unsubEducation();
      if (typeof unsubSkills === 'function') unsubSkills();
      if (typeof unsubCerts === 'function') unsubCerts();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Intro Preloader */}
      <Preloader />

      {/* Particle background */}
      <ParticleBackground />

      {/* Interactive desktop cursor glow */}
      <CustomCursor />

      {/* Sticky glass navigation */}
      <Navbar />

      <main className="relative z-10">
        <Hero profile={profile} />
        <About profile={profile} />
        <Education educationList={educationList} />
        <Skills skillsList={skillsList} />
        <Projects projects={projects} loading={projectsLoading} />
        <Certificates certificates={certificates} />
        <Contact profile={profile} onToast={setToast} />
      </main>

      <Footer profile={profile} />

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
