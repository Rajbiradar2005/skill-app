// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"; // Import Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3QdQ-adptppjL4F_3z11Oq3D3guHlPqU",
  authDomain: "skill-swap-362b3.firebaseapp.com",
  projectId: "skill-swap-362b3",
  storageBucket: "skill-swap-362b3.appspot.com",
  messagingSenderId: "791003642718",
  appId: "1:791003642718:web:592f750b66150fd4e86dcf",
  measurementId: "G-XZVRR0EV22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, db, setDoc, getDoc, doc }; // Export Auth and Firestore instances