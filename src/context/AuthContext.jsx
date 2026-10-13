import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext();

const PRIMARY_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'dhirajku00021@gmail.com').toLowerCase();
const ALLOWED_ADMIN_EMAILS = [
  PRIMARY_ADMIN_EMAIL,
  'dhirajku00021@gmail.com',
  'dhrajk8023@gmail.com'
];
const ADMIN_UID = import.meta.env.VITE_ADMIN_UID || '';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState(() => {
    return localStorage.getItem('dhiraj_portfolio_demo_admin') === 'true';
  });

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      return await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Demo authentication fallback
      const normalizedEmail = (email || '').toLowerCase().trim();
      if (ALLOWED_ADMIN_EMAILS.includes(normalizedEmail) || normalizedEmail === 'admin@demo.com') {
        setIsDemoAdmin(true);
        localStorage.setItem('dhiraj_portfolio_demo_admin', 'true');
        setCurrentUser({
          email: normalizedEmail,
          displayName: 'Dhiraj Kumar (Demo Admin)',
          uid: 'demo-admin-uid'
        });
        return { user: { email: normalizedEmail } };
      } else {
        throw new Error('Invalid email or password. Please use dhirajku00021@gmail.com or dhrajk8023@gmail.com');
      }
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      return await signInWithPopup(auth, googleProvider);
    } else {
      setIsDemoAdmin(true);
      localStorage.setItem('dhiraj_portfolio_demo_admin', 'true');
      setCurrentUser({
        email: PRIMARY_ADMIN_EMAIL,
        displayName: 'Dhiraj Kumar (Google Auth)',
        uid: 'demo-admin-uid'
      });
      return { user: { email: PRIMARY_ADMIN_EMAIL } };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setIsDemoAdmin(false);
    localStorage.removeItem('dhiraj_portfolio_demo_admin', 'true');
    setCurrentUser(null);
  };

  const enableDemoAdmin = () => {
    setIsDemoAdmin(true);
    localStorage.setItem('dhiraj_portfolio_demo_admin', 'true');
    setCurrentUser({
      email: PRIMARY_ADMIN_EMAIL,
      displayName: 'Dhiraj Kumar',
      uid: 'demo-admin-uid'
    });
  };

  // Determine if active user is authorized admin
  const userEmail = (currentUser?.email || '').toLowerCase().trim();
  const isAdmin = Boolean(
    isDemoAdmin ||
    (currentUser && (
      ALLOWED_ADMIN_EMAILS.includes(userEmail) ||
      (ADMIN_UID && currentUser.uid === ADMIN_UID)
    ))
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        loginWithEmail,
        loginWithGoogle,
        logout,
        enableDemoAdmin,
        adminEmail: PRIMARY_ADMIN_EMAIL,
        allowedAdminEmails: ALLOWED_ADMIN_EMAILS,
        isFirebaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
