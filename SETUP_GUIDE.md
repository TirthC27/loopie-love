# Loppi Love - Waitlist System Setup Guide

## 📋 Complete Production Setup

Your waitlist system is now ready! Follow these steps to deploy:

---

## 🔥 Step 1: Firebase Setup

### Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create new one
3. Navigate to **Firestore Database**
4. Click **Create Database**
5. Choose **Start in production mode**
6. Select your region

### Create Service Account

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file securely
4. You'll need these values:
   - `project_id`
   - `client_email`
   - `private_key`

---

## 📧 Step 2: Brevo Setup

### Get API Key

1. Go to [Brevo Dashboard](https://app.brevo.com/)
2. Navigate to **Settings** → **SMTP & API**
3. Click **Create a new API key**
4. Copy and save the key

### Create Contact List

1. Go to **Contacts** → **Lists**
2. Click **Create a list**
3. Name it "Loppi Love Waitlist"
4. Note the **List ID** (you'll see it in the URL or list settings)

### Verify Automation

1. Your automation ID is: **1**
2. Verify it's active at: https://app.brevo.com/automation/edit/1
3. Ensure it triggers when contacts are added to your list

---

## ☁️ Step 3: Vercel Deployment

### Initial Setup

1. Install Vercel CLI (if not installed):
```bash
npm i -g vercel
```

2. Navigate to your project:
```bash
cd "c:\Users\chuda\OneDrive\Desktop\LoopieLove"
```

3. Install dependencies:
```bash
npm install
```

### Deploy to Vercel

1. Login to Vercel:
```bash
vercel login
```

2. Deploy the project:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: **loppi-love**
   - Directory: **./** (press Enter)
   - Override settings? **N**

4. Deploy to production:
```bash
vercel --prod
```

---

## 🔐 Step 4: Add Environment Variables

### Via Vercel Dashboard

1. Go to your project at [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add these variables:

**FIREBASE_PROJECT_ID**
```
your-firebase-project-id
```

**FIREBASE_CLIENT_EMAIL**
```
your-service-account@your-project.iam.gserviceaccount.com
```

**FIREBASE_PRIVATE_KEY**
```
-----BEGIN PRIVATE KEY-----
Your entire private key from the Firebase JSON file
Including all the newlines
-----END PRIVATE KEY-----
```
⚠️ Paste the ENTIRE key including `-----BEGIN` and `-----END` lines

**BREVO_API_KEY**
```
your-brevo-api-key-here
```

**BREVO_LIST_ID**
```
2
```
(Replace with your actual list ID number)

### Via Vercel CLI (Alternative)

```bash
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY
vercel env add BREVO_API_KEY
vercel env add BREVO_LIST_ID
```

---

## 🔄 Step 5: Redeploy with Environment Variables

After adding environment variables:

```bash
vercel --prod
```

---

## 📝 Step 6: Update Frontend API URL

1. Open `script.js`
2. Find this line (around line 306):
```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://your-vercel-app.vercel.app';
```

3. Replace `your-vercel-app` with your actual Vercel deployment URL
4. Example:
```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://loppi-love.vercel.app';
```

5. Deploy again:
```bash
vercel --prod
```

---

## ✅ Step 7: Test the System

### Test Locally (Optional)

```bash
npm run dev
```

Visit: `http://localhost:3000`

### Test in Production

1. Visit your Vercel URL
2. Enter a test email
3. Click "Join the Circle"
4. Verify:
   - Success message appears
   - Email appears in Firestore
   - Contact added to Brevo
   - Welcome email received (from Automation ID 1)

---

## 🔍 Troubleshooting

### Check Vercel Logs

```bash
vercel logs
```

Or in Vercel Dashboard:
- Go to your project
- Click **Deployments**
- Click on latest deployment
- View **Function Logs**

### Common Issues

**Firebase Error: "Invalid credentials"**
- Check FIREBASE_PRIVATE_KEY has proper newlines
- Ensure you copied the entire key including BEGIN/END markers

**Brevo Error: "Invalid API key"**
- Verify API key is correct
- Check key has proper permissions in Brevo

**CORS Error**
- Update CORS origin in `/api/waitlist.js` to your domain
- Currently set to `*` (allow all) - change in production

**Email not received**
- Verify Automation ID 1 is active
- Check Brevo contact list
- Verify list ID is correct

---

## 🔒 Security Checklist

- [ ] All environment variables added to Vercel
- [ ] `.env` file added to `.gitignore`
- [ ] CORS restricted to your domain only
- [ ] Firebase rules configured properly
- [ ] No secrets in client-side code
- [ ] API key permissions minimized in Brevo

---

## 📊 Firestore Security Rules

Add these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /waitlist_users/{document} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

This ensures only your backend can write to Firestore.

---

## 🎉 You're Done!

Your production-ready waitlist system is live with:
- ✅ Email validation
- ✅ Firebase Firestore storage
- ✅ Brevo automation integration
- ✅ Duplicate prevention
- ✅ Error handling
- ✅ Secure environment variables

**Test thoroughly before going live!**

---

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables
3. Test Firebase connection
4. Confirm Brevo automation is active

**Happy launching! 🚀**
