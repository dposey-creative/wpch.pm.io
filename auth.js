// Login page logic
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const form    = document.getElementById('login-form');
const emailEl = document.getElementById('login-email');
const passEl  = document.getElementById('login-pass');
const errEl   = document.getElementById('login-err');
const btnEl   = document.getElementById('login-btn');
const resetEl = document.getElementById('forgot-link');

// Already signed in → skip login
onAuthStateChanged(auth, user => {
  if (user) window.location.replace('dashboard.html');
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const email    = emailEl.value.trim();
  const password = passEl.value;

  if (!email || !password) {
    showErr('Please enter your email and password.');
    return;
  }

  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged above will redirect
  } catch (err) {
    setLoading(false);
    showErr(friendlyError(err.code));
  }
});

resetEl.addEventListener('click', async e => {
  e.preventDefault();
  const email = emailEl.value.trim();
  if (!email) {
    showErr('Enter your email address above, then click "Forgot password".');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showErr('Password reset email sent — check your inbox.', true);
  } catch (err) {
    showErr(friendlyError(err.code));
  }
});

function showErr(msg, success = false) {
  errEl.textContent = msg;
  errEl.className   = 'login-err show' + (success ? ' success' : '');
}

function setLoading(on) {
  btnEl.disabled    = on;
  btnEl.textContent = on ? 'Signing in…' : 'Sign In';
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found':        'No account found with that email.',
    'auth/wrong-password':        'Incorrect password. Try again.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/too-many-requests':     'Too many attempts. Please wait and try again.',
    'auth/invalid-credential':    'Invalid email or password.',
    'auth/network-request-failed':'Network error. Check your connection.',
  };
  return map[code] || 'Sign-in failed. Please try again.';
}
