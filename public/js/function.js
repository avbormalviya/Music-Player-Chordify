
import songData from "../Data/songDataBase.json" assert { type: "json" };

import { db, auth } from "../fireBase/firebaseInit.js";
import { collection, doc, setDoc, getDocs, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { ref, uploadBytes, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
// import { updateProfile } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// import { userUid } from "../fireBase/firebaseObserver.js";

let newSongElement = new Audio(songData[0].artist[0].album[0].songs[0].songAudio);
let searchDataMainBox = document.querySelector('.searchDataWrapper');

let recentPlayedSubBox = document.querySelector('.recentPlayedSubBox');
let playSongImg = document.querySelector('.songImg > img');
let playSongNameText = document.querySelector('#songName');
// let playSongArtistText = document.querySelector('#artistName');
let BeatGif = document.querySelector('#beatGif');

let playBtn = document.querySelector('.fa-play');
let backwardBtn = document.querySelector('.fa-backward');
let forwardBtn = document.querySelector('.fa-forward');

let songDurationBox = document.querySelector('.songRangeBar');
let songDurationText = document.querySelector('#songDurationNum');
let likeBtn = document.querySelector('.likeBtn > .iconWrapper > .fa-heart');

let loadingSection = document.querySelector('.loadingSection');
let loginPage = document.querySelector('.mainContainer');
let musicPage = document.querySelector('.mainMusicContainer');
let musicDiv = document.querySelector('.subMusicContainer');

let loginFlipButton1 = document.querySelector('#linkColor1');
let loginFlipButton2 = document.querySelector('#linkColor2');
let flipContainer2 = document.querySelector('.subContainer2');

let alertBox = document.querySelector('.alertContainer');
let alertNewDiv = document.createElement('div');

let recentSearchSlideBtn = document.querySelector('.fa-angle-up');
let recentSearchesWrapper = document.querySelector('.recentSearchesWrapper');

let navIcon = document.querySelectorAll('.sideNavbar > nav > ul');

let mainMusicContainer = document.querySelector('.mainMusicContainer');
let recentPlayedBigBox = document.querySelector('.recentPlayedMainBox');
let recentPlayedSection = document.querySelector('.recentPlayedSection');

let searchInput = document.querySelector('.searchBox');

let avatarImage = document.querySelector('#avatarImage');
let bgAvatarImage = document.querySelector('#bgAvatarImage');
let logoAvatar = document.querySelector('#avatarImg');


let uploadImage = document.querySelector('#uploadImg');


let coinCountNum = document.querySelector("#coinCount > :first-child");

let X = 0, Y = 0, Z = 0;
let tempZ = -1;

let count = 0;
let recentPlayedCount = 0;

let flag = false;

let dbAvatar;
export let dbPreSong;
let dbLikedSong;
let dbRecentPlayed;

let loadingScreen;

export let myAvatar;

export let avatarObserver = 0;
export function changeAvatarObserverVar(variable) {
    avatarObserver = variable;
}

export let dataBaseFetchData;
export function changeDataBaseFetchDataVar(variable) {
    dataBaseFetchData = variable;
}




let myChord = 0;

// On Website Close or Reload store user data in firestore ( firebase )
window.addEventListener('beforeunload', function (e) {
    saveUserDataToDatabase("preSong");
    
    // e.preventDefault();
    // e.returnValue = '';
});




function reset_Before_User_Data() {
    document.getElementById('newEmail').value = ""
    document.getElementById('createPassword').value = ""
    document.getElementById('confirmPassword').value = ""
    
    document.getElementById('email').value = ""
    document.getElementById('password').value = ""

    gsap.to('#avatarMainSection', {
        x: "0vw"
    })

    gsap.to('#settingSection', {
        x: "0vw",
    })
    
    document.getElementsByClassName('recentPlayedMainBox').innerHTML = ""
    document.getElementsByClassName('myFruityWrapper').innerHTML = ""

}



// On Website start set user data
export function onWebPageStart() {
    reset_Before_User_Data()
    showThisNumberOfDisplay(0);

    let user = auth.currentUser;

    (async () => {
        const docRef = doc(db, "admin", user.email);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            document.querySelectorAll('.sideNavbar > nav > ul')[2].style.display = "";
            adminAccess();
        } else {
            document.querySelectorAll('.sideNavbar > nav > ul')[2].style.display = "none";
        }
    })();


    (async () => {
        const docRef = doc(db, "userData", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            dataBaseFetchData = docSnap.data();

            let data = docSnap.data();

            !data.darkTheme ? changeTheme() : null;
            
            if (data.coin) {
                coinCountNum.innerHTML = data.coin;
            } else {
                coinCountNum.innerHTML = 0;
            }

            if (data.previousSongData) {
                setClickedSongInformation(data.previousSongData, "don'tPlay");
            }

            if (data.likedSongs) {
                addAllLikedSongFromDataBase(data);
            }

            try {
                data.recentPlayed.reverse();
            } catch (error) {}

            data.recentPlayed != null ? data.recentPlayed.forEach(object => {
                Object.keys(object).forEach(element => {
                    // console.log(object[element]);
                    createRecentPlayedSongDiv(object[element], "atStart")
                });
            }) : recentPlayedSection.style.display = "none";
            
            if (data.avatar) {
                changeUserProfile(data.avatar, false);
            } else  {
                changeUserProfile('', false);
            }
        } else {
            // docSnap.data() /will be undefined in this case
            console.log("No such document!");
        }
    })();
}

function createRecentPlayedSongDiv(element, ifText) {
    try {
        document.querySelectorAll('.recentPlayedName').forEach(text => {
            if (text.innerHTML == element.songName) {
                flag = true;
                text.parentElement.remove();
                flag = false;
            }
        });
    } catch (error) {
        
    }
    
    if (!flag) {
        recentPlayedSection.style.display = "";
        const recentPlayedSongNewDiv = document.createElement('div');
        
        recentPlayedSongNewDiv.innerHTML = `
            <img src=${element.albumImage} alt="${element.songName}" class="recentPlayedImg">
            <div class="recentPlayedName">${element.songName}</div>
        `;
        
        // recentPlayedBigBox.appendChild(recentPlayedSongNewDiv);
        recentPlayedBigBox.prepend(recentPlayedSongNewDiv);
        recentPlayedSongNewDiv.classList.add('recentPlayedSubBox');
        document.querySelector('.recentPlayedName').setAttribute("id", "recentPlayed" + recentPlayedCount)

        let percent = `${(element.songDuration / element.totalDuration) * 100}%`;

        let tempSelector = document.querySelector(`#recentPlayed${recentPlayedCount}`);
        
        tempSelector.style.background = `linear-gradient(90deg, rgba(255,0,0,1) ${parseInt(percent) / 2}%, rgba(255,255,255,1) ${percent})`;
        tempSelector.style["-webkit-background-clip"] = "text";
        tempSelector.style["-webkit-text-fill-color"] = "transparent";
        
        ((element) => {
            element.parentElement.addEventListener('click', async () => {
                let user = auth.currentUser;

                const docRef = doc(db, "userData", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    let data = docSnap.data();
    
                    let irater = 0;
                    let objectValue;
                    while (true) {
                        let x = data.recentPlayed[irater];
                        if (Object.keys(x) == element.innerHTML) {
                            objectValue = x[Object.keys(x)];
                            break;
                        }
    
                        irater++;
                    }

                    setClickedSongInformation(objectValue);
                }
            })
        })(tempSelector);
    }

    ifText != "atStart"? saveUserDataToDatabase("recentPlayed") : null;

    recentPlayedCount++;
}


// Find song and return song data
export function findSongByItsName(SongName) {
    let iIndex = 0
    
    for(let x in songData[0].artist){
        let jIndex = 0
        
        for(let y in songData[0].artist[x].album){
            let kIndex = 0

            for(let z in songData[0].artist[x].album[y].songs){
                if (songData[0].artist[x].album[y].songs[z].songName == SongName) {
                    X = x, Y = y, Z = z;
                    tempZ = z;
                    return {
                        "artistName": songData[0].artist[x].artistName,
                        "artistImage": songData[0].artist[x].artistImage,

                        "totalAlbums": songData[0].artist[x].album.length,
                        "albumName": songData[0].artist[x].album[y].albumName,
                        "albumImage": songData[0].artist[x].album[y].albumImage,

                        "totalSongs": songData[0].artist[x].album[y].songs.length,
                        "songName": songData[0].artist[x].album[y].songs[z].songName,
                        "songUrl": songData[0].artist[x].album[y].songs[z].songAudio,

                        "index": {
                            iIndex, jIndex, kIndex
                        }
                    }
                }

                kIndex++
            }

            jIndex++
        }

        iIndex++
    }
    
    return "Not Found";
}

export function findNextOrPreviousSong(nextorPrevious) {
    if (nextorPrevious == "next") {
        if (tempZ < songData[0].artist[0].album[0].songs.length - 1) {
            tempZ = parseInt(tempZ) + 1;
        }
        return{
            "artistName": songData[0].artist[X].artistName,
            "albumImage": songData[0].artist[X].album[Y].albumImage,
            "songName": songData[0].artist[X].album[Y].songs[tempZ].songName,
            "songUrl": songData[0].artist[X].album[Y].songs[tempZ].songAudio,
            "x": tempZ
        }
    }
    else if (nextorPrevious == "previous") {
        if (tempZ > 0) {
            tempZ = parseInt(tempZ) - 1;
        }
        return{
            "artistName": songData[0].artist[X].artistName,
            "albumImage": songData[0].artist[X].album[Y].albumImage,
            "songName": songData[0].artist[X].album[Y].songs[tempZ].songName,
            "songUrl": songData[0].artist[X].album[Y].songs[tempZ].songAudio,
            "x": tempZ
        }
    }
}

let timer;

export function playSong() {
    playBtn.classList.remove('fa-play');
    playBtn.classList.add('fa-pause');

    newSongElement.play();
    clearInterval(timer);
    timer = setInterval(() => {
        myChord++;
        if (myChord >= newSongElement.duration/2) {
            coinManagementAndAnimation("green", idCount);
            myChord = 0;
        }

    }, 1000);
}

export function pauseSong() {
    playBtn.classList.remove('fa-pause');
    playBtn.classList.add('fa-play');

    newSongElement.pause();
    clearInterval(timer);
}

export function startLoadingForSetAllData() {
    loginPage.style.display = 'none';
    musicPage.style.display = '';
    loadingSection.style.display = "";

    let time = Math.floor((Math.random() * 3000)) + 2000;

    musicDiv.style.display = 'none';

    gsap.to("#loadingImg", {
        duration: 1,
        opacity: 1
    })
    gsap.to("#loadingImg", {
        delay: 1,
        duration: 0.2,
        width: 0,
        opacity: 0
    })

    let interval;

    var t1 = gsap.timeline();
    setTimeout(() => {
        interval = setInterval(() => {
            t1
                .to("#loadingImg" ,{
                    duration: "0.6",
                    width: "20vw",
                    opacity: 1
                })
                .to("#loadingImg" ,{
                    duration: "0.3",
                    width: "15vw",
                    opacity: 0
                })
        }, 500);
    }, 1000);

    setTimeout(()=>{
        loadingSection.style.display = "none";
        musicDiv.style.display = ""
        clearInterval(interval);
    }, time )
}

export function displayLoginPage() {
    loginPage.style.display = '';
    musicDiv.style.display = '';

    document.querySelector('.mainMusicContainer').style.display = "none";

    // Website load animation

    // gsap.from('.coverImg', {
    //     delay: .2,
    //     duration: 3,
    //     opacity: 0,
    // })
    // gsap.from('.slideanimation1', {
    //     delay: .2,
    //     duration: 1,
    //     x: 200,
    // })
    // gsap.from('.slideanimation2', {
    //     delay: .4,
    //     duration: 1,
    //     x: 200,
    // })
    // gsap.from('#buttonanimation1', {
    //     delay: .6,
    //     duration: 1,
    //     x: 200,
    // })

    // flip animation by external liberty GSAP - greenshork

    flipContainer2.style.display = "none";

    loginFlipButton1.addEventListener('click', () => {
        gsap.to(".subContainer", {
            duration: 0.2,
            rotateY: -90,
            display: "none",
        })
        
        gsap.to('.subContainer2', {
            display: "",
            delay: 0.2,
            duration: 0.3,
            rotateY: 0,
        })
    });

    loginFlipButton2.addEventListener('click', () => {
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
    })
}

export function passwordSnowOrHideEyeConcept(id, inputField, element) {
    let eye = document.querySelector(`#${id}`);
    let input = document.querySelector(`#${inputField}`);
    if (input.type === "password") {
        input.type = "text";
        element.classList.remove("fa-eye");
        element.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        element.classList.add("fa-eye");
    }
}

export function errorIntoTextToShowTheUser(error) {
    switch (error) {
        case "auth/invalid-email":
            showAlertDiv("Invalid Email");
            break;
        case "auth/missing-email":
            showAlertDiv("Email is Required");
            break;
        case "auth/invalid-login-credentials":
            showAlertDiv("Invalid Email or Password");
            break;
        case "auth/missing-password":
            showAlertDiv("Password is Required");
            break;
        case "auth/email-already-in-use":
            showAlertDiv("Already have an Account");
            break;
        case "auth/weak-password":
            showAlertDiv("Week Password");
            break;
        case "recheckPassword":
            showAlertDiv("Re'check Your Password");
    };
}

export function showAlertDiv(text, color){
    count++;

    let alertNewDiv = document.createElement("div");

    alertNewDiv.innerHTML = `
        <div class="alertSection">
            <div class="displayFlex alertText">${text}</div>
            <div class="xmarkIcon" id=xmarkIcon${count}>
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
        <div class="underlineDiv">
            <div class="underline" id=underline${count}></div>
        </div>
    `;

    alertNewDiv.classList.add('errorAlert');
    alertBox.appendChild(alertNewDiv);
    alertNewDiv.setAttribute("id", alertNewDiv.className + count);

    
    color != undefined ? gsap.to(`#underline${count}`, {
        backgroundColor: "greenyellow",
    }) : gsap.to(`#underline${count}`, {
        backgroundColor: "red",
    });
    
    let errorAlertXMark;
    errorAlertXMark = document.querySelector(`#xmarkIcon${count}`);

    errorAlertXMark.addEventListener('click', () => {
        let x;
        let y;
        y = errorAlertXMark.id;
        x = `#errorAlert${y.slice(9, y.length)}`;

        gsap.to(x, {
            duration: 0.3,
            x: "-20vw"
        });
        gsap.to(x, {
            delay: 0.2,
            duration: 0.3,
            x: 0
        });
    
        gsap.to(x, {
            delay: 0.2,
            display: "none"
        });
    });

    ((x, y) => {
        gsap.to(x, {
            duration: 0.3,
            x: "-20vw"
        });
        gsap.to(x, {
            delay: 0.3,
            duration: 0.3,
            x: "-16vw"
        });
    
        gsap.from(y, {
            delay: 0.4,
            duration: 5,
            ease: "linear",
            scaleX: 0
        });
    
        gsap.to(x, {
            delay: 5.3,
            duration: 0.3,
            x: "-20vw"
        });
        gsap.to(x, {
            delay: 5.5,
            duration: 0.3,
            x: 0
        });
    
        setTimeout(() => {
            let temp = document.querySelector(x);
            temp.remove();
        }, 5800);  
    })(`#errorAlert${count}`, `#underline${count}`);
}

export function navbarActiveIconColorConcept(elementNum) {
    document.querySelectorAll('.sideNavbar > nav > ul').forEach(element => {
        if (navIcon[elementNum] == element) {
            gsap.to(navIcon[elementNum], {
                duration: 0.2,
                color: "#33818e",
                x: 20,
            })
        } else {
            gsap.to(element, {
                duration: 0.2,
                color: "#3f5152",
                x: 0,
            })
        }
    });
}

export function songSearchingConcept(text) {
    let songObjectArray = [];

    songData[0].artist.forEach(artistEle => {
        artistEle.album.forEach(albumEle => {
            albumEle.songs.forEach(element => {
                if(element.songName.toLowerCase().search(text.toLowerCase()) != -1){
                    songObjectArray.push(
                        {
                            "songName": element.songName,
                            "albumImage": albumEle.albumImage,
                            "Qlink": ""
                        }
                    );
                };
            });
        });
    });

    (async () => {
        const querySnapshot = await getDocs(collection(db, "songs"));
        // console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
            if(doc.data().songName.toLowerCase().search(text.toLowerCase()) != -1){
                try {
                    songObjectArray.push(
                        {
                            "songName": doc.data().songName,
                            "albumImage": doc.data().albumImage,
                            "Qlink": doc.data().Qlink,
                            "songUrl": doc.data().songUrl,
                            "artistName": doc.id
                        }
                    );
                } catch (error) {
                    songObjectArray.push(
                        {
                            "songName": doc.data().songName,
                            "albumImage": doc.data().albumImage,
                            "Qlink": doc.data().Qlink,
                            "songUrl": null,
                            "artistName": doc.id
                        }
                    );
                }
            };
        });


        searchDataMainBox.innerHTML = '';
        songObjectArray.forEach(element => {
            // console.log(element);
            let searchNewBox = document.createElement('div');
    
            searchNewBox.innerHTML = `
                <div class="searchDataSubBox">
                    <div class="searchDataImg displayFlex">
                        <img src=${element.albumImage}>
                    </div>
                    <div class="searchDataName">${afterTextLimitAdd3Dot(element.songName, 30)}</div>
                </div>
            `;
    
            searchNewBox.classList.add('searchDataBox');
            searchNewBox.setAttribute("id", element.Qlink);
            searchDataMainBox.appendChild(searchNewBox);
        });
    
        playSearchSongConcept(songObjectArray);
    })();
}


export function afterTextLimitAdd3Dot(text, limit){
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
}

export function showThisNumberOfDisplay(domainDisplay) {
    // let mainDisplay = document.querySelector('.mainMusicSection');
    // let albumDisplay = document.querySelector('.playListDataSection');
    // let searchDisplay = document.querySelector('.searchDataSection');
    // let myFruitySection = document.querySelector('.myFruitySection');
    // let userDataSection = document.querySelector('#userDataSection');

    // let displayArray = [mainDisplay, albumDisplay, searchDisplay, myFruitySection, userDataSection];
    let displayArray = [".mainMusicSection", ".playListDataSection", ".searchDataSection", ".myFruitySection", "#userDataSection"];

    displayArray.forEach((element, index) => {
        if (index != domainDisplay) {
            gsap.to(element, {
                duration: 0.2,
                opacity: 0,
                display: "none"
            })
        }
    });

    // document.querySelector(displayArray[domainDisplay]).style.display = "";
    setTimeout(() => {
        gsap.to(displayArray[domainDisplay], {
            duration: 0.2,
            opacity: 1,
            display: ""
        })
    }, 290);
}

export function changeTextSpacesIntoPercent20ForApi(text) {
    return text.replaceAll(" ", "%20");
}

export function bySongApiFetchSongID(songName) {
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://jio-saavan-unofficial.p.rapidapi.com/getdata?q=${songName}`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '37b6141575msh5f3621fe2f2b6ebp1cba94jsnaeadbf06da20',
            'X-RapidAPI-Host': 'jio-saavan-unofficial.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {
        // return response.results[0].encrypted_media_url;
        console.log(response);
        collectRequiredDataFromApiFetchData(response);
    });
}

export function bySongIDFetchSongLink(songID, array){
    // console.log(array);
    let link;

	const data = JSON.stringify({
		encrypted_media_url: `${songID}`
	});
	
	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	
	xhr.addEventListener('readystatechange', function () {
		if (this.readyState === this.DONE) {
			link = JSON.parse(this.responseText);
			let json_object = link.results[2];

			const kbps_url = json_object["320_kbps"];
            
            (async () => {
                await setDoc(doc(db, "songs", array.artistName), {
                    songUrl: kbps_url,
                }, { merge: true });
            })();

            setClickedSongInformation({
                "songName": "",
                "artistName": array.artistName,
                "albumImage": array.albumImage,
                "songUrl": kbps_url
            });

		}
	});
	
	xhr.open('POST', 'https://jio-saavan-unofficial.p.rapidapi.com/getsong');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.setRequestHeader('X-RapidAPI-Key', '37b6141575msh5f3621fe2f2b6ebp1cba94jsnaeadbf06da20');
	xhr.setRequestHeader('X-RapidAPI-Host', 'jio-saavan-unofficial.p.rapidapi.com');
	
	xhr.send(data);
}

export function collectRequiredDataFromApiFetchData(data) {
    // console.log(data);
    let objectArray = [];
    data.results.forEach(element => {
        objectArray.push(
            {
                "Qlink": element.encrypted_media_url,
                "albumImage": element.image,
                "songName": element.title,
                "artistName": element.subtitle
            }
        )
    })


    objectArray.forEach(element => {
        let searchNewBox = document.createElement('div');

        searchNewBox.innerHTML = `
            <div class="searchDataSubBox">
                <div class="searchDataImg displayFlex">
                    <img src=${element.albumImage}>
                </div>
                <div class="searchDataName">${afterTextLimitAdd3Dot(element.songName, 30)}</div>
            </div>
        `;

        searchNewBox.classList.add('searchDataBox');
        searchNewBox.setAttribute("id", element.Qlink);
        searchDataMainBox.appendChild(searchNewBox);
        loadingScreen.remove();
    });

    
    data.results.forEach(async element => {
        await setDoc(doc(db, "songs", element.subtitle), {
            Qlink: element.encrypted_media_url,
            albumImage: element.image,
            songName: element.title
        })
    })

    playSearchSongConcept(objectArray);
}

function playSearchSongConcept(objectArray) {
    let searchSongBox = document.querySelectorAll('.searchDataBox');
    searchSongBox.forEach((element, index) => {
        element.addEventListener('click', () => {
            if (element.id != "") {
                // console.log(array[index]);
                if (objectArray[index].songUrl != null) {
                    // console.log("you are pro");
                    // newSongElement.src = songInfo.songUrl;
                    setClickedSongInformation(objectArray[index]);

                } else {
                    // console.log("from api");
                    bySongIDFetchSongLink(element.id, objectArray[index]);
                }
            }
            else {
                setClickedSongInformation(findSongByItsName(objectArray[index].songName));
            }
        })
    })
}

export function checkImageUrlCorrectOrNot(url) {
    try {
        var image = new Image();
        image.onload = function() {
            if (this.width > 0) {
                uploadImage.value = "";
                changeUserProfile(url);
            }
        }
        image.onerror = function() {
            showAlertDiv("Invalid URL");
        }
    
        image.src = url;
    } catch (error) {
        showAlertDiv("Invalid URL");
    } 
}

export function changeUserProfile(url,alert) {
    let user = auth.currentUser;

    if (url == undefined || url == '') {
        // The user object has basic properties such as display name, email, etc.
        if (user.photoURL) {
            avatarImage.src = bgAvatarImage.src = logoAvatar.src = dbAvatar = myAvatar = user.photoURL;
        }
    }
    else {
        avatarImage.src = bgAvatarImage.src = logoAvatar.src = dbAvatar = myAvatar = url;
    }
    
    if (myAvatar == null) {
        myAvatar = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png";
        avatarImage.src = bgAvatarImage.src = logoAvatar.src = dbAvatar = myAvatar;
    }

    if (alert == undefined) {
        showAlertDiv("ProfilePic Updated", "green");
        saveUserDataToDatabase("avatar");
    }
    

    let tempName = "";

    if (user.displayName) {
        tempName = user.displayName;
    } else {
        let slicedStr = user.email.substr(0, user.email.indexOf('@'));

        for (let i = 0; i < slicedStr.length; i++) {
            if (slicedStr.charCodeAt(i) >= 65 && slicedStr.charCodeAt(i) <= 122) {
                tempName += slicedStr[i];
            }
        }
    }

    document.querySelector('#myAccountUserName').innerHTML = tempName;
    document.querySelector('#myAccountEmail').innerHTML = user.email;
    document.querySelector('.avatar > :nth-child(4)').innerHTML = tempName;
    
}

export function setClickedSongInformation(songInfo, condition) {
    
    let halfNameTillHyphen = playSongNameText.innerHTML;

    if (playSongNameText.innerHTML[0] == '-') {
        halfNameTillHyphen = playSongNameText.innerHTML.slice(1);
    }
    else if (playSongNameText.innerHTML.substr(0, playSongNameText.innerHTML.indexOf('-'))) {
        halfNameTillHyphen = playSongNameText.innerHTML.substr(0, playSongNameText.innerHTML.indexOf('-'));
    }

    if (halfNameTillHyphen == " "){
        halfNameTillHyphen = playSongNameText.innerHTML
    }
    
    dbRecentPlayed = {
        "songUrl": newSongElement.src,
        "albumImage": playSongImg.src,
        "songName": halfNameTillHyphen,
        "songDuration": newSongElement.currentTime,
        "totalDuration": newSongElement.duration
    }

    createRecentPlayedSongDiv(dbRecentPlayed);

    newSongElement.src = songInfo.songUrl;

    if (songInfo.artistName == undefined) {
        playSongNameText.innerHTML = songInfo.songName;
    } else {
        playSongNameText.innerHTML = songInfo.songName + " - " + songInfo.artistName;
    }

    try {
        playSongImg.src = songInfo.albumImage;
    } catch (error) {
        
    }

    let user = auth.currentUser;

    (async () => {
        const docRef = doc(db, "userData", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();

            try {
                if (data.likedSongs[songInfo.songName].liked) {
                    likeBtn.classList.remove("fa-regular");
                    likeBtn.classList.add("fa-solid");
                }
            } catch (error) {
                likeBtn.classList.remove("fa-solid");
                likeBtn.classList.add("fa-regular");
            }
        } else {
        // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    })();
    
    if (songInfo.songDuration && condition == "don'tPlay"){
        newSongElement.currentTime = songInfo.songDuration;
        // playSong();
        
        // let progress = parseInt((newSongElement.currentTime / newSongElement.duration) * 100);
        // songDurationBox.value = progress;
        
    } else {
        playSong();
    }
    
    dbPreSong = {
        "songUrl": songInfo.songUrl,
        "songName": songInfo.songName,
        "artistName": songInfo.artistName,
        "albumImage": songInfo.albumImage,
        "songDuration": ""
    }
}

export function makeReadableSongDuration() {
    if (isNaN(newSongElement.duration)) {
        setTimeout(() => {
            setDurationText();
        }, 100);
    }
    else{
        setTimeout(() => {
            let audioCurrentTime = newSongElement.duration;
    
            var minutes = "0" + Math.floor(audioCurrentTime / 60);
            var seconds = "0" +  Math.floor(audioCurrentTime - minutes * 60);
            var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
    
            songDurationText.innerHTML = dur;
        }, 100);
    }
}

export function onLikeBounceTheHeart() {
    likeBtn.classList.add("fa-bounce");
    setTimeout(() => {
        likeBtn.classList.remove("fa-bounce");
    }, 500)

    dbLikedSong = {
        "liked": true,
        "songImage": dbPreSong.albumImage,
    }

    createLikedSongInMyFruitySection();
    saveUserDataToDatabase("likedSong");
}

export function onUnlikeShakeTheHeart() {
    likeBtn.classList.add("fa-shake");
    setTimeout(() => {
        likeBtn.classList.remove("fa-shake");
    }, 500)

    dbLikedSong = {
        "liked": false,
        "songImage": dbPreSong.albumImage,
    }

    onUnlikeRemoveFromFrutySection();
    saveUserDataToDatabase("likedSong");
}

export function createBeatGif(element, imgClass) {
    gsap.to(imgClass, {
        duration: .5,
        opacity: 0
    })

    setTimeout(() => {
        element.appendChild(imgClass);
    }, 400);

    gsap.to(imgClass, {
        delay: .5,
        duration: 1,
        opacity: 1
    })
}

function createLikedSongInMyFruitySection() {
    let fruityWrapper = document.querySelector(".myFruityWrapper");

    let newFruity = document.createElement('div');
    // songUrl
    // songName
    // artistName
    // albumImage
    newFruity.innerHTML = `
        <div class="myFruitySubBox">
            <div class="myFruityImg displayFlex">
                <img src=${dbPreSong.albumImage}>
            </div>
            <div class="myFruityName">${dbPreSong.songName}</div>
        </div>
    `;

    newFruity.classList.add("myFruityBox");
    newFruity.setAttribute("id", dbPreSong.songName);

    fruityWrapper.appendChild(newFruity);
}

function onUnlikeRemoveFromFrutySection() {
    let myAllFruity = document.querySelectorAll('.myFruityBox');

    myAllFruity.forEach(element => {
        if (element.id == dbPreSong.songName) {
            element.remove();
        }
    });
}

function addAllLikedSongFromDataBase(data) {
    let fruityWrapper = document.querySelector(".myFruityWrapper");

    Object.keys(data.likedSongs).forEach(element => {
        if (data.likedSongs[element].liked) {
            let newFruity = document.createElement('div');
    
            newFruity.innerHTML = `
                <div class="myFruitySubBox">
                    <div class="myFruityImg displayFlex">
                        <img src=${data.likedSongs[element].songImage}>
                    </div>
                    <div class="myFruityName">${element}</div>
                </div>
            `;
    
            newFruity.classList.add("myFruityBox");
            newFruity.setAttribute("id", element);
        
            fruityWrapper.appendChild(newFruity);
        }
    });

}

export function downloadSong() {
    (async () => {
        let user = auth.currentUser;
        const docRef = doc(db, "userData", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            if (dbPreSong) {
                if (docSnap.data().coin >= 100) {
                    coinManagementAndAnimation("red", idCount++);
                    const link = document.createElement('a');
                    link.href = dbPreSong.songUrl;
                    link.download = dbPreSong.songName;
                    document.body.appendChild(link);
                    setTimeout(() => {
                        link.click();
                        document.body.removeChild(link);
                    }, 1000);
                } else {
                    showAlertDiv("Less Coin");
                }
            } else {
                showAlertDiv("Not Available");
            }
        } else {
            showAlertDiv("Less Coin");
        }
    })()
}

export function saveUserDataToDatabase(entity) {
    let user = auth.currentUser;

    (async () => {
        if (entity == "avatar") {
            await setDoc(doc(db, "userData", user.uid), {
                avatar: dbAvatar,
            }, { merge: true });
        }
        else if (entity == "preSong") {
            dbPreSong.songDuration = newSongElement.currentTime;
            await setDoc(doc(db, "userData", user.uid), {
                previousSongData: dbPreSong
            }, { merge: true });
        }
        else if (entity == "likedSong") {
            await setDoc(doc(db, "userData", user.uid), {
                "likedSongs": {
                    [dbPreSong.songName]: dbLikedSong
                }
            }, { merge: true });
        }
        else if (entity == "followArtist") {
            await setDoc(doc(db, "userData", user.uid), {
                followArtist: [
                    {
                        artistName: "",
                        artistImage: ""
                    },
                ],
            }, { merge: true });
        }
        else if (entity == "downloadSong") {
            await setDoc(doc(db, "userData", user.uid), {
                downloaded: [
                    {
                        downloadSongName: "",
                        downloadSongImage: ""
                    }
                ]
            }, { merge: true });
        }
        else if (entity == "recentPlayed") {
            const docRef = doc(db, "userData", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let data = docSnap.data();
                try {
                    await setDoc(doc(db, "userData", user.uid), {
                        "recentPlayed": [
                            {
                                [dbRecentPlayed.songName]: dbRecentPlayed
                            }, ...data.recentPlayed]
                        
                    }, { merge: true });
                    
                } catch (error) {
                    await setDoc(doc(db, "userData", user.uid), {
                        "recentPlayed": [
                            {
                                [dbRecentPlayed.songName]: dbRecentPlayed
                            }
                        ]
                        
                    }, { merge: true });
                }
            } else {
            // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }   
        }
    })();
}

export function onSongSearchCreateLoadingAnimation() {
    let noResultDiv = document.createElement('div');

    noResultDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto;display: block;shape-rendering: auto;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="translate(50 50) scale(0.7000000000000001) translate(-50 -50)"><g>
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" calcMode="spline" dur="4s" values="0 50 50;90 50 50;180 50 50;270 50 50;360 50 50" keyTimes="0;0.25;0.5;0.75;1" keySplines="0 1 0 1;0 1 0 1;0 1 0 1;0 1 0 1"/>
            <g>
                <animateTransform attributeName="transform" type="scale" dur="1s" repeatCount="indefinite" calcMode="spline" values="1;1;0.5" keyTimes="0;0.5;1" keySplines="1 0 0 1;1 0 0 1"/>
                    <g transform="translate(25 25)">
                        <rect x="-25" y="-25" width="52" height="52" fill="#4573aa">
                            <animate attributeName="fill" dur="4s" repeatCount="indefinite" calcMode="spline" values="#4573aa;#88a2ce;#c2d2ee;#fefefe;#4573aa" keyTimes="0;0.25;0.5;0.75;1" keySplines="0 1 0 1;0 1 0 1;0 1 0 1;0 1 0 1"/>
                        </rect>
                    </g>
                    <g transform="translate(25 75)">
                        <rect x="-25" y="-25" width="52" height="50" fill="#4573aa">
                            <animateTransform attributeName="transform" type="scale" dur="1s" repeatCount="indefinite" calcMode="spline" values="0;1;1" keyTimes="0;0.5;1" keySplines="1 0 0 1;1 0 0 1"/>
                            <animate attributeName="fill" dur="4s" repeatCount="indefinite" calcMode="spline" values="#4573aa;#88a2ce;#c2d2ee;#fefefe;#4573aa" keyTimes="0;0.25;0.5;0.75;1" keySplines="0 1 0 1;0 1 0 1;0 1 0 1;0 1 0 1"/>
                        </rect>
                    </g>
                    <g transform="translate(75 25)">
                        <rect x="-25" y="-25" width="50" height="52" fill="#4573aa">
                            <animateTransform attributeName="transform" type="scale" dur="1s" repeatCount="indefinite" calcMode="spline" values="0;1;1" keyTimes="0;0.5;1" keySplines="1 0 0 1;1 0 0 1"/>
                            <animate attributeName="fill" dur="4s" repeatCount="indefinite" calcMode="spline" values="#4573aa;#88a2ce;#c2d2ee;#fefefe;#4573aa" keyTimes="0;0.25;0.5;0.75;1" keySplines="0 1 0 1;0 1 0 1;0 1 0 1;0 1 0 1"/>
                        </rect>
                    </g>
                    <g transform="translate(75 75)">
                        <rect x="-25" y="-25" width="50" height="50" fill="#4573aa">
                            <animateTransform attributeName="transform" type="scale" dur="1s" repeatCount="indefinite" calcMode="spline" values="0;1;1" keyTimes="0;0.5;1" keySplines="1 0 0 1;1 0 0 1"/>
                            <animate attributeName="fill" dur="4s" repeatCount="indefinite" calcMode="spline" values="#4573aa;#88a2ce;#c2d2ee;#fefefe;#4573aa" keyTimes="0;0.25;0.5;0.75;1" keySplines="0 1 0 1;0 1 0 1;0 1 0 1;0 1 0 1"/>
                        </rect>
                    </g>
                </g>
            </g></g>
        </svg>
    `;

    noResultDiv.classList.add("noResultFound");
    searchDataMainBox.appendChild(noResultDiv);

    loadingScreen = document.querySelector('.noResultFound');
}

export {
    newSongElement,
}

export function createRecentSearchDiv(text, method) {
    // console.log(text);

    let recentSearchDiv = document.createElement('div');

    recentSearchDiv.innerHTML = `
        <div class="recentSearchText">${text}</div>
        <div class="recentSearchXicon">
            <i class="fa-solid fa-xmark" id="fa-xmark${text}"></i>
        </div>
    `;
    
    recentSearchDiv.classList.add("recentSearchBox");
    recentSearchDiv.setAttribute("id", text);
    recentSearchesWrapper.appendChild(recentSearchDiv);

    // document.querySelectorAll('.recentSearchBox').forEach((element, index) => {
    //     element.style.width = `${document.querySelectorAll('.recentSearchText')[index].innerHTML.replace(/\s/g, "").length + 3}%`;
    // });

    document.getElementById(text).addEventListener('click', () => {
        searchInput.value = text;
    })

    document.getElementById(`fa-xmark${text}`).addEventListener('click', (event) => {
        let parentDiv = document.getElementById(`fa-xmark${text}`).parentElement;
        parentDiv.parentElement.style.display = "none";
        event.stopPropagation();
    })

    if (method == "PUT") {
        (async () => {
            await setDoc(doc(db, "userData", auth.currentUser.uid), {
                "recentSearch": {
                    [text]: true
                }
            }, { merge: true });
        })();
    }
}

let idCount = 0;

function coinManagementAndAnimation(color, idCount) {

    let coinCountDiv = document.querySelector("#coinCount");
    
    let newCoinCountDiv = document.createElement("div");

    let coin = coinCountNum.innerHTML;

    newCoinCountDiv.innerHTML = (color == "green"? '+' : '-') + coin;

    newCoinCountDiv.setAttribute("id", `coin${idCount}`);
    coinCountDiv.appendChild(newCoinCountDiv);

    if (color == "green" || coinCountNum.innerHTML >= 50) {
        gsap.to(`#coin${idCount}`, {
            duration: 0.3,
            opacity: 1,
            color: `${color == "green"? "greenyellow" : "red"}` ,
            y: "-=20"
        })
    
        let tempCountDiv = document.querySelector(`#coin${idCount}`);

        setTimeout(() => {
            let interval = setInterval(() => {

                if (coin >= parseInt(coinCountNum.innerHTML) + 50 || coin <= parseInt(coinCountNum.innerHTML) - 100) {
                    clearInterval(interval);
                } else {
                    coin = color == "green"? parseInt(coin) + 1 : parseInt(coin) - 1;
                    tempCountDiv.innerHTML = (color == "green"? '+' : '-') + coin;
                }
            }, 10);
        }, 200);

        setTimeout(() => {
            gsap.to(`#coin${idCount}`, {
                duration: 0.3,
                opacity: 0.5,
                color: "#9ee3fb",
                y: "+=20"
            })
        }, 1000);
        
        setTimeout(async () => {
            tempCountDiv.remove();
            coinCountNum.innerHTML = coin;
            let user = auth.currentUser;
            await setDoc(doc(db, "userData", user.uid), {
                coin: coinCountNum.innerHTML
            }, { merge: true });
        }, 1200);


    } else {
        showAlertDiv("No Either Coin");
    }
}

// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
// });


export function changeTheme(darkTheme) {
    
    if ($(".mainMusicContainer").css("background-color") == "rgb(1, 3, 16)" || !darkTheme) {
        document.querySelectorAll( 'body *' ).forEach(element => {

            if ($(element).css("background-color") == "rgb(1, 3, 16)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(159, 165, 206)"
                })
            }
            if ($(element).css("background-color") == "rgba(18, 25, 33, 0.914)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(255, 255, 255, 0.9)"
                })
            }
            if ($(element).css("background-color") == "rgb(18, 25, 33)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(240, 240, 240, 0.97)"
                })
            }
            if ($(element).css("background-color") == "rgb(56, 68, 69)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(237, 237, 237)"
                })
            }
            if ($(element).css("border-left-color") == "rgb(19, 30, 36)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderLeftColor: "rgb(209, 209, 209)"
                })
            }
            if ($(element).css("border-top-color") == "rgb(19, 30, 36)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderTopColor: "rgb(209, 209, 209)"
                })
            }
            if ($(element).css("color") == "rgb(151, 189, 196)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgba(0, 0, 0, 0.55)"
                })
            }
            if ($(element).css("color") == "rgb(88, 113, 126)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgb(77, 76, 125)"
                })
            }
            if ($(element).css("color") == "rgb(51, 129, 142)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgba(0, 0, 0, 0.55)"
                })
            }
            if ($(element).css("background-color") == "rgba(41, 41, 41, 0.447)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(224 224 224)"
                })
            }
            if ($(element).css("background-color") == "rgba(62, 62, 62, 0.667)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(214 214 214)"
                })
            }
            if ($(element).css("background-color") == "rgba(64, 64, 64, 0.306)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(243 243 243)"
                })
            }
            if ($(element).css("color") == "rgba(71, 213, 255, 0.4)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgba(0 0, 0, 0.40)"
                })
            }
            if ($(element).css("border-top-color") == "rgba(255, 255, 255, 0.024)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderTopColor: "rgb(222 222, 222)"
                })
            }
            if ($(element).css("border-left-color") == "rgba(255, 255, 255, 0.024)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderLeftColor: "rgb(222 222, 222)"
                })
            }
            if ($(element).css("border-bottom-color") == "rgba(255, 255, 255, 0.024)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderBottomColor: "rgb(222 222, 222)"
                })
            }
            if ($(element).css("border-right-color") == "rgba(255, 255, 255, 0.024)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderRightColor: "rgb(222 222, 222)"
                })
            }
            if ($(element).css("background-color") == "rgb(13, 22, 33)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(222 222, 222)"
                })
            }
            if ($(element).css("background-color") == "rgb(18, 28, 39)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "#fff"
                })
            }
            if ($(element).css("background") == "rgb(18, 28, 39)") {
                gsap.to(element, {
                    duration: 0.5,
                    background: "#fff"
                })
            }
            if ($(element).css("background-color") == "rgb(24, 30, 38)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "ghostwhite"
                })
            }
            if ($(element).css("background-color") == "rgb(51, 129, 142)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(236, 236, 236)"
                })
            }
            if ($(element).css("background-color") == "rgba(255, 255, 255, 0.03)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(222, 222, 222)"
                })
            }
            if ($(element).css("background-color") == "rgba(255, 255, 255, 0.024)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "ghostwhite"
                })
            }
            if ($(element).css("background-color") == "rgba(255, 255, 255, 0.067)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(200, 200, 200, 0.2)"
                })
            }
            if ($(element).css("color") == "rgba(151, 189, 196, 0.34)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgba(0, 0, 0, 0.34)"
                })
            }
        });
        
        (async () => {
            let user = auth.currentUser;
            await setDoc(doc(db, "userData", user.uid), {
                darkTheme: false
            }, { merge: true });
        })();
        
    } else {
        document.querySelectorAll( 'body *' ).forEach(element => {
            console.log($(element).css("background-color"));
            if ($(element).css("background-color") == "rgb(159, 165, 206)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(1, 3, 16)"
                })
            }
            if ($(element).css("background-color") == "rgba(255, 255, 255, 0.9)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(18, 25, 33, 0.914)"
                })
            }
            if ($(element).css("background-color") == "rgba(240, 240, 240, 0.97)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(18, 25, 33)"
                })
            }
            if ($(element).css("background-color") == "rgb(237, 237, 237)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(56, 68, 69)"
                })
            }
            if ($(element).css("border-left-color") == "rgb(209, 209, 209)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderLeftColor: "rgb(19, 30, 36)"
                })
            }
            if ($(element).css("border-top-color") == "rgb(209, 209, 209)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderTopColor: "rgb(19, 30, 36)"
                })
            }
            if ($(element).css("color") == "rgba(0, 0, 0, 0.4)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgb(151, 189, 196)"
                })
            }
            if ($(element).css("color") == "rgba(0, 0, 0, 0.55)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgb(51, 129, 142)"
                })
            }
            if ($(element).css("color") == "rgb(77, 76, 125)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgb(88, 113, 126)"
                })
            }
            if ($(element).css("background-color") == "rgb(224, 224, 224)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(41, 41, 41, 0.447)"
                })
            }
            if ($(element).css("background-color") == "rgb(214, 214, 214)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(62, 62, 62, 0.667)"
                })
            }
            if ($(element).css("background-color") == "rgb(243, 243, 243)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(64, 64, 64, 0.306)"
                })
            }
            if ($(element).css("color") == "rgba(0 0, 0, 0.40)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgba(71, 213, 255, 0.4)"
                })
            }
            if ($(element).css("border-top-color") == "rgb(222, 222, 222)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderTopColor: "rgba(255, 255, 255, 0.024)"
                })
            }
            if ($(element).css("border-left-color") == "rgb(222, 222, 222)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderLeftColor: "rgba(255, 255, 255, 0.024)"
                })
            }
            if ($(element).css("border-bottom-color") == "rgb(222, 222, 222)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderBottomColor: "rgba(255, 255, 255, 0.024)"
                })
            }
            if ($(element).css("border-right-color") == "rgb(222, 222, 222)") {
                gsap.to(element, {
                    duration: 0.5,
                    borderRightColor: "rgba(255, 255, 255, 0.024)"
                })
            }
            if ($(element).css("background") == "rgb(255, 255, 255)") {
                gsap.to(element, {
                    duration: 0.5,
                    background: "rgb(18, 28, 39)"
                })
            }
            if ($(element).css("background-color") == "rgb(248, 248, 255)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(24, 30, 38)"
                })
            }
            if ($(element).css("background-color") == "rgb(236, 236, 236)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgb(51, 129, 142)"
                })
            }
            if ($(element).css("background-color") == "rgb(222, 222, 222)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(255, 255, 255, 0.03)"
                })
            }
            if ($(element).css("background-color") == "rgb(248, 248, 255)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(255, 255, 255, 0.024)"
                })
            }
            if ($(element).css("background-color") == "rgba(200, 200, 200, 0.2)") {
                gsap.to(element, {
                    duration: 0.5,
                    backgroundColor: "rgba(255, 255, 255, 0.067)"
                })
            }
            if ($(element).css("color") == "rgba(0, 0, 0, 0.34)") {
                gsap.to(element, {
                    duration: 0.5,
                    color: "rgba(151, 189, 196, 0.34)"
                })
            }
        });
        (async () => {
            let user = auth.currentUser;
            await setDoc(doc(db, "userData", user.uid), {
                darkTheme: true
            }, { merge: true });
        })();
    }

    $(".moon").toggleClass('sun');
    $(".tdnn").toggleClass('day');
}

export function saveNewLoginUserData(user) {
    let tableHeading = document.querySelector('#userDataSection > table tr:first-child');

    let tempName = "";

    if (user.displayName) {
        tempName = user.displayName;
    } else {
        let slicedStr = user.email.substr(0, user.email.indexOf('@'));

        for (let i = 0; i < slicedStr.length; i++) {
            if (slicedStr.charCodeAt(i) >= 65 && slicedStr.charCodeAt(i) <= 122) {
                tempName += slicedStr[i];
            }
        }
    }

    let icon;

    user.providerData.forEach((profile) => {
        if (profile.providerId == "google.com") {
            icon = `<svg height="100%" viewBox="0 0 20 20" width="1.5vw" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"></path><path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"></path><path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"></path><path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"></path></svg>`
        } else {
            icon = `<svg height="100%" viewBox="0 0 20 20" width="1.5vw" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M1 5.006A2 2 0 012.995 3h14.01A2 2 0 0119 5.006v9.988A2 2 0 0117.005 17H2.995A2 2 0 011 14.994V5.006zM3 5l7 4 7-4v2l-7 4-7-4V5z" fill="#fff" fill-opacity=".54" fill-rule="evenodd"></path></svg>`
        }
    });
    
    let newTableRow = document.createElement("tr");
    
    newTableRow.innerHTML = `
        <tr>
            <td><img src="${user.photoURL?user.photoURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}" alt="A"></td>
            <td>${tempName}</td>
            <td>${user.email}</td>
            <td>${icon}</td>
            <td>${user.metadata.lastSignInTime.slice(0, 25)}</td>
            <td>${user.metadata.creationTime.slice(0, 25)}</td>
        </tr>
    `;

    newTableRow.id = tempName;

    if (tableHeading.nextSibling) {
        tableHeading.parentNode.insertBefore(newTableRow, tableHeading.nextSibling);
    }
    else {
        tableHeading.parentNode.appendChild(newTableRow);
    }

    (async () => {
        let user = auth.currentUser;
        const docRef = doc(db, "admin", "data");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            let data = docSnap.data().data;

            data.push(
                {    
                    photoURL : user.photoURL?user.photoURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png",
                    displayName : tempName,
                    email : user.email,
                    icon : icon,
                    lastSignInTime : user.metadata.lastSignInTime.slice(0, 25),
                    creationTime : user.metadata.creationTime.slice(0, 25)
                }
            );

            await setDoc(doc(db, "admin", "data"), {
                data
            })
        }
    })()
}

function adminAccess() {
    (async () => {

        const docRef = doc(db, "admin", "data");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            let tableHeading = document.querySelector('#userDataSection > table tr:first-child');
            
            
            let data = docSnap.data().data;
            
            data.forEach(element => {
                let newTableRow = document.createElement("tr");
                newTableRow.innerHTML = `
                    <tr>
                        <td><img src="${element.photoURL}" alt="A"></td>
                        <td>${element.displayName}</td>
                        <td>${element.email}</td>
                        <td>${element.icon}</td>
                        <td>${element.lastSignInTime}</td>
                        <td>${element.creationTime}</td>
                    </tr>
                `;
                        
                if (tableHeading.nextSibling) {
                    tableHeading.parentNode.insertBefore(newTableRow, tableHeading.nextSibling);
                }
                else {
                    tableHeading.parentNode.appendChild(newTableRow);
                }
            });
        }
    })()
}


