
import { signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import { errorIntoTextToShowTheUser, displayLoginPage } from "../js/function.js";
import { auth } from "./firebaseInit.js";

let logoutBtn = document.querySelector('#logoutAccountSetting > div > div');

let logoutTheUser = (event) => {
    signOut(auth)
        .then(() => {
            errorIntoTextToShowTheUser("Sign-out successful.");
            displayLoginPage;
        })
        .catch((error) => {
            errorIntoTextToShowTheUser("Try Again Leter");
        });
} 


logoutBtn.addEventListener('click', logoutTheUser);