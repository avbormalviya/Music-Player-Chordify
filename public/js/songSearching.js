import { changeTextSpacesIntoPercent20ForApi, onSongSearchCreateLoadingAnimation, createRecentSearchDiv, showThisNumberOfDisplay, navbarActiveIconColorConcept, bySongApiFetchSongID, songSearchingConcept } from "./function.js";

let searchInput = document.querySelector('.searchBox');

let searchDataMainBox = document.querySelector('.searchDataWrapper');

// let recentSearchBox = document.querySelector('.recentSearchBox');
let recentSearchSlideBtn = document.querySelector('.fa-angle-up');
let recentSearchesWrapper = document.querySelector('.recentSearchesWrapper');

showThisNumberOfDisplay(0);

searchInput.addEventListener('keyup', (event) => {
    navbarActiveIconColorConcept();
    showThisNumberOfDisplay(2);

    if (event.target.value != '' && event.target.value != ' ') {
        songSearchingConcept(event.target.value);
    }
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key == "Enter") {
        searchDataMainBox.innerHTML = '';
        onSongSearchCreateLoadingAnimation();
        createRecentSearchDiv(event.target.value, "PUT");
        bySongApiFetchSongID(changeTextSpacesIntoPercent20ForApi(event.target.value));
    }
});



recentSearchSlideBtn.addEventListener('click', () => {
    if (recentSearchSlideBtn.classList.contains('fa-angle-up')) {
        recentSearchSlideBtn.classList.remove('fa-angle-up');
        recentSearchSlideBtn.classList.add('fa-angle-down');

        gsap.to('.recentSearchesWrapper', {
            duration: 0.3,
            height: "auto",
            // padding: "1%"
        })
    }
    else {
        recentSearchSlideBtn.classList.remove('fa-angle-down');
        recentSearchSlideBtn.classList.add('fa-angle-up');
        gsap.to('.recentSearchesWrapper', {
            duration: 0.3,
            height: 0,
            // padding: 0
        })
    }
})