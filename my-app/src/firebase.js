// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3QdQ-adptppjL4F_3z11Oq3D3guHlPqU",
  authDomain: "skill-swap-362b3.firebaseapp.com",
  projectId: "skill-swap-362b3",
  storageBucket: "skill-swap-362b3.firebasestorage.app",
  messagingSenderId: "791003642718",
  appId: "1:791003642718:web:592f750b66150fd4e86dcf",
  measurementId: "G-XZVRR0EV22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);