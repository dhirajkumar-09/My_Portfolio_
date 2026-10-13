import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  LogOut,
  FolderPlus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search,
  Upload,
  FileText,
  Database,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  X,
  Plus,
  RefreshCw,
  Send,
  User,
  Sliders,
  Code2
} from 'lucide-react';
import { Github } from '../components/SocialIcons';

import { useAuth } from '../context/AuthContext';
import {
  subscribeToProjects,
  createProject,
  updateProject,
  deleteProject,
  subscribeToProfile,
  updateProfileData,
  subscribeToMessages,
  markMessageAsRead,
  deleteMessage,
  uploadFile,
  seedDatabase,
  subscribeToEducation,
  addOrUpdateEducation,
  deleteEducation,
  subscribeToSkills,
  addOrUpdateSkillCategory,
  deleteSkillCategory
} from '../services/portfolioService';
import {
  defaultProfile,
  defaultProjects,
  defaultEducation,
  defaultSkills
} from '../data/defaultPortfolioData';
import Toast from '../components/Toast';

export default function Admin() {
  const {
    currentUser,
    isAdmin,
    loginWithEmail,
    loginWithGoogle,
    logout,
    enableDemoAdmin,
    adminEmail,
    isFirebaseConfigured
  } = useAuth();

  // Navigation tab state: 'projects' | 'profile' | 'education' | 'skills' | 'inbox' | 'seed'
  const [activeTab, setActiveTab] = useState('projects');

  // Data states
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(defaultProfile);
  const [educationList, setEducationList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // Project Modal / Form State
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    shortDescription: '',
    description: '',
    category: 'IoT & Systems',
    featured: false,
    order: 1,
    image: '',
    techStackStr: '',
    liveUrl: '',
    githubUrl: '',
    metrics: ''
  });

  // Education Modal / Form State
  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({
    id: '',
    degree: '',
    institution: '',
    affiliation: '',
    location: '',
    period: '',
    score: '',
    current: false,
    detailsStr: ''
  });

  // Skill Category & Skill Modal State
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [selectedCatName, setSelectedCatName] = useState('');
  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 80,
    tag: 'Advanced',
    icon: 'Code2'
  });

  // New Category State
  const [newCatName, setNewCatName] = useState('');

  // Inbox search & filter
  const [inboxFilter, setInboxFilter] = useState('all');
  const [inboxSearch, setInboxSearch] = useState('');

  // Resume upload state
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Seed state
  const [isSeeding, setIsSeeding] = useState(false);

  // Subscribe to collections when admin is active
  useEffect(() => {
    if (!isAdmin) return;

    const unsubProjects = subscribeToProjects((data) => setProjects(data || []));
    const unsubMessages = subscribeToMessages((data) => setMessages(data || []));
    const unsubProfile = subscribeToProfile((data) => setProfile(data || defaultProfile));
    const unsubEducation = subscribeToEducation((data) => setEducationList(data || []));
    const unsubSkills = subscribeToSkills((data) => setSkillsList(data || []));

    return () => {
      if (unsubProjects) unsubProjects();
      if (unsubMessages) unsubMessages();
      if (unsubProfile) unsubProfile();
      if (unsubEducation) unsubEducation();
      if (unsubSkills) unsubSkills();
    };
  }, [isAdmin]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      await loginWithEmail(authEmail, authPassword);
      setToast({ type: 'success', title: 'Welcome', message: 'Signed in as Admin.' });
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      setToast({ type: 'success', title: 'Welcome', message: 'Signed in with Google.' });
    } catch (err) {
      setAuthError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ----------------------------------------------------
  // PROJECTS CRUD
  // ----------------------------------------------------
  const handleOpenAddProject = () => {
    setProjectForm({
      id: '',
      title: '',
      shortDescription: '',
      description: '',
      category: 'IoT & Systems',
      featured: true,
      order: projects.length + 1,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      techStackStr: 'React, Node.js, IoT Sensors',
      liveUrl: '',
      githubUrl: profile?.github || 'https://github.com/dhirajkumar-09/My_Portfolio_',
      metrics: ''
    });
    setIsEditingProject(true);
  };

  const handleOpenEditProject = (p) => {
    setProjectForm({
      id: p.id,
      title: p.title || '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      category: p.category || 'IoT & Systems',
      featured: Boolean(p.featured),
      order: p.order || 1,
      image: p.image || '',
      techStackStr: (p.techStack || []).join(', '),
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      metrics: p.metrics || ''
    });
    setIsEditingProject(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const techArray = projectForm.techStackStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const dataToSave = {
      title: projectForm.title,
      shortDescription: projectForm.shortDescription,
      description: projectForm.description,
      category: projectForm.category,
      featured: projectForm.featured,
      order: Number(projectForm.order) || 1,
      image: projectForm.image,
      techStack: techArray,
      liveUrl: projectForm.liveUrl,
      githubUrl: projectForm.githubUrl,
      metrics: projectForm.metrics
    };

    try {
      if (projectForm.id) {
        await updateProject(projectForm.id, dataToSave);
        setToast({ type: 'success', title: 'Updated', message: `Project "${projectForm.title}" saved.` });
      } else {
        await createProject(dataToSave);
        setToast({ type: 'success', title: 'Created', message: `Project "${projectForm.title}" added.` });
      }
      setIsEditingProject(false);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', title: 'Error', message: 'Failed to save project.' });
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProject(id);
        setToast({ type: 'success', title: 'Deleted', message: `Project deleted.` });
      } catch (err) {
        setToast({ type: 'error', title: 'Error', message: 'Failed to delete project.' });
      }
    }
  };

  // ----------------------------------------------------
  // PROFILE, HERO & STATS SAVE
  // ----------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfileData(profile);
      setToast({ type: 'success', title: 'Saved', message: 'All profile and hero details updated!' });
    } catch (err) {
      setToast({ type: 'error', title: 'Error', message: 'Failed to update profile.' });
    }
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingResume(true);
    try {
      const url = await uploadFile(file, `resumes/dhiraj_resume_${Date.now()}.pdf`);
      const updated = { ...profile, resumeUrl: url };
      setProfile(updated);
      await updateProfileData(updated);
      setToast({ type: 'success', title: 'Uploaded', message: 'New resume PDF uploaded & linked.' });
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', title: 'Error', message: 'Failed to upload resume file.' });
    } finally {
      setIsUploadingResume(false);
    }
  };

  // ----------------------------------------------------
  // EDUCATION CRUD
  // ----------------------------------------------------
  const handleOpenAddEdu = () => {
    setEduForm({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: 'Bakhtiyarpur College of Engineering, Patna',
      affiliation: 'Govt. of Bihar',
      location: 'Patna, Bihar',
      period: '2023 - Present',
      score: 'Pursuing',
      current: true,
      detailsStr: ''
    });
    setIsEditingEdu(true);
  };

  const handleOpenEditEdu = (edu) => {
    setEduForm({
      id: edu.id,
      degree: edu.degree || '',
      institution: edu.institution || '',
      affiliation: edu.affiliation || '',
      location: edu.location || '',
      period: edu.period || '',
      score: edu.score || '',
      current: Boolean(edu.current),
      detailsStr: (edu.details || []).join('\n')
    });
    setIsEditingEdu(true);
  };

  const handleSaveEdu = async (e) => {
    e.preventDefault();
    const detailsArray = eduForm.detailsStr
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const dataToSave = {
      id: eduForm.id || `edu-${Date.now()}`,
      degree: eduForm.degree,
      institution: eduForm.institution,
      affiliation: eduForm.affiliation,
      location: eduForm.location,
      period: eduForm.period,
      score: eduForm.score,
      current: eduForm.current,
      details: detailsArray
    };

    try {
      await addOrUpdateEducation(dataToSave);
      setToast({ type: 'success', title: 'Education Saved', message: `Saved "${eduForm.degree}"` });
      setIsEditingEdu(false);
    } catch (err) {
      setToast({ type: 'error', title: 'Error', message: 'Failed to save education milestone.' });
    }
  };

  const handleDeleteEdu = async (id, degree) => {
    if (window.confirm(`Delete education milestone "${degree}"?`)) {
      try {
        await deleteEducation(id);
        setToast({ type: 'success', title: 'Deleted', message: 'Education milestone removed.' });
      } catch (err) {
        setToast({ type: 'error', title: 'Error', message: 'Could not delete.' });
      }
    }
  };

  // ----------------------------------------------------
  // SKILLS CRUD
  // ----------------------------------------------------
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catObj = {
      id: `cat_${newCatName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      category: newCatName.trim(),
      items: []
    };
    try {
      await addOrUpdateSkillCategory(catObj);
      setNewCatName('');
      setToast({ type: 'success', title: 'Category Created', message: `Added "${catObj.category}"` });
    } catch (err) {
      setToast({ type: 'error', title: 'Error', message: 'Could not create category.' });
    }
  };

  const handleDeleteCat = async (catName, catId) => {
    if (window.confirm(`Delete skill category "${catName}" and all its skills?`)) {
      try {
        await deleteSkillCategory(catId || catName);
        setToast({ type: 'success', title: 'Deleted', message: `Removed category "${catName}"` });
      } catch (err) {
        setToast({ type: 'error', title: 'Error', message: 'Could not delete category.' });
      }
    }
  };

  const handleOpenAddSkill = (catName) => {
    setSelectedCatName(catName);
    setSkillForm({
      name: '',
      level: 85,
      tag: 'Advanced',
      icon: 'Code2'
    });
    setIsEditingSkill(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!selectedCatName || !skillForm.name.trim()) return;

    const currentCat = skillsList.find((c) => c.category === selectedCatName);
    if (!currentCat) return;

    const existingItems = currentCat.items || [];
    const existsIdx = existingItems.findIndex(
      (item) => item.name.toLowerCase() === skillForm.name.trim().toLowerCase()
    );

    let updatedItems;
    if (existsIdx >= 0) {
      updatedItems = [...existingItems];
      updatedItems[existsIdx] = {
        name: skillForm.name.trim(),
        level: Number(skillForm.level) || 80,
        tag: skillForm.tag,
        icon: skillForm.icon
      };
    } else {
      updatedItems = [
        ...existingItems,
        {
          name: skillForm.name.trim(),
          level: Number(skillForm.level) || 80,
          tag: skillForm.tag,
          icon: skillForm.icon
        }
      ];
    }

    const updatedCat = { ...currentCat, items: updatedItems };

    try {
      await addOrUpdateSkillCategory(updatedCat);
      setToast({ type: 'success', title: 'Skill Saved', message: `Saved "${skillForm.name}" in ${selectedCatName}` });
      setIsEditingSkill(false);
    } catch (err) {
      setToast({ type: 'error', title: 'Error', message: 'Failed to save skill.' });
    }
  };

  const handleDeleteSkill = async (catName, skillName) => {
    const currentCat = skillsList.find((c) => c.category === catName);
    if (!currentCat) return;

    const updatedItems = (currentCat.items || []).filter((s) => s.name !== skillName);
    const updatedCat = { ...currentCat, items: updatedItems };

    try {
      await addOrUpdateSkillCategory(updatedCat);
      setToast({ type: 'success', title: 'Skill Removed', message: `Deleted "${skillName}"` });
    } catch (err) {
      setToast({ type: 'error', title: 'Error', message: 'Failed to remove skill.' });
    }
  };

  // ----------------------------------------------------
  // MESSAGES HANDLING
  // ----------------------------------------------------
  const handleToggleRead = async (msg) => {
    try {
      await markMessageAsRead(msg.id, !msg.read);
      setToast({
        type: 'success',
        title: 'Updated',
        message: msg.read ? 'Marked as unread' : 'Marked as read'
      });
    } catch (e) {
      setToast({ type: 'error', title: 'Error', message: 'Could not update status.' });
    }
  };

  const handleDeleteMsg = async (id) => {
    if (window.confirm('Delete this message permanently?')) {
      try {
        await deleteMessage(id);
        setToast({ type: 'success', title: 'Deleted', message: 'Message removed from inbox.' });
      } catch (e) {
        setToast({ type: 'error', title: 'Error', message: 'Could not delete message.' });
      }
    }
  };

  // ----------------------------------------------------
  // DATABASE SEEDING
  // ----------------------------------------------------
  const handleSeed = async () => {
    if (!window.confirm('Pre-fill Firestore with Dhiraj Kumar\'s full resume and project portfolio?')) {
      return;
    }
    setIsSeeding(true);
    try {
      await seedDatabase();
      setToast({
        type: 'success',
        title: 'Firestore Seeded!',
        message: 'Profile, projects, education, and skills successfully written.'
      });
    } catch (err) {
      console.error(err);
      setToast({
        type: 'error',
        title: 'Seeding Note',
        message: err.message || 'Please ensure your Firebase environment keys are configured.'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Filtered messages
  const filteredMessages = messages.filter((m) => {
    if (inboxFilter === 'unread' && m.read) return false;
    if (inboxFilter === 'read' && !m.read) return false;
    if (inboxSearch) {
      const q = inboxSearch.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchEmail = m.email?.toLowerCase().includes(q);
      const matchMsg = m.message?.toLowerCase().includes(q);
      const matchSub = m.subject?.toLowerCase().includes(q);
      return matchName || matchEmail || matchMsg || matchSub;
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  // ----------------------------------------------------
  // LOGIN SCREEN IF NOT AUTHENTICATED
  // ----------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Portfolio</span>
          </Link>

          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white">
                  Admin Control Portal
                </h1>
                <p className="text-xs font-mono text-slate-400">
                  Authorized for: {adminEmail}
                </p>
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder={adminEmail}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-glow-cyan flex items-center justify-center gap-2"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In with Email'}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-slate-900 text-xs font-mono text-slate-500 uppercase">
                Or
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Sign In With Google</span>
              </button>

              <button
                onClick={enableDemoAdmin}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Demo Admin Access (Evaluate Now)</span>
              </button>
            </div>
          </div>
        </div>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED-IN ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View Live Portfolio</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-display font-bold text-sm text-white">
                Admin Control &bull; Dhiraj Kumar
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-cyan-400">
              {currentUser?.email || adminEmail}
            </span>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Hero &amp; Profile &amp; Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'education'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Education ({educationList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'skills'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Skills ({skillsList.length} Categories)</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'inbox'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inbox ({messages.length})</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('seed')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'seed'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Tools</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: PROJECTS MANAGER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Projects Catalog
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Manage cards, live links, source repos, and architecture details.
                </p>
              </div>

              <button
                onClick={handleOpenAddProject}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={p.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/70 text-cyan-300 backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-display font-bold text-white flex items-center justify-between">
                        <span>{p.title}</span>
                        {p.featured && (
                          <span className="text-[10px] font-mono text-emerald-400">
                            ★ Featured
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {p.shortDescription || p.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(p.techStack || []).slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">Order: #{p.order}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProject(p)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                        title="Edit project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id, p.title)}
                        className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: HERO, PROFILE & STATS (EVERYTHING EDITABLE) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'profile' && profile && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                Edit Hero, Biography &amp; Stats
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Modify every headline, typing role, value statement, counter, and link.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Basic Details */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Degree / Specialization Title
                    </label>
                    <input
                      type="text"
                      value={profile.title || ''}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      College / Institution
                    </label>
                    <input
                      type="text"
                      value={profile.college || ''}
                      onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Base Location
                    </label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Hero Typing Roles (comma-separated list)
                  </label>
                  <input
                    type="text"
                    value={(profile.roles || []).join(', ')}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        roles: e.target.value.split(',').map((r) => r.trim()).filter(Boolean)
                      })
                    }
                    placeholder="CSE Student, IoT Enthusiast, Full-Stack Developer, Problem Solver"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    These roles cycle dynamically with the hero typing cursor animation.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Hero Tagline / Value Statement
                  </label>
                  <textarea
                    rows={2}
                    value={profile.tagline || ''}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Career Objective / About Narrative
                  </label>
                  <textarea
                    rows={4}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              </div>

              {/* Animated Counters Section */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400">
                  Quick Stat Counters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Projects Count
                    </label>
                    <input
                      type="text"
                      value={profile.stats?.projectsCount || '10+'}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, projectsCount: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Tech Stack Count
                    </label>
                    <input
                      type="text"
                      value={profile.stats?.techStackCount || '12+'}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, techStackCount: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Years Learning
                    </label>
                    <input
                      type="text"
                      value={profile.stats?.yearsLearning || '2+'}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, yearsLearning: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      DSA Solved
                    </label>
                    <input
                      type="text"
                      value={profile.stats?.dsaSolved || '150+'}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, dsaSolved: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links & Resume */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400">
                  Links, Repos &amp; Resume PDF
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={profile.email || 'dhirajku00021@gmail.com'}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      GitHub Repo URL
                    </label>
                    <input
                      type="url"
                      value={profile.github || 'https://github.com/dhirajkumar-09/My_Portfolio_'}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={profile.linkedin || 'https://linkedin.com'}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Resume Document URL or File Upload
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={profile.resumeUrl || '/resume.pdf'}
                      onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />

                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>{isUploadingResume ? 'Uploading...' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleResumeFileChange}
                        disabled={isUploadingResume}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan"
              >
                Save All Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: EDUCATION TIMELINE CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Education Milestones ({educationList.length})
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Add, edit, or remove academic degrees, scores, and coursework points.
                </p>
              </div>

              <button
                onClick={handleOpenAddEdu}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education Milestone</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {educationList.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400">{edu.period}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
                        {edu.score}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-slate-300">{edu.institution}</p>
                    <p className="text-[11px] font-mono text-slate-500">
                      {edu.location} {edu.affiliation ? `(${edu.affiliation})` : ''}
                    </p>

                    {edu.details && edu.details.length > 0 && (
                      <ul className="pt-2 border-t border-slate-800 space-y-1">
                        {edu.details.map((d, dIdx) => (
                          <li key={dIdx} className="text-[11px] text-slate-400 list-disc list-inside">
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditEdu(edu)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                      title="Edit milestone"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEdu(edu.id, edu.degree)}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                      title="Delete milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: SKILLS & CATEGORIES CRUD */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Skills &amp; Categories Management
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Full CRUD: Add categories, create skills, adjust proficiency % and tags.
                </p>
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New Category Name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 flex items-center gap-1 shadow-glow-cyan"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </form>
            </div>

            {/* Category Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsList.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="font-display font-bold text-base text-white">
                          {cat.category}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500">
                          {(cat.items || []).length} items
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenAddSkill(cat.category)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors flex items-center gap-1"
                          title="Add skill to category"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat.category, cat.id)}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Skill items */}
                    <div className="space-y-2">
                      {(cat.items || []).map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-200">{skill.name}</span>
                            {skill.tag && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                                {skill.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-cyan-400 font-bold">
                              {skill.level}%
                            </span>
                            <button
                              onClick={() => handleDeleteSkill(cat.category, skill.name)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete skill"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {(!cat.items || cat.items.length === 0) && (
                        <p className="text-[11px] font-mono text-slate-500 text-center py-2">
                          No skills added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: INBOX / VISITOR MESSAGES */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Visitor Inbox ({messages.length})
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Real-time visitor inquiries from the portfolio contact form.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={inboxSearch}
                    onChange={(e) => setInboxSearch(e.target.value)}
                    placeholder="Search messages..."
                    className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <select
                  value={inboxFilter}
                  onChange={(e) => setInboxFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>
              </div>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 font-mono text-xs">
                No messages found matching your criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      msg.read
                        ? 'bg-slate-900/50 border-slate-800/80'
                        : 'bg-slate-900/90 border-cyan-500/40 shadow-glow-cyan/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">
                            {msg.name}
                          </span>
                          <span className="text-xs font-mono text-cyan-400">
                            &lt;{msg.email}&gt;
                          </span>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              NEW
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-mono text-slate-300 mt-1 font-medium">
                          Subject: {msg.subject || 'Portfolio Inquiry'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                            msg.subject || 'Portfolio Inquiry'
                          )}&body=${encodeURIComponent(
                            `\n\n--- In reply to your message ---\n"${msg.message}"`
                          )}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </a>

                        <button
                          onClick={() => handleToggleRead(msg)}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          {msg.read ? 'Mark Unread' : 'Mark Read'}
                        </button>

                        <button
                          onClick={() => handleDeleteMsg(msg.id)}
                          className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      {msg.message}
                    </p>

                    <p className="mt-2 text-[10px] font-mono text-slate-500">
                      Received:{' '}
                      {msg.createdAt?.toDate
                        ? msg.createdAt.toDate().toLocaleString()
                        : typeof msg.createdAt === 'string'
                        ? new Date(msg.createdAt).toLocaleString()
                        : 'Recent'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: DATABASE TOOLS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'seed' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                Database Management &amp; Initializer
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Synchronize Firestore with Dhiraj's latest verified credentials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <Database className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-display font-bold text-white">
                    One-Click Firestore Seed Tool
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">
                    Pre-fills Firestore with the verified email (<span className="text-cyan-400 font-mono">dhirajku00021@gmail.com</span>) and GitHub repository (<span className="text-cyan-400 font-mono">https://github.com/dhirajkumar-09/My_Portfolio_</span>).
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Status: {isFirebaseConfigured ? 'Firebase Active' : 'Fallback / Offline Sync Mode'}
                </span>

                <button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Writing Data to Firestore...' : 'Seed All Collections'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ---------------------------------------------------- */}
      {/* EDIT / CREATE PROJECT MODAL */}
      {/* ---------------------------------------------------- */}
      {isEditingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white">
                {projectForm.id ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsEditingProject(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="IoT & Systems">IoT &amp; Systems</option>
                    <option value="AI & Web">AI &amp; Web</option>
                    <option value="Full-Stack">Full-Stack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.shortDescription}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, shortDescription: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Detailed Description &amp; Architecture
                </label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={projectForm.techStackStr}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, techStackStr: e.target.value })
                  }
                  placeholder="React, Python, IoT Sensors, Firebase"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, liveUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Display Order (Integer)
                  </label>
                  <input
                    type="number"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({ ...projectForm, order: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={projectForm.featured}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-cyan-400 rounded"
                  />
                  <label htmlFor="featuredCheck" className="text-xs font-mono text-slate-200">
                    Feature on Home page
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProject(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EDIT / CREATE EDUCATION MODAL */}
      {/* ---------------------------------------------------- */}
      {isEditingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white">
                Edit Education Milestone
              </h3>
              <button
                onClick={() => setIsEditingEdu(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Degree / Certificate *
                </label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. B.Tech in CSE (IoT Specialization)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Affiliation / Board
                  </label>
                  <input
                    type="text"
                    value={eduForm.affiliation}
                    onChange={(e) => setEduForm({ ...eduForm, affiliation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={eduForm.period}
                    onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                    placeholder="2023 - Present"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Score / Grade
                  </label>
                  <input
                    type="text"
                    value={eduForm.score}
                    onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
                    placeholder="90.0% / 2nd Year"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eduForm.location}
                    onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                    placeholder="Patna, Bihar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Bullet Details (One per line)
                </label>
                <textarea
                  rows={3}
                  value={eduForm.detailsStr}
                  onChange={(e) => setEduForm({ ...eduForm, detailsStr: e.target.value })}
                  placeholder="Specialization coursework: IoT Architecture, Microcontrollers...&#10;Data Structures & Algorithms..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none font-mono resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="eduCurrent"
                  checked={eduForm.current}
                  onChange={(e) => setEduForm({ ...eduForm, current: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
                <label htmlFor="eduCurrent" className="text-xs font-mono text-slate-200">
                  Currently Pursuing (displays live blinking indicator)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingEdu(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EDIT / CREATE SKILL MODAL */}
      {/* ---------------------------------------------------- */}
      {isEditingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white">
                Add / Edit Skill in "{selectedCatName}"
              </h3>
              <button
                onClick={() => setIsEditingSkill(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. Python, Docker, Next.js"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Proficiency ({skillForm.level}%)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Tag / Label
                  </label>
                  <input
                    type="text"
                    value={skillForm.tag}
                    onChange={(e) => setSkillForm({ ...skillForm, tag: e.target.value })}
                    placeholder="Expert / Advanced / Core"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingSkill(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
