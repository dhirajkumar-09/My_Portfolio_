# 🔥 Firebase Setup Guide - Dhiraj Kumar Portfolio

This step-by-step guide walks you through configuring **Cloud Firestore**, **Firebase Authentication**, and **Firebase Storage** for your portfolio.

---

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g. `dhirajkumar-portfolio`).
4. Disable Google Analytics (or keep enabled if desired) and click **Create Project**.

---

## 2. Register a Web App & Copy Credentials

1. In the Project Overview page, click the **Web icon (`</>`)** to add a web application.
2. Enter an App nickname (e.g., `dhiraj-web`) and click **Register app**.
3. Under **Add Firebase SDK**, select the `npm` tab or look at `firebaseConfig`:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "dhirajkumar-portfolio.firebaseapp.com",
     projectId: "dhirajkumar-portfolio",
     storageBucket: "dhirajkumar-portfolio.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
4. In your project root, create a file named `.env` by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Paste your config values into `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=dhirajkumar-portfolio.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=dhirajkumar-portfolio
   VITE_FIREBASE_STORAGE_BUCKET=dhirajkumar-portfolio.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_ADMIN_EMAIL=dhirajku00021@gmail.com
   ```

---

## 3. Enable Cloud Firestore

1. In the Firebase console sidebar, navigate to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose a location closest to India (e.g., `asia-south1` Mumbai).
4. Start in **Production mode**.
5. Go to the **Rules** tab in Firestore and replace with the contents of [`firestore.rules`](./firestore.rules):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       function isAuthenticated() { return request.auth != null; }
       function isAdmin() {
         return isAuthenticated() && (
           request.auth.token.email.lower() == 'dhirajku00021@gmail.com'
         );
       }
       match /profile/{docId} { allow read: if true; allow write: if isAdmin(); }
       match /projects/{docId} { allow read: if true; allow write: if isAdmin(); }
       match /skills/{docId} { allow read: if true; allow write: if isAdmin(); }
       match /education/{docId} { allow read: if true; allow write: if isAdmin(); }
       match /messages/{messageId} {
         allow create: if request.resource.data.name is string &&
                          request.resource.data.email is string &&
                          request.resource.data.message is string;
         allow read, update, delete: if isAdmin();
       }
     }
   }
   ```
6. Click **Publish**.

---

## 4. Enable Firebase Authentication

1. Go to **Build > Authentication** and click **Get started**.
2. Under the **Sign-in method** tab:
   - **Email/Password**: Enable **Email/Password** (keep Email link disabled). Click Save.
   - **Google**: Click **Google**, enable it, select support email (`dhirajku00021@gmail.com`), and click Save.
3. Under the **Users** tab:
   - Click **Add user**.
   - Email: `dhirajku00021@gmail.com`
   - Set a strong admin password.
   - Note the created UID (can optionally be set in `VITE_ADMIN_UID`).

---

## 5. Enable Firebase Storage (For Resume & Images)

1. Go to **Build > Storage** and click **Get started**.
2. Select **Production mode** and choose the same region (`asia-south1`).
3. In the **Rules** tab, paste the rules from [`storage.rules`](./storage.rules):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       function isAdmin() {
         return request.auth != null && request.auth.token.email == 'dhirajku00021@gmail.com';
       }
       match /{allPaths=**} {
         allow read: if true;
         allow write: if isAdmin();
       }
     }
   }
   ```
4. Click **Publish**.

---

## 6. Seed All Resume & Project Data

You have two convenient ways to seed your data:

### Method A: One-Click in Admin Panel (Recommended)
1. Start your local dev server: `npm run dev`
2. Navigate to `http://localhost:5173/admin`
3. Sign in with `dhirajku00021@gmail.com` (or click *Instant Demo Admin Access*)
4. Go to the **Database Tools** tab and click **Seed All Collections**!

### Method B: Terminal Script
Run:
```bash
node scripts/seed.js
```
All collections (`profile`, `projects`, `education`, `skills`) will populate in Firestore instantly!
