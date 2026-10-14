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
  Code2,
  Award,
  AlertTriangle,
  Image as ImageIcon
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
  deleteSkillCategory,
  subscribeToCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  testFirestoreConnection
} from '../services/portfolioService';
import {
  defaultProfile,
  defaultProjects,
  defaultEducation,
  defaultSkills,
  defaultCertificates
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

  // Navigation tab state: 'projects' | 'certificates' | 'profile' | 'education' | 'skills' | 'inbox' | 'seed'
  const [activeTab, setActiveTab] = useState('projects');

  // Data states
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(defaultProfile);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // Health check state
  const [dbHealth, setDbHealth] = useState(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Certificate Modal / Form State
  const [isEditingCert, setIsEditingCert] = useState(false);
  const [certForm, setCertForm] = useState({
    id: '',
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    image: '',
    category: 'IoT & Hardware',
    skillsStr: '',
    order: 1
  });

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

  // Local Image Upload states
  const [isUploadingProjectImg, setIsUploadingProjectImg] = useState(false);
  const [isUploadingCertImg, setIsUploadingCertImg] = useState(false);

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
    const unsubCerts = subscribeToCertificates((data) => setCertificates(data || []));
    const unsubMessages = subscribeToMessages((data) => setMessages(data || []));
    const unsubProfile = subscribeToProfile((data) => setProfile(data || defaultProfile));
    const unsubEducation = subscribeToEducation((data) => setEducationList(data || []));
    const unsubSkills = subscribeToSkills((data) => setSkillsList(data || []));

    return () => {
      if (unsubProjects) unsubProjects();
      if (unsubCerts) unsubCerts();
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
  const handleProjectImageUpload = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setToast({ type: 'error', title: 'Invalid File', message: 'Please select an image file (PNG, JPG, WEBP, etc).' });
      return;
    }
    setIsUploadingProjectImg(true);
    try {
      const dataUrl = await uploadFile(file, `projects/${Date.now()}_${file.name}`);
      setProjectForm((prev) => ({ ...prev, image: dataUrl }));
      setToast({ type: 'success', title: 'Image Loaded', message: 'Image processed and saved to local storage!' });
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', title: 'Upload Failed', message: err.message || 'Could not process image.' });
    } finally {
      setIsUploadingProjectImg(false);
    }
  };

  const handleOpenAddProject = () => {
    setProjectForm({
      id: '',
      title: '',
      shortDescription: '',
      description: '',
      category: 'IoT & Systems',
      featured: true,
      order: projects.length + 1,
      image: '',
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
  // CERTIFICATES CRUD
  // ----------------------------------------------------
  const handleCertImageUpload = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setToast({ type: 'error', title: 'Invalid File', message: 'Please select an image file (PNG, JPG, WEBP, etc).' });
      return;
    }
    setIsUploadingCertImg(true);
    try {
      const dataUrl = await uploadFile(file, `certificates/${Date.now()}_${file.name}`);
      setCertForm((prev) => ({ ...prev, image: dataUrl }));
      setToast({ type: 'success', title: 'Image Loaded', message: 'Certificate image processed and saved to local storage!' });
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', title: 'Upload Failed', message: err.message || 'Could not process image.' });
    } finally {
      setIsUploadingCertImg(false);
    }
  };

  const handleOpenAddCert = () => {
    setCertForm({
      id: '',
      title: '',
      issuer: 'Bakhtiyarpur College of Engineering',
      issueDate: new Date().getFullYear().toString(),
      credentialId: '',
      credentialUrl: profile?.github || 'https://github.com/dhirajkumar-09/My_Portfolio_',
      image: '',
      category: 'IoT & Hardware',
      skillsStr: 'IoT Architecture, Microcontrollers',
      order: certificates.length + 1
    });
    setIsEditingCert(true);
  };

  const handleOpenEditCert = (c) => {
    setCertForm({
      id: c.id,
      title: c.title || '',
      issuer: c.issuer || '',
      issueDate: c.issueDate || '',
      credentialId: c.credentialId || '',
      credentialUrl: c.credentialUrl || '',
      image: c.image || '',
      category: c.category || 'IoT & Hardware',
      skillsStr: (c.skills || []).join(', '),
      order: c.order || 1
    });
    setIsEditingCert(true);
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    const skillsArray = certForm.skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const dataToSave = {
      title: certForm.title,
      issuer: certForm.issuer,
      issueDate: certForm.issueDate,
      credentialId: certForm.credentialId,
      credentialUrl: certForm.credentialUrl,
      image: certForm.image,
      category: certForm.category,
      skills: skillsArray,
      order: Number(certForm.order) || 1
    };

    try {
      if (certForm.id) {
        await updateCertificate(certForm.id, dataToSave);
        setToast({ type: 'success', title: 'Updated', message: `Certificate "${certForm.title}" saved.` });
      } else {
        await createCertificate(dataToSave);
        setToast({ type: 'success', title: 'Created', message: `Certificate "${certForm.title}" added.` });
      }
      setIsEditingCert(false);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', title: 'Error', message: 'Failed to save certificate.' });
    }
  };

  const handleDeleteCert = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete certificate "${title}"?`)) {
      try {
        await deleteCertificate(id);
        setCertificates((prev) => prev.filter((c) => c.id !== id));
        setToast({ type: 'success', title: 'Deleted', message: `Certificate deleted.` });
      } catch (err) {
        setToast({ type: 'error', title: 'Error', message: 'Failed to delete certificate.' });
      }
    }
  };

  const handleClearAllCertificates = async () => {
    if (window.confirm('Are you sure you want to delete ALL certificates? This will completely clear the certificates catalog and hide the section from your portfolio.')) {
      try {
        for (const cert of certificates) {
          await deleteCertificate(cert.id);
        }
        setCertificates([]);
        setToast({ type: 'success', title: 'All Deleted', message: 'All certificates removed.' });
      } catch (err) {
        setToast({ type: 'error', title: 'Error', message: 'Failed to delete all certificates.' });
      }
    }
  };

  const handleCheckConnection = async () => {
    setIsCheckingDb(true);
    try {
      const result = await testFirestoreConnection();
      setDbHealth(result);
    } catch (err) {
      setDbHealth({ ok: false, message: err.message });
    } finally {
      setIsCheckingDb(false);
    }
  };

  // ----------------------------------------------------
  // PROFILE, HERO & STATS SAVE
  // ----------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfileData(profile);
      setToast({ type: 'success', title: 'Saved', message: 'All profile, hero and about section details updated!' });
    } catch (err) {
      setToast({ type: 'error', title: 'Error', message: 'Failed to update profile.' });
    }
  };

  const handleAddRole = (e) => {
    if (e) e.preventDefault();
    const trimmed = newRoleInput.trim();
    if (!trimmed) return;
    const parts = trimmed.split(',').map((r) => r.trim()).filter(Boolean);
    const currentRoles = profile.roles || [];
    const newRoles = [...currentRoles];
    parts.forEach((p) => {
      if (!newRoles.includes(p)) newRoles.push(p);
    });
    setProfile({
      ...profile,
      roles: newRoles
    });
    setNewRoleInput('');
  };

  const handleRemoveRole = (roleToRemove) => {
    setProfile({
      ...profile,
      roles: (profile.roles || []).filter((r) => r !== roleToRemove)
    });
  };

  const updatePillar = (index, field, value) => {
    const currentPillars = Array.isArray(profile.pillars)
      ? [...profile.pillars]
      : [...(defaultProfile.pillars || [])];
    if (!currentPillars[index]) {
      currentPillars[index] = { title: '', desc: '' };
    }
    currentPillars[index] = { ...currentPillars[index], [field]: value };
    setProfile({ ...profile, pillars: currentPillars });
  };

  const handleAddPillar = () => {
    const currentPillars = Array.isArray(profile.pillars)
      ? [...profile.pillars]
      : [...(defaultProfile.pillars || [])];
    currentPillars.push({
      title: 'New Engineering Focus',
      desc: 'Describe this technical focus area, core competency, or engineering domain.'
    });
    setProfile({ ...profile, pillars: currentPillars });
  };

  const handleDeletePillar = (index) => {
    const currentPillars = Array.isArray(profile.pillars)
      ? [...profile.pillars]
      : [...(defaultProfile.pillars || [])];
    const updated = currentPillars.filter((_, i) => i !== index);
    setProfile({ ...profile, pillars: updated });
  };

  const handleResetPillars = () => {
    if (window.confirm('Reset all engineering focus pillars to standard defaults?')) {
      setProfile({
        ...profile,
        pillars: [
          {
            title: 'IoT & Embedded Engineering',
            desc: 'Passionate about integrating microcontrollers, sensor telemetry, and hardware protocols with cloud dashboards for real-time monitoring.'
          },
          {
            title: 'Modern Full-Stack Web',
            desc: 'Crafting responsive, high-performance web applications using React, modern JavaScript, Tailwind CSS, and Firebase backend services.'
          },
          {
            title: 'Data Structures & Algorithms',
            desc: 'Writing optimized algorithms in Python, Java, and C with a disciplined approach to time-space complexity and object-oriented patterns.'
          }
        ]
      });
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

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white">
                  Admin Control Portal
                </h1>
              </div>
            </div>

            {currentUser && !isAdmin && (
              <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-xs text-amber-200 space-y-2">
                <p>
                  Signed in as <strong className="text-white">{currentUser.email}</strong>, but this account is not authorized for Admin access.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-300/70 font-mono">Authorized Admin account required</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[11px] transition-colors"
                  >
                    Switch Account
                  </button>
                </div>
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {authError}
              </div>
            )}

            {/* Primary Option: Google Sign-In */}
            <div className="pt-1">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer hover:shadow-lg"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In with Google</span>
              </button>
            </div>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-slate-900 text-xs font-mono text-slate-500 uppercase">
                Or Sign In with Email
              </span>
            </div>

            {/* Email / Password fallback */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl font-semibold text-xs font-mono text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-glow-cyan flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In with Email Password'}
              </button>
            </form>
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
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === 'certificates'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates ({certificates.length})</span>
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
        {/* TAB: CERTIFICATES CATALOG */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Certifications &amp; Credentials ({certificates.length})
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Manage technical certifications, verification links, and skill badges.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {certificates.length > 0 && (
                  <button
                    onClick={handleClearAllCertificates}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
                    title="Delete all certificates at once"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete All</span>
                  </button>
                )}

                <button
                  onClick={handleOpenAddCert}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Certificate</span>
                </button>
              </div>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white">No Certificates in Catalog</h3>
                <p className="text-xs text-slate-400 font-mono max-w-md mx-auto leading-relaxed">
                  You have deleted all certificates. Your live portfolio automatically hides the Certificates section until you add your first credential.
                </p>
                <button
                  onClick={handleOpenAddCert}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Certificate</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img
                          src={c.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/70 text-cyan-300 backdrop-blur-md">
                          {c.category || 'Certification'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-cyan-400 font-semibold block">
                          {c.issuer} &bull; {c.issueDate}
                        </span>
                        <h3 className="text-base font-display font-bold text-white mt-1 line-clamp-2">
                          {c.title}
                        </h3>
                        {c.credentialId && (
                          <p className="text-[10px] font-mono text-slate-500 mt-1">
                            ID: {c.credentialId}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {(c.skills || []).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-mono">Order: #{c.order}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditCert(c)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors cursor-pointer"
                          title="Edit certificate"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCert(c.id, c.title)}
                          className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors cursor-pointer"
                          title="Delete certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                      Academic Year / Status (Hero status pill)
                    </label>
                    <input
                      type="text"
                      value={profile.year || ''}
                      placeholder="e.g. 2nd Year Student (2023 - 2027)"
                      onChange={(e) => setProfile({ ...profile, year: e.target.value })}
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
                      placeholder="e.g. Patna, Bihar, India"
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={profile.phone || ''}
                      placeholder="+91 9876543210"
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-cyan-300">
                      Hero Typing Animation Customizer
                    </label>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Live Dynamic
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Typing Prefix Text (Lead text before role)
                    </label>
                    <input
                      type="text"
                      value={profile.typingPrefix !== undefined ? profile.typingPrefix : '> I am a'}
                      onChange={(e) => setProfile({ ...profile, typingPrefix: e.target.value })}
                      placeholder="> I am a"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                    />
                    <p className="text-[11px] font-mono text-slate-500 mt-1">
                      Prefix shown before the animated typing text (e.g. `&gt; I am a`, `I build`, or `Role:`).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      Active Typing Roles ({profile.roles?.length || 0})
                    </label>
                    
                    {/* Role Tags List */}
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      {(profile.roles && profile.roles.length > 0) ? (
                        profile.roles.map((role, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 shadow-sm transition-all hover:border-cyan-400"
                          >
                            <span>{role}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRole(role)}
                              className="w-4 h-4 rounded-full inline-flex items-center justify-center text-cyan-400/60 hover:text-rose-400 hover:bg-rose-500/20 transition-colors ml-0.5 cursor-pointer"
                              title={`Remove "${role}"`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-mono text-slate-500 italic py-1">
                          No roles added yet. Type a role below to add it.
                        </span>
                      )}
                    </div>

                    {/* Add Role Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newRoleInput}
                        onChange={(e) => setNewRoleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddRole(e);
                          }
                        }}
                        placeholder="Add a new role (or comma-separated roles) and press Enter..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Enter</kbd> or click <strong>Add</strong>. You can also paste comma-separated roles.
                    </p>
                  </div>
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
              </div>

              {/* About Section Customization (Career Objective, Bio & 3 Engineering Pillars) */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      About Section Customization
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customize every heading, career objective statement, biography narrative, and the 3 engineering focus pillars.
                    </p>
                  </div>
                </div>

                {/* Section Heading & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Section Main Title
                    </label>
                    <input
                      type="text"
                      value={profile.aboutHeading || 'About My Engineering Journey'}
                      onChange={(e) => setProfile({ ...profile, aboutHeading: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={profile.aboutSubtitle || 'Combining academic rigor with hands-on systems development to build purposeful technology.'}
                      onChange={(e) => setProfile({ ...profile, aboutSubtitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Career Objective Card Fields */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Left Card: Career Objective &amp; Bio Narrative
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">
                        Top Badge Text
                      </label>
                      <input
                        type="text"
                        value={profile.aboutBadge || 'Career Objective & Aspirations'}
                        onChange={(e) => setProfile({ ...profile, aboutBadge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">
                        Degree / Specialization Headline
                      </label>
                      <input
                        type="text"
                        value={profile.aboutTitle || profile.title || 'B.Tech Student in CSE (IoT Specialization)'}
                        onChange={(e) => setProfile({ ...profile, aboutTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">
                        Current Affiliation Label
                      </label>
                      <input
                        type="text"
                        value={profile.affiliation || profile.college || 'Bakhtiyarpur College of Engg., Patna'}
                        onChange={(e) => setProfile({ ...profile, affiliation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Objective Statement (Paragraph 1)
                    </label>
                    <textarea
                      rows={3}
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Motivated, detail-oriented B.Tech student in Computer Science & Engineering..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Academic Narrative / Journey (Paragraph 2)
                    </label>
                    <textarea
                      rows={3}
                      value={profile.aboutBio2 || ''}
                      onChange={(e) => setProfile({ ...profile, aboutBio2: e.target.value })}
                      placeholder="Currently in my 2nd year (2023–2027), I focus on writing clean, modular code..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>

                {/* Engineering Focus Pillars Customization */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                        <span>Engineering Focus Pillars</span>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {(Array.isArray(profile.pillars) ? profile.pillars : (defaultProfile.pillars || [])).length} Active
                        </span>
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Interactive cards displayed in the About section right column. Add, edit, or delete any pillar.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetPillars}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Restore 3 standard default pillars"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPillar}
                        className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Pillar</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Pillars List */}
                  {((Array.isArray(profile.pillars) ? profile.pillars : (defaultProfile.pillars || [])).length === 0) ? (
                    <div className="p-6 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
                      <p className="text-xs font-mono text-slate-400">
                        No engineering pillars configured. The About section will fallback to defaults until you add one.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddPillar}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-medium transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create First Pillar</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {(Array.isArray(profile.pillars) ? profile.pillars : (defaultProfile.pillars || [])).map((pillar, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                              Pillar #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeletePillar(idx)}
                              className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-md transition-colors cursor-pointer"
                              title={`Delete Pillar #${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={pillar.title || ''}
                              onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                              placeholder="e.g. Cloud & Distributed Systems"
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-1">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={pillar.desc || ''}
                              onChange={(e) => updatePillar(idx, 'desc', e.target.value)}
                              placeholder="Describe this engineering focus area..."
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Twitter / X (Optional)
                    </label>
                    <input
                      type="url"
                      value={profile.twitter || ''}
                      placeholder="https://x.com/..."
                      onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Writing Data to Firestore...' : 'Seed All Collections'}</span>
                </button>
              </div>
            </div>

            {/* Live Firestore Connection Diagnostics */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-display font-bold text-white">
                      Live Firestore Health Check
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">
                      Verify whether your Firebase Security Rules and Firestore project are allowing real-time reads and writes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCheckConnection}
                  disabled={isCheckingDb}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-2 cursor-pointer transition-all flex-shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
                  <span>{isCheckingDb ? 'Checking...' : 'Run Diagnostics'}</span>
                </button>
              </div>

              {dbHealth && (
                <div
                  className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                    dbHealth.ok
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {dbHealth.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{dbHealth.message}</span>
                  </div>

                  {!dbHealth.ok && (
                    <div className="mt-2 pt-2 border-t border-rose-500/20 text-[11px] text-slate-300 space-y-1">
                      <p className="font-semibold text-amber-300">Quick Fix for Firestore:</p>
                      <p>1. Open Firebase Console &gt; Firestore Database &gt; Rules.</p>
                      <p>2. Set rules to allow access or publish the provided rules in <span className="font-mono text-cyan-300">firestore.rules</span>.</p>
                      <p>3. Click &quot;Publish&quot; in Firebase Console, then run diagnostics again.</p>
                    </div>
                  )}
                </div>
              )}
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

              {/* LOCAL IMAGE UPLOAD ONLY (NO URL INPUT) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Project Cover Image (Local Upload)</span>
                  </label>
                  {projectForm.image ? (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Loaded in Local Storage</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-amber-400/90">
                      * Upload from your computer
                    </span>
                  )}
                </div>

                {!projectForm.image ? (
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0];
                      if (file) handleProjectImageUpload(file);
                    }}
                    onPaste={(e) => {
                      const files = e.clipboardData?.files;
                      if (files && files.length > 0 && files[0].type.startsWith('image/')) {
                        e.preventDefault();
                        handleProjectImageUpload(files[0]);
                      }
                    }}
                    className="relative flex flex-col items-center justify-center w-full min-h-[160px] p-6 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl bg-cyan-950/20 hover:bg-cyan-950/30 transition-all cursor-pointer group text-center"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProjectImageUpload(file);
                        e.target.value = '';
                      }}
                    />
                    {isUploadingProjectImg ? (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                        <span className="text-xs font-mono text-cyan-300">Processing & saving image locally...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                          <Upload className="w-6 h-6 text-cyan-400" />
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">
                          Click to Choose Image from Computer
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          or Drag & Drop image file here / Paste with Ctrl+V
                        </p>
                        <span className="mt-2 text-[10px] text-cyan-400/80 font-mono bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                          PNG, JPG, WEBP • Stored directly in browser local storage
                        </span>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                      <img
                        src={projectForm.image}
                        alt="Project Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingProjectImg ? 'Processing...' : 'Change Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingProjectImg}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleProjectImageUpload(file);
                            e.target.value = '';
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setProjectForm({ ...projectForm, image: '' })}
                        className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
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
      {/* EDIT / CREATE CERTIFICATE MODAL */}
      {/* ---------------------------------------------------- */}
      {isEditingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>{certForm.id ? 'Edit Certificate' : 'Add New Certificate'}</span>
              </h3>
              <button
                onClick={() => setIsEditingCert(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="e.g. IoT & Embedded Systems Prototyping"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Issuer / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="e.g. Bakhtiyarpur College of Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={certForm.category}
                    onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  >
                    <option value="IoT & Hardware">IoT &amp; Hardware</option>
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cloud & Database">Cloud &amp; Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={certForm.order}
                    onChange={(e) => setCertForm({ ...certForm, order: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={certForm.credentialId}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                    placeholder="e.g. BCE-IOT-2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Verification Link (URL)
                  </label>
                  <input
                    type="url"
                    value={certForm.credentialUrl}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Skills &amp; Competencies (comma separated)
                </label>
                <input
                  type="text"
                  value={certForm.skillsStr}
                  onChange={(e) => setCertForm({ ...certForm, skillsStr: e.target.value })}
                  placeholder="e.g. IoT Architecture, Microcontrollers, Embedded C"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              {/* LOCAL CERTIFICATE IMAGE UPLOAD ONLY (NO URL INPUT) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Certificate Image (Local Upload)</span>
                  </label>
                  {certForm.image ? (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Loaded in Local Storage</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-amber-400/90">
                      * Upload from your computer
                    </span>
                  )}
                </div>

                {!certForm.image ? (
                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0];
                      if (file) handleCertImageUpload(file);
                    }}
                    onPaste={(e) => {
                      const files = e.clipboardData?.files;
                      if (files && files.length > 0 && files[0].type.startsWith('image/')) {
                        e.preventDefault();
                        handleCertImageUpload(files[0]);
                      }
                    }}
                    className="relative flex flex-col items-center justify-center w-full min-h-[160px] p-6 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl bg-cyan-950/20 hover:bg-cyan-950/30 transition-all cursor-pointer group text-center"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCertImageUpload(file);
                        e.target.value = '';
                      }}
                    />
                    {isUploadingCertImg ? (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                        <span className="text-xs font-mono text-cyan-300">Processing & saving image locally...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                          <Upload className="w-6 h-6 text-cyan-400" />
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">
                          Click to Choose Certificate Image from Computer
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          or Drag & Drop certificate image here / Paste with Ctrl+V
                        </p>
                        <span className="mt-2 text-[10px] text-cyan-400/80 font-mono bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                          PNG, JPG, WEBP • Stored directly in browser local storage
                        </span>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                      <img
                        src={certForm.image}
                        alt="Certificate Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingCertImg ? 'Processing...' : 'Change Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingCertImg}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCertImageUpload(file);
                            e.target.value = '';
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setCertForm({ ...certForm, image: '' })}
                        className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingCert(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan cursor-pointer"
                >
                  {certForm.id ? 'Save Certificate Changes' : 'Create Certificate'}
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
