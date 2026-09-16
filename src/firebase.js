// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxPEQ9KSgUKiqVh7w0wjfUdQex-Yf_iiE",
  authDomain: "faterra-1f237.firebaseapp.com",
  projectId: "faterra-1f237",
  storageBucket: "faterra-1f237.firebasestorage.app",
  messagingSenderId: "882360275877",
  appId: "1:882360275877:web:880e2ba7954f0bafcfce4c",
  measurementId: "G-YW8BFD1E93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
