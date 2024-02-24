// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { passwordSnowOrHideEyeConcept } from "../js/function.js";

//Import Database from firebase
//CloudStore Database
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

//Realtime Database
// import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyA2X8Rj6uhJ4qh07AGGhacAB1_oOeHDM3Y",
    authDomain: "chordify3000.firebaseapp.com",
    databaseURL: "https://chordify3000-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chordify3000",
    storageBucket: "chordify3000.appspot.com",
    messagingSenderId: "350562637799",
    appId: "1:350562637799:web:9a979f0c38a051645b4f42",
    measurementId: "G-MD7C68NBYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
const database = getDatabase();
export const auth = getAuth(app);


const dbref = ref(database);
export const storage = getStorage();
export const provider = new GoogleAuthProvider(app);

let eyes = document.querySelectorAll('.inputEyeContainer');

eyes.forEach(element => {
    element.addEventListener('click', () => {
        let temp = element.id;
        passwordSnowOrHideEyeConcept(temp, temp.slice(0, -3), element.children[0]);
    })
});