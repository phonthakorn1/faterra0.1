import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxPEQ9KSgUKiqVh7w0wjfUdQex-Yf_iiE",
  authDomain: "faterra-1f237.firebaseapp.com",
  projectId: "faterra-1f237",
  storageBucket: "faterra-1f237.firebasestorage.app",
  messagingSenderId: "882360275877",
  appId: "1:882360275877:web:880e2ba7954f0bafcfce4c",
  measurementId: "G-YW8BFD1E93"
};

const app = initializeApp(firebaseConfig);

//  ส่งออก db เพื่อให้ App.jsx เรียกใช้งานได้
export const db = getFirestore(app);
