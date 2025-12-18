# 🚀 VERCEL DEPLOYMENT GUIDE

## 📋 PHASE 3: DEPLOY TO PRODUCTION

---

## STEP 1: Install Vercel CLI

```bash
npm i -g vercel
```

---

## STEP 2: Deploy Backend

### A. Navigate to backend folder

```bash
cd "C:\Users\chuda\OneDrive\Desktop\LoopieLove\backend"
```

### B. Login to Vercel

```bash
vercel login
```

### C. Deploy

```bash
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name: **loppi-love-backend**
- Directory: **./** (press Enter)
- Override settings? **N**

### D. Add Environment Variables

After deploy, go to Vercel Dashboard:
1. Select your backend project
2. Settings → Environment Variables
3. Add these:

**FIREBASE_PROJECT_ID**
```
loopie-love-af1f3
```

**FIREBASE_CLIENT_EMAIL**
```
firebase-adminsdk-fbsvc@loopie-love-af1f3.iam.gserviceaccount.com
```

**FIREBASE_PRIVATE_KEY**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdhv1HlrToS6ep
2ypApXXvIlyDgGo8Bu30hI8w5IiFr23XhxZajwlynqR4DKyKIz+raMC6YiQS8NiN
492nyRwuS8gKmISJ2ktgfCgq7Kvw1BnAYgmlbCwODhDHDY/Ri+dAPAN50H50hEg4
Pbn6imdl6bLUgXFvvaRphRiFUuSv87ItajNALIcNPL03NusUvMjqS1oKnJDnhhDT
IdBlE8CP3KqugRJ2lXc/A1cZwkI/UEEUVHATAyYt+h0ASCZI7AHVmLuLRk2o0aFd
29S3TOFV/hiXHrKMy+OrUnb8L8VGLCXKSux2xL89aES4mvTrwWx2FBN8UKbiEJyC
w2gh78rhAgMBAAECggEACp3reiS1IqbesPr9eQftz+Uv+QjxoAQTi5RXlkMA1InD
THBlWEslptz8Vr777f98LhBMVQOCTOiAn+eIq+NJC/G9lME8xZG53NHhXys+V2fk
KGwzHDwTKAtYpCHM3KGiP1kMHuynaTD1MR0v6KvlViAPFnV28MIGT7pRscKpeRZH
i2p2lmvSevpMAFoWpv47s5ZZ46J4rXoUJh3/3qyBBbsROlx1QmG9SbsJeBUOGWbl
EW4dN5L+Dqhva3dT/o0zZL/EjhC3NIwOxWH0zpCnPpc1UXhKL7PNHCwpKFjWjiuZ
xXT0WP0nXOYoT7BRlXUh9Vws0pQ9aTCtYtJuCG8gsQKBgQDNgWqenlNMTHrLDVUA
tSUTEYYUw+QPguHedmgJrqXz04AN4po4JLtF2AZdnO/ocQ6C/Hq/p88SJvH971Je
Slf/FjCojLYRvcZNQmYMoLGLAFCpnPueagkzG9lSSd5z2A50bv0ltvNViNgL5e7B
pZ6D82zOt/yYVtdjG0p9ZfbPhQKBgQDEO6zutJpoqs3xxzuiU7fHXEYkLuEO0Dmx
GtGn1wmbsJdTg0x5mOikxOtJLDrWntj8Q1281v4y4Z7OrzMhxzeSMkUMzXUYFb51
O9D/D2SxqYQsOm9fBJCu0r8jKQQCBv/2upo78YRO+9JIIfsB2U7Q826Eaz5SvEA0
KLbwtjm2rQKBgBZcXZiSy6eCrt3HPpeMHlOb1YYO5pLVf/Qv2BQtn7sPKWDZZkRz
orjvz4mCGQymuJiCFm0iOkLUYAJsdv7xge+sn3DHlswJZTlk3yvClG72gtBh13Me
QJACGLx+cykRukjrBrqC1Kla8X8h7r+9YKkk5JL9rAt7b4ZGIu3QGXHtAoGBAIKS
ksdjNTtgLBktUOj6e9cT9zgsWWTZ+Ql3pvnfhG0sXAUd4M0oieTZgxX1cFFO8WMq
ED2PcSW6K0msGoHnZXrKKFgUfk3AajLn0nFldMMi4OftGh5Hk15ArR5gNGKE9dze
3bH1Suyjc5C7y6G3T1KKKIfENHwo9y+9x7z0BAMhAoGAeJ9J+yDuMyqSBs1KZe4c
Z3shNIwLei9kBepq2Bn7Bnf7sRvWrdLLbdBFap/RjBd3ZXbDZ7jJMj14oFm2WugT
DrYt0Zcl40fYm9ZjJ3ya543xTOZUjnIQcYG295TcsjAc8QRdaR/AOsEd//JV2wmF
IiNQTpu3NIvSqcl2UQBrlUY=
-----END PRIVATE KEY-----
```
⚠️ Paste the entire key including BEGIN/END lines

### E. Redeploy with environment variables

```bash
vercel --prod
```

### F. Save your backend URL

Copy the production URL (something like `https://loppi-love-backend.vercel.app`)

---

## STEP 3: Update Frontend API URL

Open `script.js` and update the API URL:

```javascript
const API_URL = 'https://YOUR-BACKEND-URL.vercel.app';
```

Replace `YOUR-BACKEND-URL` with your actual Vercel backend URL.

Also update the endpoint from `/test-store` to `/api/waitlist`:

```javascript
const response = await fetch(`${API_URL}/api/waitlist`, {
```

---

## STEP 4: Deploy Frontend

### A. Navigate to frontend folder

```bash
cd "C:\Users\chuda\OneDrive\Desktop\LoopieLove"
```

### B. Deploy

```bash
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name: **loppi-love**
- Directory: **./** (press Enter)
- Override settings? **N**

### C. Deploy to production

```bash
vercel --prod
```

---

## STEP 5: Test Production

1. Open your frontend URL (e.g., `https://loppi-love.vercel.app`)
2. Enter a test email
3. Click "Join the Circle"
4. Check Firebase Console → Firestore → waitlist_users
5. Verify email is stored ✅

---

## 🎉 YOU'RE LIVE!

Your waitlist is now:
- ✅ Deployed on Vercel
- ✅ Storing emails in Firebase
- ✅ Production ready

---

## 📊 Export Emails Later

When ready to import to Brevo:

1. Firebase Console → Firestore → waitlist_users
2. Export to JSON
3. Convert to CSV
4. Import to Brevo manually

---

## 🔒 Security Checklist

- [ ] Environment variables added to Vercel
- [ ] CORS restricted to your domain (optional)
- [ ] Firebase rules properly configured
- [ ] No secrets in frontend code

---

## 🚀 NEXT STEPS (OPTIONAL)

After launch:
- Add rate limiting
- Add honeypot anti-bot field
- Set up Firebase export automation
- Configure custom domain

**But for now? You're done. Ship it! 🎉**
