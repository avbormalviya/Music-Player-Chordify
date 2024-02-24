import songData from "../Data/songDataBase.json" assert { type: "json" };
import { showThisNumberOfDisplay, findSongByItsName, navbarActiveIconColorConcept, setClickedSongInformation, showAlertDiv, dbPreSong } from "./function.js";
import randomAbout from "./artistAbout.js";

let musicSection = document.querySelector('.mainMusicSection');
let artistSection = document.querySelector('.playListDataSection');

let artistParentDiv = document.querySelector('.artistWrapper');

let artistImage = document.querySelector('.dataImgWrapper > img');
let artistName = document.querySelector('.artistNameDiv');
let artistAbout = document.querySelector('.artistAboutDiv');
let artistBackBtn = document.querySelector('.backBtn');

let albumSection = document.querySelector('.albumWrapper');
let albumBox;

let playlistSection = document.querySelector('.playlistSongWrapper');
let playlistSongBox;
let playlistGif = document.querySelector('.playlistBeatGif');

function loadAllAlbums(artistIndex) {
    albumSection.innerHTML = '';

    songData[0].artist[artistIndex].album.forEach((element, index) => {
        var newAlbumDiv = document.createElement('div');

        newAlbumDiv.innerHTML = `
            <div class="albumImageWithName displayFlex">
                <img src=${element.albumImage} alt="">
            </div>
            <div class="albumNameDiv">
                <div>${element.albumName}</div>
                <div>Songs : <div class="songNumbers">${element.songs.length}</div></div>
                
                <img src="./Image/ezgif.com-crop.gif" class="albumBeatGif">
                
            </div>
        `;

        albumSection.appendChild(newAlbumDiv);
        newAlbumDiv.classList.add('albumNameData');
        newAlbumDiv.setAttribute("id", index);
    });

    albumBox = document.querySelectorAll('.albumNameData');

    setAllTheSongData();
}

function setAllTheSongData() {
    albumBox.forEach((element, index) => {
        element.addEventListener('click', () => {
            if (element.id == index) {
                loadAllSongs(index);
            }
        })
    })
}

function loadAllSongs(albumIndex) {
    songData[0].artist.forEach((element, index) => {
        if (element.artistName == artistName.innerHTML) {

            playlistSection.innerHTML = '';

            element.album[albumIndex].songs.forEach((element2, index) => {
                var newSongDiv = document.createElement('div');

                newSongDiv.innerHTML = `
                    <div class="playlistSongImageDiv displayFlex">
                        <img src=${element.album[albumIndex].albumImage} alt="" class="playlistSongImage">
                    </div>
                    <div class="playlistSongNameDiv">
                        <div class="playlistSongName">${element2.songName}</div>
                    </div>
                    
                `;

                playlistSection.appendChild(newSongDiv);
                newSongDiv.classList.add('playlistSongData');
                newSongDiv.setAttribute("id", index);
            });
        }
    })
    playlistSongBox = document.querySelectorAll('.playlistSongData');
    songPlayer();
}

function defaultPlaylistSongs(artistIndex) {
    playlistSection.innerHTML = '';

    songData[0].artist[artistIndex].album[0].songs.forEach((element, index) => {
        const newSongDiv = document.createElement('div');

        newSongDiv.innerHTML = `
            <div class="playlistSongImageDiv displayFlex">
                <img src=${songData[0].artist[artistIndex].album[0].albumImage} alt="" class="playlistSongImage">
            </div>
            <div class="playlistSongNameDiv">
                <div class="playlistSongName">${element.songName}</div>
            </div>
        `;

        playlistSection.appendChild(newSongDiv);
        newSongDiv.classList.add('playlistSongData');
        newSongDiv.setAttribute("id", index);
    })
    playlistSongBox = document.querySelectorAll('.playlistSongData');
    let playlistBeatGif = document.querySelector('.playlistBeatGif');

    // playlistSongBox[0].appendChild(playlistBeatGif)
    songPlayer();
}

function songPlayer() {
    playlistSongBox.forEach((element) => {
        element.addEventListener('click', () => { 
            let tempVar1 = '';
            let tempVar2 = '';

            tempVar1 = element.children;
            tempVar2 = tempVar1[1].children[0].innerHTML;

            let tempVar3 = findSongByItsName(tempVar2);
            // console.log(tempVar3);
            setClickedSongInformation(tempVar3);
            // createBeatGif(element, playlistGif);
        })
    })
}

songData[0].artist.forEach((element, index) => {
    const artistNewDiv = document.createElement('div');
    
    artistNewDiv.innerHTML = `
        <img src=${element.artistImage} alt=${element.artistName} class="artistImg">
        <div class="artistName">${element.artistName}</div>
    `;
    
    artistParentDiv.appendChild(artistNewDiv);
    artistNewDiv.classList.add('artistDataWrapper');
    artistNewDiv.setAttribute("id", index);
});

let artistDiv = document.querySelectorAll('.artistDataWrapper');
let albumDiv = document.querySelectorAll('.albumWrapperSection');

artistDiv.forEach((element, index) => {
    element.addEventListener('click', () => {
        if(element.id == index){
            showThisNumberOfDisplay(1);

            artistImage.src = songData[0].artist[index].artistImage;
            artistName.innerHTML = songData[0].artist[index].artistName;
            artistAbout.innerHTML = randomAbout();
            loadAllAlbums(index);
            defaultPlaylistSongs(index);
        }
    })
})

// albumDiv.forEach((element, index) => {
//     element.addEventListener('click', () => {
//         if(element.id == index){
//             showThisNumberOfDisplay(1);

//             artistImage.src = songData[0].artist[].album[];
//             artistName.innerHTML = songData[0].artist[index].artistName;
//             artistAbout.innerHTML = randomAbout();
//             loadAllAlbums(index);
//             defaultPlaylistSongs(index);
//         }
//     })
// })

let listBtn = document.querySelector(".fa-list");

listBtn.addEventListener('click', () => {
    let data = findSongByItsName(dbPreSong.songName)
    console.log(data.index);

    if (data == "Not Found") {
        showAlertDiv("No Result Found")
    } 
    else{
        showThisNumberOfDisplay(1);
    
        artistImage.src = songData[0].artist[data.index.iIndex].artistImage;
        artistName.innerHTML = songData[0].artist[data.index.iIndex].artistName;
        artistAbout.innerHTML = randomAbout();
        loadAllAlbums(data.index.iIndex);
        defaultPlaylistSongs(data.index.iIndex);
    }

})


artistBackBtn.addEventListener('click', () => {
    showThisNumberOfDisplay(0);
    navbarActiveIconColorConcept(0);
})

