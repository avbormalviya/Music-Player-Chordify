import { navbarActiveIconColorConcept, showThisNumberOfDisplay } from "./function.js";

let navIcon = document.querySelectorAll('.sideNavbar > nav > ul');

function loadThePage(element) {
    if (element.children[1].innerHTML == "Home"){
        showThisNumberOfDisplay(0);
    }
    else if (element.children[1].innerHTML == "My Fruity"){
        showThisNumberOfDisplay(3);
    }
    else if (element.children[1].innerHTML == "User Data"){
        showThisNumberOfDisplay(4);
    }
}

navIcon.forEach((element, index) => {
    element.addEventListener('click', ()=>{
        loadThePage(element);
        navbarActiveIconColorConcept(index);
    });
});

