
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


import { auth, db } from "./firebaseInit.js";
import { changeDataBaseFetchDataVar, displayLoginPage, startLoadingForSetAllData, onWebPageStart, showAlertDiv } from "../js/function.js";

export let userLogin;

onAuthStateChanged(auth, (user) => {
    if (user) {
        (async () => {
            let user = auth.currentUser;
            await setDoc(doc(db, "userData", user.uid), {

            }, { merge: true });
        })();

        let interval = setInterval(() => {
            
            if (user.emailVerified) {

                let interval2 = setInterval(async () => {
                    let user = auth.currentUser;
                    const docRef = doc(db, "userData", user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        changeDataBaseFetchDataVar(docSnap.data());

                        if (docSnap.data().userLogin) {
                            clearInterval(interval2);
                            onWebPageStart();
                            startLoadingForSetAllData();
                        } else {
                            clearInterval(interval2);
                            displayLoginPage();
                        }
                    } else {
                        // docSnap.data() will be undefined in this case
                        clearInterval(interval2);
                        displayLoginPage();
                        console.log("No such document!");
                    }
                }, 1000);

                clearInterval(interval);

                showAlertDiv("You are Verified", "green")

                gsap.to(".subContainer2", {
                    duration: 0.2,
                    rotateY: 90,
                    display: "none",
                })
                
                gsap.to('.subContainer', {
                    display: "",
                    delay: 0.2,
                    duration: 0.3,
                    rotateY: 0,
                })

                gsap.to("#loginButton > svg", {
                    duration: 0.5,
                    display: "none",
                    opacity: 1,
                })
            } else {
                auth.currentUser.reload();
            }
        }, 1000);
    } else {
        // User is signed out
        displayLoginPage();
    }
});
