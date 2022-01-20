let contentPanels = [];
let shownContentHeight = document.getElementById("shown-content").scrollHeight;
let activePanel = "";
let activeModal = "";
let dioramaIndex = 0;

function init() {
    // getHeights();
    document.getElementById("projects-button").click();
    scarletDioramaSlideshow();
    document.querySelector('footer').style.opacity = 1;
    document.getElementById("shown-content").style.opacity = 1;
    document.querySelector("#spinning-icon-display").innerHTML = "";
}

function initMaps(){
    if (activeModal != "")
        return;
    // vars for use later
    var i, tabContent, tabButtons;
    let sectionName = 'design';

    // fade in the current panel, and make its button 'active'
    document.getElementById(sectionName).style.transform = "scaleY(1)";
    document.getElementById(sectionName).style.opacity = 1;
    document.getElementById(sectionName).style.visibility = "visible";
    document.getElementById(sectionName).style.height = "100%";
    document.getElementById(sectionName + "-content").style.transform = "scaleY(1)";
    document.getElementById(sectionName + "-content").style.opacity = 1;
    document.getElementById(sectionName + "-content").style.visibility = "visible";
    document.getElementById(sectionName + "-content").style.overflow = "visible";
    activePanel = sectionName;
    resizeShownContent();
    document.querySelector('footer').style.opacity = 1;
    document.getElementById("shown-content").style.opacity = 1;
    document.querySelector("#spinning-icon-display").innerHTML = "";
}

function getHeights() {
    console.log(document.getElementById("shown-content").scrollHeight);
    console.log(document.getElementById("projects-content").scrollHeight);
    console.log(document.getElementById("artwork-content").scrollHeight);
    console.log(document.getElementById("design-content").scrollHeight);
    console.log(document.getElementById("shown-content").scrollHeight);

    // let noHeightPanels = document.querySelectorAll("no-height");
    // for (i = 0; i < tabButtons.length; i++) {
    //     noHeightPanels[i].style.height = "0";
    // }
}

function closeModalByClickingOffIt(event) {
    if (event.target.className == "modal") {
        closeModal();
    }
}

function openModal(modalName) {
    if (activeModal != "")
        return;
    document.getElementById("title-nav").style.transform = "translateX(-100vw)";
    document.getElementById("main-header").style.transform = "translateX(-100vw)";
    document.getElementById("shown-content").style.transform = "translateX(-100vw)";
    document.querySelector("footer").style.transform = "translateX(-100vw)";
    activeModal = modalName;
    if (activeModal == "scarlet-meadow-modal")
        scarletDioramaSlideshow();
    document.body.style.overflow = "hidden";
    document.getElementById(activeModal).style.visibility = "visible";
    document.getElementsByClassName("close-modal-button")[0].style.visibility = "visible";
    document.getElementsByClassName("close-modal-button")[0].style.opacity = 1;
    document.getElementById(activeModal).style.transform = "translateX(0)"
}

function closeModal() {
    document.getElementById("title-nav").style.transform = "translateX(0)";
    document.getElementById("main-header").style.transform = "translateX(0)";
    document.getElementById("shown-content").style.transform = "translateX(0)";
    document.querySelector("footer").style.transform = "translateX(0)";
    document.body.style.overflow = "auto";
    document.getElementById(activeModal).scrollTo(0, 0);
    document.getElementById(activeModal).style.visibility = "hidden";
    document.getElementsByClassName("close-modal-button")[0].style.visibility = "hidden";
    document.getElementsByClassName("close-modal-button")[0].style.opacity = 0;
    document.getElementById(activeModal).style.transform = "translateX(100vw)"
    let videos = document.getElementsByClassName("inline-video");
    for (let i = 0; i < videos.length; i++) {
        videos[i].pause();
    }
    activeModal = "";
    resizeShownContent();
}

function scarletDioramaSlideshow() {
    if (activeModal != "scarlet-meadow-modal")
        return;
    document.getElementById("scarlet-diorama").src = "media/scarlet-environment" + dioramaIndex + ".jpg";
    dioramaIndex++;
    if (dioramaIndex == 4) {
        dioramaIndex = 0;
    }
    setTimeout(scarletDioramaSlideshow, 2500);
}

function slideshowGoLeft(slideshowName) {
    let slideshowElement = document.getElementById("level-" + slideshowName);
    let currentIndex = slideshowElement.getAttribute("src").substring(12 + slideshowName.length + 1, slideshowElement.getAttribute("src").length - 4);
    if (currentIndex == 0) {
        currentIndex = 3;
    } else {
        currentIndex--;
    }
    slideshowElement.src = "media/levels/" + slideshowName + currentIndex + ".jpg";
}

function slideshowGoRight(slideshowName) {
    let slideshowElement = document.getElementById("level-" + slideshowName);
    let currentIndex = slideshowElement.getAttribute("src").substring(12 + slideshowName.length + 1, slideshowElement.getAttribute("src").length - 4);
    if (currentIndex == 3) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    slideshowElement.src = "media/levels/" + slideshowName + currentIndex + ".jpg";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//     if(activeModal != ""){
//         closeModal(activeModal);
//     }
// }

function openSection(evt, sectionName) {
    if (activeModal != "")
        return;
    // vars for use later
    var i, tabContent, tabButtons;
    // document.getElementById("projects-content").style.height = "100px";
    // console.log(document.getElementById("projects-content").offsetHeight);
    // console.log(document.getElementById("artwork-content").offsetHeight);
    // hide all content panels
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        document.getElementById(tabContent[i].id).style.transform = "scaleY(0)";
        // document.getElementById(tabContent[i].id).style.transform = "translateY(-200vh)";
        // document.getElementById(tabContent[i].id).style.height = "0";
        document.getElementById(tabContent[i].id).style.opacity = 0;
        document.getElementById(tabContent[i].id).style.visibility = "hidden";
        document.getElementById(tabContent[i].id).style.overflow = "hidden";
        // document.getElementById(tabContent[i].id).style.display = "none";
    }

    // remove all buttons from "active"
    tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    // fade in the current panel, and make its button 'active'
    // document.getElementById(sectionName).style.display = "block";
    document.getElementById(sectionName).style.transform = "scaleY(1)";
    document.getElementById(sectionName).style.opacity = 1;
    document.getElementById(sectionName).style.visibility = "visible";
    document.getElementById(sectionName).style.height = "100%";
    // document.getElementById(sectionName + "-content").style.transform = "translateY(0)";
    document.getElementById(sectionName + "-content").style.transform = "scaleY(1)";
    document.getElementById(sectionName + "-content").style.opacity = 1;
    document.getElementById(sectionName + "-content").style.visibility = "visible";
    document.getElementById(sectionName + "-content").style.overflow = "visible";
    document.getElementById(sectionName + "-button").className += " active";
    activePanel = sectionName;
    resizeShownContent();
    //positionFooter();
    //positionFooter();
    // evt.currentTarget.className += " active";
    //document.getElementById("shown-content").scrollIntoView();
}
window.addEventListener('resize', resizeShownContent);
window.addEventListener('scroll', resizeShownContent, {passive: true});
window.addEventListener('fullscreenchange', resizeShownContent);
window.addEventListener('fullscreenerror', resizeShownContent);

//document.addEventListener('touchmove', resizeShownContent);
//document.addEventListener('gesturechange', resizeShownContent);
// window.addEventListener('fullscreenchange', positionFooter);
// window.addEventListener('maximize', positionFooter);
// function positionFooter(){
//     document.querySelector('footer').style.top = (document.querySelector('footer').scrollHeight + document.body.scrollHeight).toString() + "px";
//     document.querySelector('footer').style.width = "100%";
//     console.log(document.body.scrollHeight);
// }

function scrollTest() {

}

function resizeShownContent() {
    if (activeModal != "")
        return;
    if (document.getElementById("shown-content") == null || document.getElementById(activePanel + "-content") == null) {
        setTimeout(resizeShownContent, 1000);
        return;
    }

    document.getElementById(activePanel + "-content").style.height = "1";
    // console.log(document.getElementById(activePanel + "-content").scrollHeight);

    document.getElementById("shown-content").style.height = document.getElementById(activePanel + "-content").scrollHeight + "px";
    document.getElementById(activePanel + "-content").style.height = "0";
}

function viewBackground() {
    if (activeModal != "")
        return;
    document.getElementById("title-nav").style.transform = "translateX(-100vw)";
    document.getElementById("main-header").style.transform = "translateX(-100vw)";
    document.getElementById("shown-content").style.transform = "translateX(-100vw)";
    document.getElementsByClassName("background-video")[0].style.opacity = "1";
    document.getElementsByClassName("background-overlay")[0].style.opacity = ".1";
    document.getElementsByClassName("close-background-button")[0].style.visibility = "visible";
    document.getElementsByClassName("close-background-button")[0].style.transform = "translateX(0)";
    document.querySelector("footer").style.transform = "translateX(-100vw)";
    document.getElementById("shown-content").style.height = "0";
    scrollTo(0, 0);
}

function closeBackground() {
    document.getElementById("title-nav").style.transform = "translateX(0)";
    document.getElementById("main-header").style.transform = "translateX(0)";
    document.getElementById("shown-content").style.transform = "translateX(0)";
    document.querySelector("footer").style.transform = "translateX(0)";
    document.getElementById("shown-content").style.height = "1";
    document.getElementsByClassName("background-video")[0].style.opacity = ".2";
    document.getElementsByClassName("background-overlay")[0].style.opacity = ".03";
    document.getElementsByClassName("close-background-button")[0].style.visibility = "hidden";
    document.getElementsByClassName("close-background-button")[0].style.transform = "translateX(-100vw)";
    resizeShownContent();
    scrollTo(0, 0);
}