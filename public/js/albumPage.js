
import songData from "../Data/songDataBase.json" assert { type: "json" };
import { findSongByItsName, setClickedSongInformation } from "./function.js";
// import * as js from "./loadSongs.js";

let albumbox = document.querySelector('.albumWrapperSection');

let randomSongWrapper = document.querySelector('.randomSongWrapper');
let randomSongBox;

songData[0].artist.forEach((artistElement) => {
    artistElement.album.forEach((albumElement) => {
        let newAlbumDiv = document.createElement('div');

        newAlbumDiv.innerHTML = `
            <img src=${albumElement.albumImage} class="albumImg">
            <div class="albumName">${albumElement.albumName}</div>
        `;

        newAlbumDiv.classList.add('albumDataWrapper');
        albumbox.appendChild(newAlbumDiv);
    })
})


for(let x in songData[0].artist){
    for(let y in songData[0].artist[x].album){
        for(let z in songData[0].artist[x].album[y].songs){
            let newRandomSongDiv = document.createElement('div');

            newRandomSongDiv.innerHTML = `
                
                <div class="randomSongSubMiniBox">
                    <div class="randomSongImg displayFlex">
                        <img src=${songData[0].artist[x].album[y].albumImage}>
                    </div>
                    <div class="randomSongName">${songData[0].artist[x].album[y].songs[z].songName}</div>
                </div>
                
            `

            newRandomSongDiv.classList.add('randomSongBox');
            newRandomSongDiv.classList.add('displayFlex');
            randomSongWrapper.appendChild(newRandomSongDiv);
        }
    }

    randomSongBox = document.querySelectorAll('.randomSongBox');
}

randomSongBox.forEach((element) => {
    element.addEventListener('click', () => {
        let tempVar1 = '';
        let tempVar2 = '';

        tempVar1 = element.children[0];
        tempVar2 = tempVar1.children[1].innerHTML;

        setClickedSongInformation(findSongByItsName(tempVar2));
    })
})