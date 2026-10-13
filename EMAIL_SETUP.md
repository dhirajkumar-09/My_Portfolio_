# 📧 Email Notification Setup Guide

When a visitor submits the contact form on your portfolio:
1. The message is automatically saved into the Firestore `messages` collection.
2. An instant email notification is delivered directly to your inbox: **`dhirajku00021@gmail.com`**.

Below are the two recommended methods to enable email delivery:

---

## Method 1: EmailJS (Free & Recommended - 5 Minute Setup)

EmailJS delivers emails directly from the browser without needing a backend server or payment.

### Step 1: Create an EmailJS Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/) and create a free account.

### Step 2: Add Email Service
1. In the EmailJS dashboard, click **Email Services** > **Add New Service**.
2. Select **Gmail**.
3. Connect your account: **`dhirajku00021@gmail.com`**.
4. Click **Create Service** and note your `Service ID` (e.g., `service_portfolio`).

### Step 3: Create Email Template
1. Go to **Email Templates** > **Create New Template**.
2. Configure the template:
   - **Subject**: `New Portfolio Inquiry from {{from_name}} - {{subject}}`
   - **Content**:
     ```text
     Hello Dhiraj,

     You received a new message from your portfolio contact form:

     • Sender Name: {{from_name}}
     • Sender Email: {{from_email}}
     • Subject: {{subject}}
     • Timestamp: {{timestamp}}

     Message Content:
     {{message}}

     ---
     You can reply directly to this email to reach {{from_name}} at {{reply_to}}.
     ```
   - **To Email**: `dhirajku00021@gmail.com`
   - **Reply To**: `{{reply_to}}`
3. Click **Save** and note your `Template ID` (e.g., `template_contact`).

### Step 4: Get Your Public Key
1. In the sidebar, go to **Account** > **API Keys**.
2. Copy your **Public Key** (User ID).

### Step 5: Add to `.env`
Add the three values into your `.env` file:
```env
VITE_EMAILJS_SERVICE_ID=service_portfolio
VITE_EMAILJS_TEMPLATE_ID=template_contact
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```
Now, whenever someone sends a message, you receive an immediate notification in your inbox!

---

## Method 2: Firebase Extension "Trigger Email"

If you prefer keeping everything inside Google Cloud/Firebase:

1. In the Firebase Console, go to **Extensions** > **Explore Extensions**.
2. Search for **Trigger Email from Firestore** (by Firebase).
3. Click **Install in project**.
4. Configure the extension:
   - **Email collection**: `messages`
   - **Default FROM address**: `noreply@yourdomain.com` or your SMTP address
   - **Default REPLY-TO address**: `{{email}}`
   - **SMTP connection URI**: Enter your SMTP provider credentials (e.g., SendGrid, Mailgun, Brevo, or Resend: `smtps://apiKey@smtp.resend.com:465`).
5. Complete installation.
6. The extension will listen to newly created documents in `messages` and send emails automatically.
