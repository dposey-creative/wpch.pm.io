// Auth guard — include on every protected page.
// Shows a loading screen until Firebase confirms auth state,
// then either reveals the page or redirects to login.
import { auth } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const loader = document.getElementById('auth-loader');
const app    = document.getElementById('app');

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace('index.html');
    return;
  }

  // Populate user chip in sidebar
  const nameEl = document.getElementById('sb-user-name');
  const roleEl = document.getElementById('sb-user-role');
  if (nameEl) nameEl.textContent = user.displayName || user.email.split('@')[0];
  if (roleEl) roleEl.textContent = user.email;

  // Reveal the app, hide loader
  if (app)    app.style.visibility = 'visible';
  if (loader) {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 350);
  }
});

// Sign-out handler — attached to button in sidebar footer
window.handleSignOut = async function () {
  try {
    await signOut(auth);
    window.location.replace('index.html');
  } catch {
    // ignore
  }
};
