import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "ใส่_API_KEY_ของคุณ",
  authDomain: "ใส่_AUTH_DOMAIN_ของคุณ",
  projectId: "ใส่_PROJECT_ID_ของคุณ",
  storageBucket: "ใส่_STORAGE_BUCKET_ของคุณ",
  messagingSenderId: "ใส่_MESSAGING_SENDER_ID_ของคุณ",
  appId: "ใส่_APP_ID_ของคุณ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
