# WP Custom Homes — Project Command Center

Protected project management dashboard for WP Custom Homes LLC, deployed on GitHub Pages with Firebase Authentication.

---

## Setup (one-time, ~10 minutes)

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**
2. Name it (e.g. `wp-custom-homes`) — disable Google Analytics if you don't need it
3. Once created, click **Build → Authentication → Get Started**
4. Under **Sign-in method**, enable **Email/Password** and save

### 2. Get your Firebase config

1. In the Firebase console, click the ⚙️ gear → **Project settings**
2. Scroll to **Your apps** → click the `</>` (Web) icon → register an app
3. Copy the `firebaseConfig` object shown

### 3. Paste config into the repo

Open `js/firebase-config.js` and replace every `YOUR_*` placeholder:

```js
const firebaseConfig = {
  apiKey:            'AIzaSy...',
  authDomain:        'wp-custom-homes.firebaseapp.com',
  projectId:         'wp-custom-homes',
  storageBucket:     'wp-custom-homes.appspot.com',
  messagingSenderId: '123456789',
  appId:             '1:123456789:web:abc123',
};
```

### 4. Add your first user

In Firebase console → **Authentication → Users → Add user**  
Enter the email + password for each person who needs access.

### 5. Push to GitHub

```bash
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 6. Enable GitHub Pages

1. Go to your repo → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. The first deploy triggers automatically — your site will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## Adding / removing users

All user management is done in the **Firebase console → Authentication → Users**.  
No code changes needed — add, remove, or reset passwords from there.

---

## Project structure

```
├── index.html              # Login page (public entry point)
├── dashboard.html          # Protected dashboard
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── firebase-config.js  # ← paste your Firebase config here
│   ├── auth.js             # Login form logic
│   ├── auth-guard.js       # Redirects unauthenticated users
│   ├── app.js              # Dashboard UI & interactions
│   └── data.js             # Seed data (projects, tasks, invoices…)
└── .github/
    └── workflows/
        └── deploy.yml      # Auto-deploy on push to main
```

---

## Security notes

- Authentication is handled server-side by Firebase — credentials are never stored in the repo
- The dashboard page is invisible until Firebase confirms a valid session
- Unauthenticated direct visits to `dashboard.html` redirect instantly to `index.html`
- To restrict the Firebase project to your domain only: Firebase console → **Authentication → Settings → Authorized domains** → add your GitHub Pages URL
