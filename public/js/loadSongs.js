
import songData from "../Data/songDataBase.json" assert { type: "json" };

let artist = [];
let album = [];
let song = [];

songData[0].artist.forEach(ArtEle => {
    ArtEle.album.forEach(AluEle => {
        AluEle.songs.forEach(SongEle => {
            song.push(
                {
                    "songAudio": SongEle.songAudio,
                    "songName": SongEle.songName,
                    "albumImage": AluEle.albumImage
                }
            );
        });

        album.push(
            {
                "albumName": AluEle.albumName,
                "albumImage": AluEle.albumImage
            }
        );
    });

    artist.push(
        {
            "artistImage": ArtEle.artistImage,
            "artistName": ArtEle.artistName
        }
    )
});


let shuffledArtistArray = artist
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

let shuffledAlbumArray = album
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

let shuffledSongArray = song
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

import { onLikeBounceTheHeart, createBeatGif, downloadSong, findNextOrPreviousSong, findSongByItsName, newSongElement, makeReadableSongDuration, setClickedSongInformation, onUnlikeShakeTheHeart, pauseSong, playSong } from "./function.js";

let mainMusicContainer = document.querySelector('.mainMusicContainer');
let recentPlayedBigBox = document.querySelector('.recentPlayedMainBox');
let recentPlayedSection = document.querySelector('.recentPlayedSection');

let playSongImg = document.querySelector('.songImg > img');
let playSongNameText = document.querySelector('#songName');
// let playSongArtistText = document.querySelector('#artistName');
// let BeatGif = document.querySelector('#beatGif');

let playBtn = document.querySelector('.fa-play');
let backwardBtn = document.querySelector('.fa-backward');
let forwardBtn = document.querySelector('.fa-forward');

let songDurationBox = document.querySelector('.songRangeBar');
let songDurationText = document.querySelector('#songDurationNum');

let volumeBtn = document.querySelector('.fa-volume-high');
let volumeRange = document.querySelector('.volumeRange');

let progress = 0;


// function createBeatGifforBoth(element, imgClass) {
//     gsap.to(imgClass, {
//         duration: .5,
//         opacity: 0
//     })

//     setTimeout(() => {
//         element.appendChild(imgClass);
//     }, 400);

//     gsap.to(imgClass, {
//         delay: .5,
//         duration: 1,
//         opacity: 1
//     })

// }





// songData[0].artist.forEach((artistElement) => {
//     artistElement.album[0].songs.forEach((songElement) => {
//         const recentPlayedSongNewDiv = document.createElement('div');
        
//         recentPlayedSongNewDiv.innerHTML = `
//             <img src=${artistElement.album[0].albumImage} alt="${songElement.songName}" class="recentPlayedImg">
//             <div class="recentPlayedName">${songElement.songName}</div>
//         `;
        
//         recentPlayedBigBox.appendChild(recentPlayedSongNewDiv);
//         recentPlayedSongNewDiv.classList.add('recentPlayedSubBox');
//     })
// })


function checkTheSong() {
    if(playBtn.classList.contains("fa-play")) {
        playSong();
        // createBeatGif(recentPlayedSubBox[songIndex], BeatGif);
    }
    else {
        pauseSong();
    }
}



let recentPlayedSubBox = document.querySelectorAll('.recentPlayedSubBox');
// recentPlayedSubBox[0].appendChild(BeatGif);

recentPlayedSubBox.forEach((element) => {
    element.addEventListener('click', () => {
        let tempVar1 = findSongByItsName(element.children[1].innerHTML);
        setClickedSongInformation(tempVar1);
        // createBeatGif(element, BeatGif);
    })
})

playBtn.addEventListener('click', () => {
    checkTheSong();
    makeReadableSongDuration();
})

document.addEventListener('keyup', (event) => {
    if (event.key == ' ') {
        if(event.target.classList.contains('searchBox') || mainMusicContainer.style.display == "none"){
            
        } else {
            checkTheSong();
        }
    }
});

forwardBtn.addEventListener('click', () => {
    let tempVar1 = findNextOrPreviousSong("next");
    // createBeatGif(recentPlayedSubBox[tempVar1.x], BeatGif);
    setClickedSongInformation(tempVar1);
})

backwardBtn.addEventListener('click', () => {
    let tempVar1 = findNextOrPreviousSong("previous");
    // createBeatGif(recentPlayedSubBox[tempVar1.x], BeatGif);
    setClickedSongInformation(tempVar1);
})

newSongElement.addEventListener('timeupdate', () => {
    progress = parseInt((newSongElement.currentTime / newSongElement.duration) * 100);
    songDurationBox.value = progress;
})

songDurationBox.addEventListener('change', () => {
    newSongElement.currentTime = songDurationBox.value * newSongElement.duration / 100;
})

let likeBtn = document.querySelector('.likeBtn > .iconWrapper > .fa-heart');

likeBtn.addEventListener('click', () => {
    if(likeBtn.classList.contains("fa-regular")) {
        onLikeBounceTheHeart();
        likeBtn.classList.remove("fa-regular");
        likeBtn.classList.add("fa-solid");
    }
    else {
        onUnlikeShakeTheHeart();
        likeBtn.classList.remove("fa-solid");
        likeBtn.classList.add("fa-regular");
    }
})

volumeBtn.addEventListener('click', () => {
    if(volumeBtn.classList.contains("fa-volume-high")) {
        volumeBtn.classList.remove("fa-volume-high");
        volumeBtn.classList.add("fa-volume-xmark");
        volumeRange.value = 0;
        newSongElement.volume = 0;
    }
    else if(volumeBtn.classList.contains("fa-volume-xmark")) {
        volumeBtn.classList.remove("fa-volume-xmark");
        volumeBtn.classList.add("fa-volume-high");
        volumeRange.value = 100;
        newSongElement.volume = 1;
    }
})

volumeRange.oninput = function() {
    newSongElement.volume = this.value/100;

    if(this.value > 60){
        volumeBtn.classList.remove("fa-volume-low");
        volumeBtn.classList.add("fa-volume-high");
    }
    else if(this.value > 20 && this.value <= 60){
        volumeBtn.classList.remove("fa-volume-high");
        volumeBtn.classList.remove("fa-volume-off");
        volumeBtn.classList.add("fa-volume-low");
    }
    else if(this.value > 0 && this.value <= 20){
        volumeBtn.classList.remove("fa-volume-low");
        volumeBtn.classList.remove("fa-volume-xmark");
        volumeBtn.classList.add("fa-volume-off");
    }
    else{
        volumeBtn.classList.remove("fa-volume-off");
        volumeBtn.classList.add("fa-volume-xmark");
    }
}

let downloadBtn = document.querySelector(".fa-download");

downloadBtn.addEventListener('click', downloadSong)

