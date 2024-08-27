// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "shopito-12be3.firebaseapp.com",
  projectId: "shopito-12be3",
  storageBucket: "shopito-12be3.appspot.com",
  messagingSenderId: "594078663230",
  appId: "1:594078663230:web:156addd70a0d4127c5076f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);