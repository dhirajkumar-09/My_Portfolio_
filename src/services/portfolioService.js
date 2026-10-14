import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import {
  defaultProfile,
  defaultProjects,
  defaultEducation,
  defaultSkills,
  defaultCertificates
} from '../data/defaultPortfolioData';

// Local storage keys for offline/fallback caching
const STORAGE_KEYS = {
  PROFILE: 'dhiraj_portfolio_profile',
  PROJECTS: 'dhiraj_portfolio_projects',
  EDUCATION: 'dhiraj_portfolio_education',
  SKILLS: 'dhiraj_portfolio_skills',
  CERTIFICATES: 'dhiraj_portfolio_certificates',
  MESSAGES: 'dhiraj_portfolio_messages',
};

// Helpers for localStorage fallback
const getLocal = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null && val !== undefined ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Local storage write error:', e);
  }
};

// ----------------------------------------------------
// PROFILE SERVICES
// ----------------------------------------------------
export const subscribeToProfile = (callback) => {
  if (isFirebaseConfigured && db) {
    const profileDocRef = doc(db, 'profile', 'main');
    return onSnapshot(
      profileDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { ...defaultProfile, ...snapshot.data() };
          setLocal(STORAGE_KEYS.PROFILE, data);
          callback(data);
        } else {
          // If doc doesn't exist yet, return cached/default
          const local = getLocal(STORAGE_KEYS.PROFILE, defaultProfile);
          callback(local);
        }
      },
      (error) => {
        console.warn('Firestore profile snapshot error:', error);
        callback(getLocal(STORAGE_KEYS.PROFILE, defaultProfile));
      }
    );
  } else {
    callback(getLocal(STORAGE_KEYS.PROFILE, defaultProfile));
    return () => {};
  }
};

export const updateProfileData = async (newProfile) => {
  setLocal(STORAGE_KEYS.PROFILE, newProfile);
  if (isFirebaseConfigured && db) {
    const profileDocRef = doc(db, 'profile', 'main');
    await setDoc(profileDocRef, { ...newProfile, updatedAt: serverTimestamp() }, { merge: true });
  }
  return newProfile;
};

// ----------------------------------------------------
// PROJECTS SERVICES
// ----------------------------------------------------
export const subscribeToProjects = (callback) => {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setLocal(STORAGE_KEYS.PROJECTS, list);
          setLocal('dhiraj_portfolio_projects_user_modified', 'true');
          callback(list);
        } else {
          const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_projects_user_modified') === 'true';
          const localData = getLocal(STORAGE_KEYS.PROJECTS, null);
          if (wasModifiedLocally || (localData !== null && Array.isArray(localData) && localData.length === 0)) {
            setLocal(STORAGE_KEYS.PROJECTS, []);
            callback([]);
          } else if (localData !== null && Array.isArray(localData)) {
            callback(localData);
          } else {
            callback(defaultProjects);
          }
        }
      },
      (error) => {
        console.warn('Firestore projects snapshot error:', error);
        const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_projects_user_modified') === 'true';
        const local = getLocal(STORAGE_KEYS.PROJECTS, wasModifiedLocally ? [] : defaultProjects);
        callback(local);
      }
    );
  } else {
    const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_projects_user_modified') === 'true';
    const local = getLocal(STORAGE_KEYS.PROJECTS, wasModifiedLocally ? [] : defaultProjects);
    callback(local);
    return () => {};
  }
};

export const createProject = async (projectData) => {
  const current = getLocal(STORAGE_KEYS.PROJECTS, defaultProjects);
  let finalId = `proj-${Date.now()}`;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      finalId = docRef.id;
    } catch (err) {
      console.warn('Firestore createProject sync error (using local id):', err);
    }
  }

  const newProj = { id: finalId, ...projectData };
  const updated = [newProj, ...current];
  setLocal(STORAGE_KEYS.PROJECTS, updated);
  setLocal('dhiraj_portfolio_projects_user_modified', 'true');
  return newProj;
};

export const updateProject = async (id, projectData) => {
  // 1. Immediately update local storage so data is NEVER lost
  const current = getLocal(STORAGE_KEYS.PROJECTS, defaultProjects);
  const exists = current.some((p) => p.id === id);
  const updated = exists
    ? current.map((p) => (p.id === id ? { ...p, ...projectData } : p))
    : [{ id, ...projectData }, ...current];
  setLocal(STORAGE_KEYS.PROJECTS, updated);
  setLocal('dhiraj_portfolio_projects_user_modified', 'true');

  // 2. Sync to Firestore using setDoc with merge: true (creates doc if missing, updates if exists)
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'projects', id);
      await setDoc(
        docRef,
        {
          ...projectData,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore updateProject sync error (saved locally):', err);
    }
  }

  return { id, ...projectData };
};

export const deleteProject = async (id) => {
  const current = getLocal(STORAGE_KEYS.PROJECTS, defaultProjects);
  const updated = current.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PROJECTS, updated);
  setLocal('dhiraj_portfolio_projects_user_modified', 'true');

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.warn('Firestore deleteProject sync error:', err);
    }
  }
  return updated;
};

// ----------------------------------------------------
// EDUCATION SERVICES
// ----------------------------------------------------
export const subscribeToEducation = (callback) => {
  if (isFirebaseConfigured && db) {
    const q = collection(db, 'education');
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setLocal(STORAGE_KEYS.EDUCATION, list);
          setLocal('dhiraj_portfolio_education_user_modified', 'true');
          callback(list);
        } else {
          const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_education_user_modified') === 'true';
          const localData = getLocal(STORAGE_KEYS.EDUCATION, null);
          if (wasModifiedLocally || (localData !== null && Array.isArray(localData) && localData.length === 0)) {
            setLocal(STORAGE_KEYS.EDUCATION, []);
            callback([]);
          } else if (localData !== null && Array.isArray(localData)) {
            callback(localData);
          } else {
            callback(defaultEducation);
          }
        }
      },
      (error) => {
        console.warn('Firestore education snapshot error:', error);
        const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_education_user_modified') === 'true';
        const local = getLocal(STORAGE_KEYS.EDUCATION, wasModifiedLocally ? [] : defaultEducation);
        callback(local);
      }
    );
  } else {
    const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_education_user_modified') === 'true';
    const local = getLocal(STORAGE_KEYS.EDUCATION, wasModifiedLocally ? [] : defaultEducation);
    callback(local);
    return () => {};
  }
};

export const addOrUpdateEducation = async (eduItem) => {
  const current = getLocal(STORAGE_KEYS.EDUCATION, defaultEducation);
  const exists = current.some((e) => e.id === eduItem.id);
  const updated = exists
    ? current.map((e) => (e.id === eduItem.id ? eduItem : e))
    : [...current, eduItem];

  setLocal(STORAGE_KEYS.EDUCATION, updated);
  setLocal('dhiraj_portfolio_education_user_modified', 'true');
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'education', eduItem.id);
    await setDoc(docRef, eduItem, { merge: true });
  }
  return updated;
};

export const deleteEducation = async (id) => {
  const current = getLocal(STORAGE_KEYS.EDUCATION, defaultEducation);
  const updated = current.filter((e) => e.id !== id);
  setLocal(STORAGE_KEYS.EDUCATION, updated);
  setLocal('dhiraj_portfolio_education_user_modified', 'true');
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'education', id));
  }
  return updated;
};

export const saveEducationList = async (list) => {
  setLocal(STORAGE_KEYS.EDUCATION, list);
  if (isFirebaseConfigured && db) {
    for (const item of list) {
      const docRef = doc(db, 'education', item.id);
      await setDoc(docRef, item, { merge: true });
    }
  }
  return list;
};

// ----------------------------------------------------
// SKILLS SERVICES
// ----------------------------------------------------
export const subscribeToSkills = (callback) => {
  if (isFirebaseConfigured && db) {
    const q = collection(db, 'skills');
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setLocal(STORAGE_KEYS.SKILLS, list);
          callback(list);
        } else {
          callback(getLocal(STORAGE_KEYS.SKILLS, defaultSkills));
        }
      },
      (error) => {
        console.warn('Firestore skills snapshot error:', error);
        callback(getLocal(STORAGE_KEYS.SKILLS, defaultSkills));
      }
    );
  } else {
    callback(getLocal(STORAGE_KEYS.SKILLS, defaultSkills));
    return () => {};
  }
};

export const addOrUpdateSkillCategory = async (catItem) => {
  const current = getLocal(STORAGE_KEYS.SKILLS, defaultSkills);
  const catId = catItem.id || `cat_${catItem.category.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const fullItem = { ...catItem, id: catId };
  const exists = current.some((c) => c.category === catItem.category || c.id === catId);
  const updated = exists
    ? current.map((c) => (c.category === catItem.category || c.id === catId ? fullItem : c))
    : [...current, fullItem];

  setLocal(STORAGE_KEYS.SKILLS, updated);
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'skills', catId);
    await setDoc(docRef, fullItem, { merge: true });
  }
  return updated;
};

export const deleteSkillCategory = async (idOrCategory) => {
  const current = getLocal(STORAGE_KEYS.SKILLS, defaultSkills);
  const updated = current.filter((c) => c.category !== idOrCategory && c.id !== idOrCategory);
  setLocal(STORAGE_KEYS.SKILLS, updated);
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'skills', idOrCategory));
  }
  return updated;
};

export const saveSkillsList = async (list) => {
  setLocal(STORAGE_KEYS.SKILLS, list);
  if (isFirebaseConfigured && db) {
    for (const [idx, item] of list.entries()) {
      const docRef = doc(db, 'skills', item.id || `cat_${idx}`);
      await setDoc(docRef, item, { merge: true });
    }
  }
  return list;
};

// ----------------------------------------------------
// CONTACT MESSAGES SERVICES
// ----------------------------------------------------
export const sendContactMessage = async ({ name, email, subject, message }) => {
  const newMsg = {
    name,
    email,
    subject: subject || 'Portfolio Inquiry',
    message,
    read: false,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...newMsg,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Failed to write message to Firestore:', err);
      // Fallback save locally
      const current = getLocal(STORAGE_KEYS.MESSAGES, []);
      setLocal(STORAGE_KEYS.MESSAGES, [{ id: `msg-${Date.now()}`, ...newMsg }, ...current]);
      return { success: true, offline: true };
    }
  } else {
    const current = getLocal(STORAGE_KEYS.MESSAGES, []);
    setLocal(STORAGE_KEYS.MESSAGES, [{ id: `msg-${Date.now()}`, ...newMsg }, ...current]);
    return { success: true, offline: true };
  }
};

export const subscribeToMessages = (callback) => {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setLocal(STORAGE_KEYS.MESSAGES, msgs);
        callback(msgs);
      },
      (error) => {
        console.warn('Firestore messages error:', error);
        callback(getLocal(STORAGE_KEYS.MESSAGES, []));
      }
    );
  } else {
    callback(getLocal(STORAGE_KEYS.MESSAGES, []));
    return () => {};
  }
};

export const markMessageAsRead = async (id, readStatus = true) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'messages', id);
      await updateDoc(docRef, { read: readStatus });
    } catch (e) {
      console.error('Firestore mark read error:', e);
    }
  }
  const current = getLocal(STORAGE_KEYS.MESSAGES, []);
  const updated = current.map((m) => (m.id === id ? { ...m, read: readStatus } : m));
  setLocal(STORAGE_KEYS.MESSAGES, updated);
};

export const deleteMessage = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (e) {
      console.error('Firestore delete message error:', e);
    }
  }
  const current = getLocal(STORAGE_KEYS.MESSAGES, []);
  const updated = current.filter((m) => m.id !== id);
  setLocal(STORAGE_KEYS.MESSAGES, updated);
};

// ----------------------------------------------------
// RESUME & FILE UPLOADS
// ----------------------------------------------------
export const readImageAsLocalDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));

    // If already a Data URL or URL string, return directly
    if (typeof file === 'string') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file from local storage'));
    reader.onload = (e) => {
      const rawResult = e.target.result;

      // If not an image (e.g. PDF resume) or is an SVG, return raw data url directly
      if (!file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
        return resolve(rawResult);
      }

      let isSettled = false;
      const safetyTimer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          resolve(rawResult);
        }
      }, 3000);

      const img = new Image();
      img.onerror = () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(safetyTimer);
          resolve(rawResult);
        }
      };

      img.onload = () => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(safetyTimer);

        try {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(rawResult);
          }

          // If not transparent PNG, fill slate background
          if (file.type !== 'image/png') {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP for ultra-compact size & transparency, fallback to JPEG
          let compressed;
          try {
            compressed = canvas.toDataURL('image/webp', 0.84);
            if (!compressed || !compressed.startsWith('data:image/webp')) {
              compressed = canvas.toDataURL('image/jpeg', 0.82);
            }
          } catch {
            compressed = canvas.toDataURL('image/jpeg', 0.82);
          }

          resolve(compressed || rawResult);
        } catch (canvasErr) {
          console.warn('Canvas optimization fallback:', canvasErr);
          resolve(rawResult);
        }
      };

      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  });
};

export const uploadFile = async (file, path = 'resumes/dhiraj_kumar_resume.pdf') => {
  // Always convert directly to local compressed data URL for instant 100% reliable local storage
  return readImageAsLocalDataUrl(file);
};

// ----------------------------------------------------
// CERTIFICATES SERVICES
// ----------------------------------------------------
export const subscribeToCertificates = (callback) => {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'certificates'), orderBy('order', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setLocal(STORAGE_KEYS.CERTIFICATES, list);
          setLocal('dhiraj_portfolio_certificates_user_modified', 'true');
          callback(list);
        } else {
          // If Firestore returns 0 documents, check if user deleted/modified them
          const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_certificates_user_modified') === 'true';
          const localData = getLocal(STORAGE_KEYS.CERTIFICATES, null);

          if (wasModifiedLocally || (localData !== null && Array.isArray(localData) && localData.length === 0)) {
            setLocal(STORAGE_KEYS.CERTIFICATES, []);
            callback([]);
          } else if (localData !== null && Array.isArray(localData)) {
            callback(localData);
          } else {
            callback(defaultCertificates);
          }
        }
      },
      (error) => {
        console.warn('Firestore certificates snapshot error:', error);
        const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_certificates_user_modified') === 'true';
        const local = getLocal(STORAGE_KEYS.CERTIFICATES, wasModifiedLocally ? [] : defaultCertificates);
        callback(local);
      }
    );
  } else {
    const wasModifiedLocally = localStorage.getItem('dhiraj_portfolio_certificates_user_modified') === 'true';
    const local = getLocal(STORAGE_KEYS.CERTIFICATES, wasModifiedLocally ? [] : defaultCertificates);
    callback(local);
    return () => {};
  }
};

export const createCertificate = async (certData) => {
  const current = getLocal(STORAGE_KEYS.CERTIFICATES, defaultCertificates);
  let finalId = `cert-${Date.now()}`;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'certificates'), {
        ...certData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      finalId = docRef.id;
    } catch (err) {
      console.warn('Firestore createCertificate sync error (using local id):', err);
    }
  }

  const newCert = { id: finalId, ...certData };
  const updated = [newCert, ...current];
  setLocal(STORAGE_KEYS.CERTIFICATES, updated);
  setLocal('dhiraj_portfolio_certificates_user_modified', 'true');
  return newCert;
};

export const updateCertificate = async (id, certData) => {
  const current = getLocal(STORAGE_KEYS.CERTIFICATES, defaultCertificates);
  const exists = current.some((c) => c.id === id);
  const updated = exists
    ? current.map((c) => (c.id === id ? { ...c, ...certData } : c))
    : [{ id, ...certData }, ...current];
  setLocal(STORAGE_KEYS.CERTIFICATES, updated);
  setLocal('dhiraj_portfolio_certificates_user_modified', 'true');

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'certificates', id);
      await setDoc(
        docRef,
        {
          ...certData,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore updateCertificate sync error (saved locally):', err);
    }
  }

  return { id, ...certData };
};

export const deleteCertificate = async (id) => {
  const current = getLocal(STORAGE_KEYS.CERTIFICATES, defaultCertificates);
  const updated = current.filter((c) => c.id !== id);
  setLocal(STORAGE_KEYS.CERTIFICATES, updated);
  setLocal('dhiraj_portfolio_certificates_user_modified', 'true');

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'certificates', id));
    } catch (err) {
      console.warn('Firestore deleteCertificate sync error:', err);
    }
  }

  return updated;
};

// ----------------------------------------------------
// FIRESTORE HEALTH CHECK
// ----------------------------------------------------
export const testFirestoreConnection = async () => {
  if (!isFirebaseConfigured || !db) {
    return {
      ok: false,
      status: 'offline_mode',
      message: 'Firebase is not initialized. Using local offline storage mode.'
    };
  }
  try {
    const testDoc = await getDoc(doc(db, 'profile', 'main'));
    return {
      ok: true,
      status: 'connected',
      exists: testDoc.exists(),
      message: testDoc.exists()
        ? 'Connected to live Firestore. Data documents exist.'
        : 'Connected to Firestore. Database is active, ready to be seeded.'
    };
  } catch (err) {
    return {
      ok: false,
      status: 'permission_denied',
      error: err.code || err.message,
      message: err.message?.includes('permission')
        ? 'Connected to Firestore, but Security Rules rejected access. Please publish rules in Firebase Console.'
        : `Connection check returned: ${err.message}`
    };
  }
};

// ----------------------------------------------------
// SEED DATABASE UTILITY
// ----------------------------------------------------
export const seedDatabase = async () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured yet. Please configure your .env credentials first.');
  }

  // 1. Seed Profile
  await setDoc(doc(db, 'profile', 'main'), {
    ...defaultProfile,
    updatedAt: serverTimestamp()
  });

  // 2. Seed Projects
  for (const proj of defaultProjects) {
    await setDoc(doc(db, 'projects', proj.id), {
      ...proj,
      updatedAt: serverTimestamp()
    });
  }

  // 3. Seed Education
  for (const edu of defaultEducation) {
    await setDoc(doc(db, 'education', edu.id), {
      ...edu,
      updatedAt: serverTimestamp()
    });
  }

  // 4. Seed Skills
  for (const [idx, skillCat] of defaultSkills.entries()) {
    await setDoc(doc(db, 'skills', `category_${idx}`), {
      ...skillCat,
      order: idx,
      updatedAt: serverTimestamp()
    });
  }

  // 5. Seed Certificates
  for (const cert of defaultCertificates) {
    await setDoc(doc(db, 'certificates', cert.id), {
      ...cert,
      updatedAt: serverTimestamp()
    });
  }

  return { success: true };
};
