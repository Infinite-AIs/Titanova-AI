// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnlY5nZ0jhEf0wnIgwvEqAJFbPFmrIHYI",
  authDomain: "titanovaai-73e1d.firebaseapp.com",
  projectId: "titanovaai-73e1d",
  storageBucket: "titanovaai-73e1d.firebasestorage.app",
  messagingSenderId: "827299150256",
  appId: "1:827299150256:web:6dd6e164bab10c03903e75"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
