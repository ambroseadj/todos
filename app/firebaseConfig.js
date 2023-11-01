// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';




const firebaseConfig = {
  apiKey: "AIzaSyBHYsjcgq_qT_tKi46RpOuudnsUAqGsYv8",
  authDomain: "tdos-6d06c.firebaseapp.com",
  projectId: "tdos-6d06c",
  storageBucket: "tdos-6d06c.appspot.com",
  messagingSenderId: "139502278158",
  appId: "1:139502278158:web:96c8a3934c3d99a45e0e5f",
  measurementId: "G-0BXSWEPEPR"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db= getFirestore(app);

export { db};