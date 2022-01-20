//initializes the page with some things we want to do right when it loads
function init() {
    //load our user's search options from local storage
    loadSearchOptions();
    //load our user's favorited gifs from local storage
    loadFavorites();
    //and display them in the favorie sections
    refreshFavorites();
    //"click" our first tab button (trending tab) as its what the site will open to
    //and it will automatically hide the rest of the content sections
    document.querySelector("#trending-tab-button").click();
    //add an event listener that listens for an "enter" key press
    //on the search bar
    document.querySelector("#search-input").addEventListener("keyup", function (event) {
        //if its the enter key that was pressed
        if (event.keyCode === 13) {
            //prevent the default action and "click" the find gifs button!
            event.preventDefault();
            document.querySelector(".find-gifs-button").click();
        }
    });
    //finally, load in our trending gifs
    getTrending();
    setTimeout(resizeShwonContentWithTimer, 100);
}


//the name of the gif display grid we are currently trying to place gifs into
//such as the 'trending' section or 'search' results section
let displayName;

let activeSection = "";

//the offset for searching that we give to giphy in our url
let searchOffset = 0;
//the amount of times we have queried the giphy servers in one search
let searchQueryTries = 0;
//the recency filter the user set for this search
let searchRecency = "all";
//the url we are giving to giphy to get our results
let searchURL = "";
//if we are filtering by recency, this stores our filtered results so we can display them when we are done the search
let filteredSearchResults = [];

//Key names for local storage
const prefix = "nmb9745-";
const favoritesKey = prefix + "favorites";
const searchInputKey = prefix + "searchInput";
const recencyKey = prefix + "recency";
const ratingKey = prefix + "rating";

//my giphy api key
const GIPHY_KEY = "vJjhSGYY88heMgmQrj9kYRqaDWNVe25Y";

//stores gifs' info in a format that can be easily searched or saved to local storage
let trendingGifs = [];
let searchGifs = [];
let favoriteGifs = [];

//stores the html elements that are display our gifs in each section
let trendingGifsOnPage = [];
let searchGifsOnPage = [];
let favoriteGifsOnPage = [];

//queries the GIPHY severs for their most recent rending gifs!
function getTrending() {
    displayName = "trending";

    //construct our url
    let url = "https://api.giphy.com/v1/gifs/trending?api_key=" + GIPHY_KEY + "&offset=" + trendingGifs.length + "&limit=25";

    document.querySelector("#" + displayName + "-status").innerHTML = "<div class='spinning-icon'></div>";

    //console.log(url);

    //request our data
    getData(url);
}

//when the user clicks the search button
function searchButtonClick() {
    //reset our offset
    searchOffset = 0;
    searchGifs = [];
    //reset our gif display grid
    document.querySelector("#search-gifs-display-grid").innerHTML = "";
    //save the user's search options
    saveSearchOptions();
    getSearchResults();
}

//sets up our url, statuses, and query amount for detailed a GIF search!
function getSearchResults() {
    displayName = "search";
    searchQueryTries = 0;
    //construct our url
    makeSearchURL();

    //set up our statuses
    document.querySelector("#" + displayName + "-status-bottom").innerHTML = "<div class='spinning-icon'></div>";
    document.querySelector("#load-more-search").style.visibility = "hidden";
    filteredSearchResults = [];

    //console.log(searchURL);

    //do the search
    getData(searchURL);
}

//saves the user's search options to local storage
function saveSearchOptions() {
    localStorage.setItem(searchInputKey, document.querySelector("#search-input").value);
    localStorage.setItem(recencyKey, document.querySelector("#recency").value);
    localStorage.setItem(ratingKey, document.querySelector("#rating").value);
}

//loads the user's search options from local storage
function loadSearchOptions() {
    //load search keywords
    let loadedSearchInput = localStorage.getItem(searchInputKey);
    if (loadedSearchInput) {
        document.querySelector("#search-input").value = loadedSearchInput;
    }

    //load rating limit
    let loadedRating = localStorage.getItem(ratingKey);
    if (loadedRating) {
        document.querySelector("#rating").querySelector(`option[value='${loadedRating}']`).selected = true;
    }

    //load recency filter
    let loadedRecency = localStorage.getItem(recencyKey);
    if (loadedRecency) {
        document.querySelector("#recency").querySelector(`option[value='${loadedRecency}']`).selected = true;
    }
}

//constructs a giphy search url with our search options
function makeSearchURL() {
    //gets our user inputted search terms, trims them, and encodes them for URI
    let keywords = document.querySelector("#search-input").value;
    keywords = keywords.trim();
    keywords = encodeURIComponent(keywords);

    //if our newly formatted input is empty, let the user know
    if (keywords.length < 1) {
        document.querySelector("#" + displayName + "-status").innerHTML = "Please enter valid search terms in the Search Bar!";
        document.querySelector("#" + displayName + "-status-bottom").innerHTML = "";

        return;
    }

    //add our rating limit
    let rating = document.querySelector("#rating").value;

    searchURL = "https://api.giphy.com/v1/gifs/search?api_key=" + GIPHY_KEY + "&q=" + keywords + "&rating=" + rating + "&offset=" + searchOffset + "&limit=25";

    //store our recency filter
    searchRecency = document.querySelector("#recency").value;
}

//returns true if the date the gif was uploaded is within our recency filter
//returns false otherwise
function filterGifsByRecency(gif) {
    //get our current date
    let currentDate = new Date();
    //get the date the gif was uploaded
    let gifDate = new Date(gif.import_datetime);
    //move our current date backwards depending on what recency filter the user set
    if (searchRecency == "week") {
        currentDate.setDate(currentDate.getDate() - 7);
    }
    else if (searchRecency == "month1") {
        currentDate.setMonth(currentDate.getMonth() - 1);
    }
    else if (searchRecency == "month6") {
        currentDate.setMonth(currentDate.getMonth() - 6);
    }
    else if (searchRecency == "year1") {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
    }
    else if (searchRecency == "year2") {
        currentDate.setFullYear(currentDate.getFullYear() - 2);
    }
    else if (searchRecency == "year5") {
        currentDate.setFullYear(currentDate.getFullYear() - 5);
    }

    //return true if the gif's upload date is after our moved-back current date
    return gifDate > currentDate;
}

//gets our request and opens it from the GIPHY API
function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

//parses our server request into an online gif formate, filters out gifs by date if the user chose that,
//converts our gifs to a local formate, and then displays our gifs
function dataLoaded(e) {
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    //if we are just getting gifs with no extra filters...
    if (displayName == "trending" || (displayName == "search" && searchRecency == "all")) {
        //if no results are found, say so.
        if (!obj.data || obj.data.length == 0) {
            noResultsFound();
        }
        //if we have results, then get their info and display them!
        else {
            searchOffset += obj.data.length;
            let results = obj.data;
            convertOnlineGifArrayToLocal(results);
            placeGifsInDisplay(results);
        }
    }
    //if we are searching WITH extra filters
    else if (displayName == "search" && searchRecency != "all") {
        //if no results are found
        if (!obj.data || obj.data.length == 0) {
            //then display what we have already found
            if (filteredSearchResults.length != 0) {
                convertOnlineGifArrayToLocal(filteredSearchResults);
                placeGifsInDisplay(filteredSearchResults);
            }
            //or if we have found nothing, say so
            else {
                noResultsFound();
            }
        }
        //if results are found
        else {
            searchOffset += obj.data.length;
            let results = obj.data;

            //filter the results by recency
            results = [];
            for (let i = 0; i < obj.data.length; i++) {
                if (filterGifsByRecency(obj.data[i])) {
                    results.push(obj.data[i]);
                }
            }
            //store the filtered results
            for (let i = 0; i < results.length; i++) {
                filteredSearchResults.push(results[i]);
            }
            document.querySelector("#" + displayName + "-status").innerHTML = "Finding " + filteredSearchResults.length + " GIFs from " + (searchOffset + 25);
            //if we dont have enough results to fill up the page with after filtering, then search again 
            //(or until we hit an artbitrary search amount limit of 100)
            if (filteredSearchResults.length < 25 && searchQueryTries < 100) {
                //then search again with offset
                searchQueryTries++;
                makeSearchURL();
                getData(searchURL);
            }
            //if we do have enough filtered results to fill the page, then display them!
            else {
                convertOnlineGifArrayToLocal(filteredSearchResults);
                placeGifsInDisplay(filteredSearchResults);
            }
        }
    }

}

//for when no results can be shown for a query.
//sets status to the right message
function noResultsFound() {
    document.querySelector("#" + displayName + "-status").innerHTML = "No results found!";
    if (displayName == "search" && searchGifs.length > 0) {
        document.querySelector("#search-status").innerHTML = "Found " + searchGifs.length + " results!";
        document.querySelector("#" + displayName + "-status-bottom").innerHTML = "No more results found!";
    } else if (displayName == "search" && searchGifs.length == 0)
        document.querySelector("#" + displayName + "-status-bottom").innerHTML = "";
    console.log("no results found");
}

//takes in an array of locally-formatted gifs and displays them on one of the gif display sections
function placeGifsInDisplay(results) {
    let display = document.querySelector("#" + displayName + "-gifs-display-grid");

    //lop through results and add their html to the page
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        //convert our formatted gif into html text that we can add to the page
        display.innerHTML += convertLocalGifToPage(result);


        if (displayName == "trending") {
            //store this gif for later use
            trendingGifs.push(result);
            //if the gif is in the list of favorites, then we need to fill in its 'favorite' button
            if (isAFavoriteGif(result)) {
                trendingGifsOnPage = document.querySelector("#" + displayName + "-gifs-display-grid").querySelectorAll(".gif-display-block");
                fillInButton(trendingGifsOnPage[trendingGifs.length - 1].querySelector(".favorite-button-hollow"));
            }
        } else if (displayName == "search") {
            //store this gif for later use
            searchGifs.push(result);
            //if the gif is in the list of favorites, then we need to fill in its 'favorite' button
            if (isAFavoriteGif(result)) {
                searchGifsOnPage = document.querySelector("#" + displayName + "-gifs-display-grid").querySelectorAll(".gif-display-block");
                fillInButton(searchGifsOnPage[searchGifs.length - 1].querySelector(".favorite-button-hollow"));
            }
        } else {
            //if we are adding gifs to the favorite section, then enable "unfavorite" button
            fillInButton(document.querySelector("#" + displayName + "-gifs-display-grid").querySelectorAll(".gif-display-block")[i].querySelector(".favorite-button-hollow"));
        }
    }

    //if we were displaying in trending section
    if (displayName == "trending") {
        //add our 'gifs on page' html elements to our array, make the load more button visible, and make status empty
        trendingGifsOnPage = document.querySelector("#" + displayName + "-gifs-display-grid").querySelectorAll(".gif-display-block");
        document.querySelector("#load-more-" + displayName).style.visibility = "visible";
        document.querySelector("#trending-status").innerHTML = "";
    }
    //if we were displaying in search section
    else if (displayName == "search") {
        //add our 'gifs on page' html elements to our array, make the load more button visible, and make status show number of results or empty
        searchGifsOnPage = document.querySelector("#" + displayName + "-gifs-display-grid").querySelectorAll(".gif-display-block");
        document.querySelector("#search-status").innerHTML = "Found " + results.length + " results!";
        if (results.length != 1) {
            document.querySelector("#search-status").innerHTML = "Found " + results.length + " results!";
        } else {
            document.querySelector("#search-status").innerHTML = "Found " + results.length + " result!";
        }
        document.querySelector("#load-more-" + displayName).style.visibility = "visible";
        document.querySelector("#search-status-bottom").innerHTML = "";
    } else {
        //if we are in the favorite section, then store our favorite gifs html elements and make status dosplay amount of favorite gifs.
        favoriteGifsOnPage = document.querySelector("#" + displayName + "-gifs-display-grid").querySelectorAll(".gif-display-block");
        if (results.length != 1) {
            document.querySelector("#favorites-status").innerHTML = "You have " + results.length + " favorited GIFs!";
        } else {
            document.querySelector("#favorites-status").innerHTML = "You have " + results.length + " favorited GIF!";
        }
    }
}

//when the user clicks 'load more' button
//basically just does a trending/search query again but with an offset
function loadMore(section) {
    if (section == "trending") {
        getTrending();
    } else {
        getSearchResults();
        document.querySelector("#search-status-bottom").innerHTML = "<div class='spinning-icon'></div>";
    }
}

//checks if the gif is already favorited or not
function isAFavoriteGif(result) {
    //loop thru our favorited gifs
    for (let i = 0; i < favoriteGifs.length; i++) {
        //if the gif we are checking matches one found in favorites, return true!
        if (favoriteGifs[i].embed_url == result.embed_url) {
            return true;
        }
    }
    return false;
}

//finds where in an array of locally formatted gifs this gif is in
//returns -1 if it is not found
function indexOfLocalGif(gifs, result) {
    for (let i = 0; i < gifs.length; i++) {
        //we simply just check if the image url is the same to determine if the gif is the same
        if (gifs[i].embed_url == result.embed_url) {
            return i;
        }
    }
    return -1;
}

//loads favorited gifs from local storage
function loadFavorites() {
    let favoritesString = localStorage.getItem(favoritesKey);
    let favorites = JSON.parse(favoritesString);
    if (favorites) {
        favoriteGifs = favorites;
    }
}

//saves favorited gifs in local storage 
function saveFavorites() {
    let favoritesStringified = JSON.stringify(favoriteGifs)
    localStorage.setItem(favoritesKey, favoritesStringified);
}

//displays favorited gifs in the fav section
function refreshFavorites() {
    displayName = "favorites";
    favoriteGifsOnPage = [];
    document.querySelector("#" + displayName + "-gifs-display-grid").innerHTML = "";
    placeGifsInDisplay(favoriteGifs);
}

//when the user clicks the favorite button, this adds the gif to their favorites
//refreshes the favorites section, and saves their favorites
function favoriteGif(target) {
    let parent = target.parentElement.parentElement;
    let result = convertPageGifToLocal(parent);
    //if the gif is not already a favorite
    if (!isAFavoriteGif(result)) {
        //fill in the fav button and show feedback
        fillInButton(target);
        showMessage("Favorited!");

        //add gif to favorites and save!
        favoriteGifs.push(result);
        saveFavorites();
        refreshFavorites();
    }
}

//converts a locally formatted gif into html code that can be displayed on the page
function convertLocalGifToPage(result) {
    return `<div class='gif-display-block'>` +
        `<img src='${result.image_url}' title = '${result.id}' class='gif-display'>` +
        `<div class='gif-rating'>Rating: ${result.rating.toUpperCase()}</div>` +
        `<div class="favorite-button-display">` +
        `<button class='favorite-button-hollow' onclick="favoriteGif(event.target)">&#9734;</button>` +
        `<button class='favorite-button-filled' onclick="unfavoriteGif(event.target)">&#9733;</button>` +
        `</div>` +
        `<button class='copy-link-button' onclick="copyLink('${result.embed_url}')">Copy Link</button>` +
        `<button class='view-original-button' onclick="window.open('${result.url}','_blank');">View Full</button>` +
        `<div class="hidden-embed-url">${result.embed_url}</div>` +
        `<div class="hidden-url">${result.url}</div>` +
        `</div>`;
}

//converts a gif's html content into a local format that can be saved in local storage
//parent is the gif display block that contains a gif's info
function convertPageGifToLocal(parent) {
    return {
        image_url: parent.querySelector(".gif-display").src,
        id: parent.querySelector(".gif-display").title,
        rating: parent.querySelector(".gif-rating").innerHTML.substring(8, parent.querySelector(".gif-rating").innerHTML.length),
        embed_url: parent.querySelector(".hidden-embed-url").innerHTML,
        url: parent.querySelector(".hidden-url").innerHTML
    }
}

//grabs only the data needed from the raw "giphy/online" format of the gif 
//and puts it in a 'local' format that can be saved in local storage
//returns this newly formatted gif
function convertOnlineGifToLocal(result) {
    return {
        image_url: result.images.fixed_height.url,
        id: result.id,
        rating: result.rating.toUpperCase(),
        embed_url: result.embed_url,
        url: result.url
    }
}

//converts an entire array of online-formatted gifs to grab only the data needed
function convertOnlineGifArrayToLocal(results) {
    for (let i = 0; i < results.length; i++) {
        results[i] = convertOnlineGifToLocal(results[i]);
    }
}

//Removes a gif from the users favorites, as well are making favorite button on all
//instances of the gif by hollowed out
//target is the button that was clicked
function unfavoriteGif(target) {
    let parent = target.parentElement.parentElement;
    let result = convertPageGifToLocal(parent);
    let index = indexOfLocalGif(favoriteGifs, result);
    //if the gif is favorited
    if (index != -1) {
        //reset the button and show the user feedback
        hollowOutButton(target);
        showMessage("Unfavorited!");

        //remove the gif from favorites
        favoriteGifs.splice(index, 1);
        //save the new list of favorites and refresh the fav section
        saveFavorites();
        refreshFavorites();

        //hollow out the fav button on any instance of that gif in trending or search
        index = indexOfLocalGif(trendingGifs, result);
        if (index != -1)
            hollowOutButton(trendingGifsOnPage[index].querySelector(".favorite-button-filled"));
        index = indexOfLocalGif(searchGifs, result);
        if (index != -1)
            hollowOutButton(searchGifsOnPage[index].querySelector(".favorite-button-filled"));
    }
}

//sets the favorite button to be filled in, so the user can click it and UNfavorite that gif
//target is the button that was clicked
function fillInButton(target) {
    target.style.opacity = 0;
    target.style.visibility = "hidden";
    target.parentElement.querySelector(".favorite-button-filled").style.opacity = 1;
    target.parentElement.querySelector(".favorite-button-filled").style.visibility = "visible";
    target.parentElement.parentElement.style.borderColor = "#ffd900";
}

//sets the favorite button to be hollowed out, so the user can click it and favorite that gif
//target is the button that was clicked
function hollowOutButton(target) {
    target.style.opacity = 0;
    target.style.visibility = "hidden";
    target.parentElement.querySelector(".favorite-button-hollow").style.opacity = 1;
    target.parentElement.querySelector(".favorite-button-hollow").style.visibility = "visible";
    target.parentElement.parentElement.style.borderColor = "white";
}

//copies a link to the user's clipboard and shows the user a feedback message
//link is the url to the gif we want to copy
function copyLink(link = " ") {
    //creates an area of text in the document
    const linkArea = document.createElement('textarea');
    //makes its value our url link
    linkArea.value = link;
    //add it to the doc and select it
    document.body.appendChild(linkArea);
    linkArea.select();
    //copy the selected region to the clipboard, then remove it from our doc
    document.execCommand("copy");
    document.body.removeChild(linkArea);

    //show feedback to user that the copy was successful
    showMessage("Copied!");
}

//shows our message box and then hides it after a second
function showMessage(message) {
    //get our message box
    messageBox = document.querySelector(".message");
    //set its text to our custom message
    messageBox.innerHTML = message;

    //show the message box!
    messageBox.style.opacity = 1;
    messageBox.style.visibility = "visible";
    messageBox.style.transform = "scaleY(1)";

    //after about a second, hide the message box again
    setTimeout(hideMessage, 900);
}

//hides our message box
function hideMessage() {
    //get our message box and hide it
    messageBox = document.querySelector(".message");
    messageBox.style.opacity = 0;
    messageBox.style.visibility = "hidden";
    messageBox.style.transform = "scaleY(0)";
}


//When clicking one of the 3 tab buttons, call this to open that button's content section.
//sectionName is the name of the section to open.
function openSection(sectionName) {
    // hide all content panels and make them play a "shrinking"/"flattening" animation
    let tabContentAll = document.querySelectorAll(".tab-content");
    for (let i = 0; i < tabContentAll.length; i++) {
        tabContentAll[i].style.transform = "scaleX(0)";
        tabContentAll[i].style.opacity = 0;
        tabContentAll[i].style.visibility = "hidden";
        tabContentAll[i].style.overflow = "hidden";
    }

    // remove all buttons from being "active"
    let tabButtons = document.querySelectorAll(".tab-button");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }
    activeSection = sectionName;
    //get our newly active panel
    let newActiveTab = document.querySelector("#" + sectionName + "-content");
    // fade in the current panel,
    newActiveTab.style.transform = "scaleX(1)";
    newActiveTab.style.opacity = 1;
    newActiveTab.style.visibility = "visible";
    newActiveTab.style.overflow = "visible";
    newActiveTab.style.height = "100%";
    //and make its button 'active'
    document.querySelector("#" + sectionName + "-tab-button").className += " active";
    setTimeout(resizeShownContent, 100);
}

//make sure we are resizing our scroll height whenever something
//happens that could affect it
window.addEventListener('resize', resizeShownContent);
window.addEventListener('scroll', resizeShownContent);
window.addEventListener('fullscreenchange', resizeShownContent);
window.addEventListener('fullscreenerror', resizeShownContent);

//creates a simple delayed loop that resizes our shown content
//to make sure our sticky elements fit in the right position
function resizeShwonContentWithTimer(){
    resizeShownContent();
    setTimeout(resizeShwonContentWithTimer, 100);
}

//In order for the "sticky" position of the nav bar to work, i have to adjust the scroll height of the page
//this method does that automatically by calculating the height of the current active section
function resizeShownContent() {
    //get our active section
    let section = document.querySelector("#" + activeSection + "-content");
    if (section != null) {
        //make its height 100%
        section.style.height = "1";

        //set our entire 'shown-content' section's pixel height equal to the
        //scroll height of our active section
        document.querySelector("#shown-content").style.height = section.scrollHeight + "px";
        //revert our height change to the active section
        section.style.height = "0";
    }
}

//When an error happens with getting our links, print out a message
function dataError(e) {
    console.log("An error occurred");
}