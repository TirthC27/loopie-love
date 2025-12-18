# ✅ DEPLOYMENT CHECKLIST

## 🎯 CURRENT STATUS
- [x] Backend restructured for Vercel serverless
- [x] Frontend configured for local + production
- [x] Firebase credentials ready
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Production tested

---

## 📝 DEPLOYMENT STEPS

### 1. Deploy Backend First

```bash
cd "C:\Users\chuda\OneDrive\Desktop\LoopieLove\backend"
vercel login
vercel
```

After first deploy, add environment variables in Vercel Dashboard:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL  
- FIREBASE_PRIVATE_KEY

Then redeploy:
```bash
vercel --prod
```

**Save the backend URL:** `https://________.vercel.app`

---

### 2. Update Frontend with Backend URL

Open `script.js` and replace this line:

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000'
    : 'https://YOUR-BACKEND-URL.vercel.app'; // ⚠️ UPDATE THIS
```

With your actual backend URL.

---

### 3. Deploy Frontend

```bash
cd "C:\Users\chuda\OneDrive\Desktop\LoopieLove"
vercel
vercel --prod
```

---

### 4. Test Live Site

1. Visit your frontend URL
2. Enter test email
3. Submit form
4. Check Firebase Console
5. Verify email is stored ✅

---

## 🎉 DONE!

Your waitlist is live on Vercel with Firebase storage.

Brevo integration = manual CSV import later (as planned).

---

## 📞 If Issues

- Backend logs: `vercel logs` in backend folder
- Frontend logs: Browser console (F12)
- Firebase: Check Firestore rules allow writes
- CORS: Backend allows all origins currently

---

**Ready to deploy? Start with Step 1! 🚀**
