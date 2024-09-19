// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth, } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC4laN5AKfq1-05kYm5GvSc2PWfyjzc-Jo",
    authDomain: "prestado-17d13.firebaseapp.com",
    databaseURL: "https://prestado-17d13-default-rtdb.firebaseio.com",
    projectId: "prestado-17d13",
    storageBucket: "prestado-17d13.appspot.com",
    messagingSenderId: "307288026425",
    appId: "1:307288026425:web:891bf0f816c6a3268d4ce8",
    measurementId: "G-NE0Z5W7PSK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

export { auth, db };
