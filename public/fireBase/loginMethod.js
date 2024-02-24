
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

import { auth, db } from "./firebaseInit.js";
import { showAlertDiv, errorIntoTextToShowTheUser, startLoadingForSetAllData, saveNewLoginUserData, onWebPageStart } from "../js/function.js";

let loginEmail = document.getElementById('email');
let loginPassword = document.getElementById('password'); 
let loginBtn = document.getElementById('buttonanimation1');

let forgetBtn = document.getElementById('forgetPasswordBtn');

let loginUser = (event) => {
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((userCredential) => {
            (async () => {
                let user = auth.currentUser;
                
                await setDoc(doc(db, "userData", user.uid), {
                    userPassword: loginPassword.value,
                }, { merge: true });
                
                await setDoc(doc(db, "userData", user.uid), {
                    userLogin: true,
                }, { merge: true });

                saveNewLoginUserData(user);
            })();

            if (auth.currentUser.emailVerified) {
                onWebPageStart();
                startLoadingForSetAllData();
            }

        })
        .catch((error) => {
            errorIntoTextToShowTheUser(error.code);
        })
}

let forgetPassword = () => {
    sendPasswordResetEmail(auth, loginEmail.value)
        .then(() => {
            showAlertDiv("Mail Sent on your Email");
        })
        .catch((error) => {
            console.log(error.code);
        });
}

loginBtn.addEventListener('click', loginUser);
forgetBtn.addEventListener('click', forgetPassword);
