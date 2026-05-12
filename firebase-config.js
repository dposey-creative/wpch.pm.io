// ─────────────────────────────────────────────
//  Firebase configuration
//  Replace every value below with your own from:
//  Firebase Console → Project Settings → Your Apps
// ─────────────────────────────────────────────
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth }        from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey:            'AIzaSyACOuanogp0XDv5_BytbDoC3DKrqkLsl-s',
  authDomain:        'wpch-pm-dashboard.firebaseapp.com',
  projectId:         'wpch-pm-dashboard',
  storageBucket:     'wpch-pm-dashboard.firebasestorage.app',
  messagingSenderId: '819350750156',
  appId:             '1:819350750156:web:b7ce06c721991289289369',
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
