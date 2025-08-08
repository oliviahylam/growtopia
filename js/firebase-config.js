// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgKmRbetIdTwIV2M6kwEDLFev35AiivWU",
    authDomain: "growtopia-a59e0.firebaseapp.com",
    projectId: "growtopia-a59e0",
    storageBucket: "growtopia-a59e0.firebasestorage.app",
    messagingSenderId: "86362955631",
    appId: "1:86362955631:web:8e45d9d5fe784394a2129a",
    measurementId: "G-15TY2TS3ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 