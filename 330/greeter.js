// 1 - get a reference to the button
const helloButton = document.querySelector("#btn-hello");
const goodbyeButton = document.querySelector("#btn-goodbye");
// 2 - add a click event to button that calls a `sayPhrase` function
helloButton.onclick = function(e) {sayPhrase("Hello", e);};
goodbyeButton.onclick = (e) => sayPhrase("Adios", e);


// Changes the text on screen to say a phrase with the entered name
function sayPhrase(phrase, e) {
    let firstName = document.querySelector("#input-firstname").value;
    let lastName = document.querySelector("#input-lastname").value;
    if (!firstName)
        firstName = "Doctor";
    if (!lastName)
        lastName = "X";
    document.querySelector("#output").innerHTML = `${phrase} ${firstName} ${lastName}!`;
}