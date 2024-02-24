
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import { startLoadingForSetAllData, saveNewLoginUserData } from "../js/function.js";
import { db, auth,  provider } from "./firebaseInit.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

let loginWithGoogle = document.querySelector('.loginWithGoogle');
let signInWithGoogle = document.getElementById('signWithGoogle');

let googleSignUp = (event) => {
    // const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            // changeProfilePic();
            // IdP data available using getAdditionalUserInfo(result)
            // onAppStart();
            startLoadingForSetAllData();
            saveNewLoginUserData(user);

            (async () => {
                let user = auth.currentUser;

                await setDoc(doc(db, "userData", user.uid), {
                    userLogin: true,
                }, { merge: true });

                saveNewLoginUserData(user);
            })();
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage)
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
        });

}

loginWithGoogle.addEventListener('click', googleSignUp);
signInWithGoogle.addEventListener('click', googleSignUp);