// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvIUEK87tOOqS2bpBuV08jrjJs00-lHpI",
  authDomain: "salimtech4infotel9ja.firebaseapp.com",
  projectId: "salimtech4infotel9ja",
  storageBucket: "salimtech4infotel9ja.firebasestorage.app",
  messagingSenderId: "323939415572",
  appId: "1:323939415572:web:0bb139f94b0789f5091901",
  measurementId: "G-0BK8HJ26XD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);