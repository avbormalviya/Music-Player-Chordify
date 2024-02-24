import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import { auth, db } from './firebaseInit.js';
import { showAlertDiv, errorIntoTextToShowTheUser } from "../js/function.js";

let signInEmail = document.getElementById('newEmail'); 
let signInCreatePassword = document.getElementById('createPassword');
let signInConfirmPassword = document.getElementById('confirmPassword');
let signInBtn = document.getElementById('loginButton'); 


let registerUser = (event) => {
    if (signInCreatePassword.value == signInConfirmPassword.value) {
        
        createUserWithEmailAndPassword(auth, signInEmail.value, signInConfirmPassword.value)
            .then((userCredential) => {

                gsap.to("#loginButton > svg", {
                    duration: 0.5,
                    display: "block",
                    opacity: 1,
                })

                showAlertDiv("Sending Verification Email")
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        showAlertDiv("Verification Email Sended");

                        setTimeout(() => {
                            showAlertDiv("Waiting for Verification");
                        }, 3000);
                    });
            })
            .catch((error) => {
                errorIntoTextToShowTheUser(error.code);
                console.log(error.code);
            })
        }
        else {
            errorIntoTextToShowTheUser("recheckPassword")
            console.log(error);
    }
}

signInBtn.addEventListener('click', registerUser);