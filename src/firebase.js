import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyALuI_HwzrvSA8Lr4ek1nWFBTaX_6uknvc",
    authDomain: "e-tap-68eac.firebaseapp.com",
    projectId: "e-tap-68eac",
    storageBucket: "e-tap-68eac.firebasestorage.app",
    messagingSenderId: "1024532287155",
    appId: "1:1024532287155:web:ff0a52d1ceef156fe5aac6",
    measurementId: "G-6DCCHR42ZF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);