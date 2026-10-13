# 🚀 Deployment Guide - Dhiraj Kumar Portfolio

This guide covers deploying the portfolio to **Firebase Hosting** or **Vercel**.

---

## Option 1: Deploy to Firebase Hosting (Recommended)

Because your portfolio already utilizes Firebase Firestore, Storage, and Auth, hosting on Firebase provides zero-configuration custom domains and SSL.

### Prerequisites
Install the Firebase CLI if you haven't already:
```bash
npm install -g firebase-tools
```

### Step 1: Login to Firebase
```bash
firebase login
```

### Step 2: Initialize Firebase Hosting
From the root of `c:\My_Portfolio`:
```bash
firebase init hosting
```
- Select your Firebase Project (`dhirajkumar-portfolio`).
- What do you want to use as your public directory? Type: `dist`
- Configure as a single-page app (rewrite all urls to /index.html)? Type: `y`
- Set up automatic builds and deploys with GitHub? Optional (`y` or `n`).
- File `dist/index.html` already exists. Overwrite? Type: `n`

### Step 3: Build the Production App
```bash
npm run build
```

### Step 4: Deploy Rules & Website
Deploy Firestore rules, Storage rules, and website in one command:
```bash
firebase deploy
```
Your portfolio will be live at:
`https://<your-project-id>.web.app` or `https://<your-project-id>.firebaseapp.com`

---

## Option 2: Deploy to Vercel (1-Click Git Integration)

1. Push your portfolio code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Dhiraj Kumar portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/dhiraj-portfolio.git
   git push -u origin main
   ```
2. Go to [https://vercel.com/](https://vercel.com/) and sign in with GitHub.
3. Click **Add New...** > **Project** and select your `dhiraj-portfolio` repository.
4. Framework Preset will automatically detect **Vite**.
5. In **Environment Variables**, add the variables from your `.env` file (`VITE_FIREBASE_API_KEY`, etc.).
6. Click **Deploy**.
7. Vercel will build and assign you a fast, global edge URL with HTTPS.

---

## Post-Deployment Checklist

- [ ] Visit `/admin` and confirm authentication works.
- [ ] Submit a test message on the contact form and confirm it arrives in Firestore and your inbox (`dhirajku00021@gmail.com`).
- [ ] Click the "Download Resume" button on the hero section to verify PDF delivery.
- [ ] Toggle dark and light modes to ensure styles render crisply across devices.
