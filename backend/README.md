# 🔥 FIREBASE TEST - LOCAL SETUP

## ⚠️ BEFORE RUNNING - UPDATE .env FILE

**You MUST add your Firebase credentials first!**

### 📋 Steps to get Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file

### 🔑 Update backend/.env

Open `backend/.env` and replace with values from the JSON file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQI...(your full key)...=\n-----END PRIVATE KEY-----\n"
```

⚠️ **IMPORTANT:**
- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Copy the ENTIRE private_key value from the JSON file
- Include the BEGIN and END lines

---

## 🚀 RUN THE SERVER

Once `.env` is updated:

```bash
cd backend
npm start
```

You should see:
```
Server running on http://localhost:4000
```

---

## 🧪 TEST THE ENDPOINT

### Option 1: Using PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/test-store" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@loppilove.com"}'
```

### Option 2: Using curl (if installed)

```bash
curl -X POST http://localhost:4000/test-store \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@loppilove.com\"}"
```

### Option 3: Create a test HTML file

Create `test.html` in the root folder and open it in browser.

---

## ✅ VERIFY IN FIREBASE

1. Go to Firebase Console
2. Navigate to **Firestore Database**
3. Look for collection: `waitlist_users`
4. You should see your test email with a timestamp

---

## 🛑 IF YOU GET ERRORS

**Permission denied:**
- Go to Firestore → Rules
- Set to test mode temporarily:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Authentication error:**
- Double-check `.env` file formatting
- Make sure private key has quotes
- Verify all values are from the same JSON file

**Module error:**
- Make sure `package.json` has `"type": "module"`

---

## 📝 READY TO TEST?

Reply with:
- ✅ "Email stored successfully" (if it works)
- ❌ Error message (if it fails)
