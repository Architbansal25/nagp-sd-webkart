// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRitHCCOptkc1Ws0W74kdB4GinNJEDaeg",
  authDomain: "webcart-ui-def89.firebaseapp.com",
  projectId: "webcart-ui-def89",
  storageBucket: "webcart-ui-def89.firebasestorage.app",
  messagingSenderId: "538268074395",
  appId: "1:538268074395:web:61bf56ca10031947e0a13e",
  measurementId: "G-BBWPV01G5K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
