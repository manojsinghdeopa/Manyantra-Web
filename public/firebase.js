// firebase.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInAnonymously, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, collection, deleteDoc, updateDoc, doc, getDoc, getDocs, query, where, setDoc, Timestamp, startAfter, limit, increment, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

const firebaseConfig = {
    apiKey: "AIzaSyA2Pu9Z0f0WZr1hXp02mBD10NQwHCRt7uc",
    authDomain: "auth.blackblock",
    projectId: "blackblock-14d67",
    storageBucket: "blackblock-14d67.appspot.com",
    messagingSenderId: "813852879803",
    appId: "1:813852879803:web:4f2cb5e773d6cee43cb29e",
    measurementId: "G-FYX9VLC0FW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// setLogLevel('debug');

export { auth, analytics, db, signInAnonymously, GoogleAuthProvider, signInWithPopup, signOut, logEvent, collection, deleteDoc, updateDoc, doc, getDoc, getDocs, query, where, setDoc, Timestamp, startAfter, limit, increment, orderBy };
