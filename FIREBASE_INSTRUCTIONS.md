# Real World Deployment Guide

This app is configured to use your own Firebase Project (`anjan-store-f3931`). Since this is a custom project, AI Studio cannot automatically configure its security rules. 

You must deploy these Firestore rules manually using the Firebase CLI to make sure your customers can read products and place orders!

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to your Google Account
```bash
firebase login
```

### 3. Initialize Firestore (if not already done)
```bash
firebase init firestore
```
*(Select your project `anjan-store-f3931`, hit enter for default files).*

### 4. Overwrite `firestore.rules`
Copy the contents of `firestore.rules` from this AI Studio project and paste them into your local `firestore.rules` file.

### 5. Deploy
```bash
firebase deploy --only firestore
```

---

## 🚀 Setting up the Store Manager App
To manage products and orders, create a second AI Studio project for the Store Manager dashboard. 
Copy the exact text from `STORE_MANAGER_PROMPT.md` and paste it into a new AI Studio chat!
