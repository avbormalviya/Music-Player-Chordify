import { updatePassword, deleteUser, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { doc, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

import { auth, db } from "../fireBase/firebaseInit.js";

import { avatarObserver, changeAvatarObserverVar, changeTheme, showAlertDiv, dataBaseFetchData, displayLoginPage } from "./function.js";

let settingXbtn = document.querySelector('#settingHeading > i');

let settingBtn = document.querySelector('#settingBtn');

let myAccountSettingBtn = document.querySelector('#myAccountSetting > :first-child > div');
let avatarSettingBtn = document.querySelector('#avatarSetting > :first-child > div');
let resetPasswordSettingBtn = document.querySelector('#resetPasswordSetting  > :first-child > div');
let deleteAccountSettingBtn = document.querySelector('#deleteAccountSetting > :first-child > div');

function resetAllActive(text) {
    if (text != "fromAvatar") {
        gsap.to('#settingSection', {
            duration: 0.5,
            x: "-24vw",
            borderRadius: "2vw",
        })
        
        gsap.to('#settingSection > hr', {
            duration: 1,
            borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 95%, rgba(255,255,255,0) 100%) 1",
        })
        
        gsap.to('#settingSection > :nth-child(3)', {
            duration: 1,
            borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(151, 189, 196) 5%, rgb(151, 189, 196) 95%, rgba(255,255,255,0) 100%) 1",
        })
    
        gsap.to('#avatarMainSection', {
            duration: 0.5,
            x: 0,
            borderRadius: "2vw",
            backgroundColor: "rgb(18 28 39)"
        })
    }

    gsap.to('#myAccountSetting', {
        duration: 0.3,
        height: "10%",
    })

    gsap.to('.settingInnerDiv', {
        duration: 0.3,
        background: "rgb(18 28 39)",
    })
    
    gsap.to('#settingSection > hr', {
        duration: 0.5,
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 95%, rgba(255,255,255,0) 100%) 1",
    })
    
    gsap.to('#settingSection > :nth-child(3)', {
        duration: 0.5,
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(151, 189, 196) 5%, rgb(151, 189, 196) 95%, rgba(255,255,255,0) 100%) 1",
    })

    gsap.to('#avatarMainSection', {
        duration: 0.5,
        backgroundColor: "rgb(18 28 39)"
    })

    gsap.to('#resetPasswordSetting', {
        duration: 0.3,
        height: "10%",
    })

    gsap.to('#deleteAccountSetting', {
        duration: 0.3,
        height: "10%",
    })

    // gsap.to('#deleteAccountSettingInnerFoldDiv', {
    //     duration: 0.3,
    //     background: "rgb(13 22 33)"
    // })
}

settingBtn.addEventListener('click', () => {
    if (avatarObserver == 1) {
        gsap.to('#settingSection', {
            duration: 0.5,
            x: "-47.9vw",
            borderRadius: "2vw 0 0 2vw",
        })
    
        gsap.to('.settingInnerDiv', {
            duration: 1,
            background: "linear-gradient(90deg, rgb(18 28 39) 80%, rgba(255, 255, 255, 0) 100%)",
        })
    
        gsap.to('#avatarSetting', {
            duration: 1,
            background: "rgb(13 22 33)"
        })
        
        gsap.to('#settingSection > hr', {
            duration: 1,
            borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 70%, rgba(255,255,255,0) 100%) 1",
        })
        
        gsap.to('#settingSection > :nth-child(3)', {
            duration: 1,
            borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(151, 189, 196) 5%, rgb(151, 189, 196) 80%, rgba(255,255,255,0) 100%) 1",
        })
    
        gsap.to('#avatarMainSection', {
            duration: 0.5,
            x: "-24vw",
            borderRadius: "0 2vw 2vw 0",
            backgroundColor: "rgb(13 22 33)"
        })
    } else if (avatarObserver == 0) {
        gsap.to('#settingSection', {
            duration: 0.5,
            x: "-24vw",
            borderRadius: "2vw 0 0 2vw",
        })
    }
})

avatarSettingBtn.addEventListener('click', () => {
    resetAllActive("fromAvatar");

    gsap.to('#settingSection', {
        duration: 0.5,
        x: "-47.9vw",
        borderRadius: "2vw 0 0 2vw",
    })

    gsap.to('.settingInnerDiv', {
        duration: 1,
        background: "linear-gradient(90deg, rgb(18 28 39) 80%, rgba(255, 255, 255, 0) 100%)",
    })

    gsap.to('#avatarSetting', {
        duration: 1,
        background: "rgb(13 22 33)"
    })
    
    gsap.to('#settingSection > hr', {
        duration: 1,
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 70%, rgba(255,255,255,0) 100%) 1",
    })
    
    gsap.to('#settingSection > :nth-child(3)', {
        duration: 1,
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(151, 189, 196) 5%, rgb(151, 189, 196) 80%, rgba(255,255,255,0) 100%) 1",
    })

    gsap.to('#avatarMainSection', {
        duration: 0.5,
        x: "-24vw",
        borderRadius: "0 2vw 2vw 0",
        backgroundColor: "rgb(13 22 33)"
    })
})

settingXbtn.addEventListener('click', () => {
    resetAllActive();

    gsap.to('#settingSection', {
        duration: 0.5,
        x: 0,
        borderRadius: "2vw",
    })

    gsap.to('.settingInnerDiv', {
        duration: 1,
        background: "rgb(18 28 39)",
    })
    
    gsap.to('#settingSection > hr', {
        duration: 1,
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 95%, rgba(255,255,255,0) 100%) 1",
    })
    
    gsap.to('#settingSection > :nth-child(3)', {
        duration: 1,
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(151, 189, 196) 5%, rgb(151, 189, 196) 95%, rgba(255,255,255,0) 100%) 1",
    })

    gsap.to('#avatarMainSection', {
        duration: 0.5,
        x: 0,
        borderRadius: "2vw",
        backgroundColor: "rgb(18 28 39)"
    })

    changeAvatarObserverVar(0);
})

myAccountSettingBtn.addEventListener('click', () => {
    resetAllActive();

    (() => {
        gsap.to('#myAccountSetting', {
            duration: 0.3,
            height: "auto",
            background: "rgb(13 22 33)",
        })
        
        gsap.to('#myAccountSettingInnerFoldDiv', {
            duration: 0.3,
            background: "rgb(13 22 33)",
            borderTop: "0.1vw solid",
            borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 95%, rgba(255,255,255,0) 100%) 1"
        })
    })();
})

resetPasswordSettingBtn.addEventListener('click', () => {
    resetAllActive();

    gsap.to('#resetPasswordSetting', {
        duration: 0.3,
        height: "auto",
        background: "rgb(13 22 33)"
    })

    gsap.to('#resetPasswordSettingInnerFoldDiv', {
        duration: 0.3,
        background: "rgb(13 22 33)",
        borderTop: "0.1vw solid",
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 95%, rgba(255,255,255,0) 100%) 1"
    })
})

let oldPassword = document.querySelector("#resetPasswordOldPassword");
let newPassword = document.querySelector("#resetPasswordNewPassword");
let confirmPassword = document.querySelector("#resetPasswordConfirmPassword");

document.querySelector("#resetPasswordChangeBtn").addEventListener('click', () => {
    if (dataBaseFetchData.userPassword == oldPassword.value) {
        if (newPassword.value.length >= 6 && confirmPassword.value.length >= 6) {
            if (newPassword.value == confirmPassword.value) {
                const user = auth.currentUser;
                
                updatePassword(user, confirmPassword.value)
                    .then(() => {
                        showAlertDiv("Password Updated");

                        (async () => {
                            const washingtonRef = doc(db, "userData", user.uid);
            
                            await updateDoc(washingtonRef, {
                                userPassword: confirmPassword.value
                            });
                        })();

                        oldPassword.value = "";
                        newPassword.value = "";
                        confirmPassword.value = "";

                        resetAllActive();

                    }).catch((error) => {
                        showAlertDiv("Try Again Later");
                        console.log(error, error.code);
                    });

            } else {
                showAlertDiv("Re'check New Password");
            }
        } else {
            showAlertDiv("Week Password");
        }
    } else {
        showAlertDiv("Incorrect Password");
    }
})
























$('.tdnn').click(changeTheme);


deleteAccountSettingBtn.addEventListener('click', () => {
    resetAllActive();

    gsap.to('#deleteAccountSetting', {
        duration: 0.3,
        height: "auto",
        background: "rgb(13 22 33)"
    })

    gsap.to('#deleteAccountSettingInnerFoldDiv', {
        duration: 0.3,
        background: "rgb(13 22 33)",
        borderTop: "0.1vw solid",
        borderImage: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(25, 43, 52) 5%, rgb(25, 43, 52) 95%, rgba(255,255,255,0) 100%) 1"
    })
})


document.querySelector('#deleteAccountSettingInnerFoldDiv > div > :first-child').addEventListener('click', () => {
    // const user = auth.currentUser;

    // reauthenticateWithCredential(user, user.email, dataBaseFetchData.userPassword).then(() => {
    //     deleteUser(user).then(() => {
            displayLoginPage();
    //         // async () => {
    //         //     await deleteDoc(doc(db, "cities", "DC"));
    //         // }
    //     }).catch((error) => {
    //         // An error ocurred
    //         showAlertDiv("Try Again Later");
    //         alert(error)
    //     });

    // }).catch((error) => {
    //     alert(error);
    //     console.log(error);
    // });

})















