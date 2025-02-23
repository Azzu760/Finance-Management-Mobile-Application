import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD88JsyUquxZCasYmC5miufQVCzrfVQBzM",
  authDomain: "click-karo-finance-management.firebaseapp.com",
  projectId: "click-karo-finance-management",
  storageBucket: "click-karo-finance-management.firebasestorage.app",
  messagingSenderId: "662401755318",
  appId: "1:662401755318:web:767f5e7c35ed167913de17",
  measurementId: "G-XQHQ3Z1LH2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
