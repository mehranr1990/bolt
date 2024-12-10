// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn6EfIKvtUnWA76zbyKJphDnSO9GyqliE",
  authDomain: "aria-market-f4725.firebaseapp.com",
  projectId: "aria-market-f4725",
  storageBucket: "aria-market-f4725.firebasestorage.app",
  messagingSenderId: "1044832113714",
  appId: "1:1044832113714:web:2151ea64456e062466582b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// نمونه‌هایی برای استفاده
const db = getFirestore(app);  // Firestore
const auth = getAuth(app);     // Authentication

export { app, db, auth };