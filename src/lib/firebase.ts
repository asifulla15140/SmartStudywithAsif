// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgTR6wEnuWu6r5Hx9532237K2InUQ3xBk",
    authDomain: "mamsadmission-7ea13.firebaseapp.com",
    databaseURL: "https://mamsadmission-7ea13-default-rtdb.firebaseio.com",
    projectId: "mamsadmission-7ea13",
    storageBucket: "mamsadmission-7ea13.firebasestorage.app",
    messagingSenderId: "493513780077",
    appId: "1:493513780077:web:5f460bdf376975f5678864",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
