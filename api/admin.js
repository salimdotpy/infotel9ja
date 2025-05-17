// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFTGwfMyNKsU5Q_9XLZjMaeDNTOp-p8ns",
  authDomain: "salimtech-d4171.firebaseapp.com",
  projectId: "salimtech-d4171",
  storageBucket: "salimtech-d4171.firebasestorage.app",
  messagingSenderId: "1007953204162",
  appId: "1:1007953204162:web:ba283d062a210f0132bc5b",
  measurementId: "G-BREFY0C2E0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);