//import { formatGreeting, doubleIt } from "./utils.js";
//import * as utils from  "./utils.js"; // OR give the imported functions a namespace

let temp = "main.js temp value";

// need window.onload again
window.onload = () => {
  const input = document.querySelector("#input-firstname");
  const output = document.querySelector("#output");
  const cbForcefully = document.querySelector("#cb-forcefully");

  const helloButton = document.querySelector("#btn-hello");
  const goodbyeButton = document.querySelector("#btn-goodbye");

  let forcefully = cbForcefully.checked;

  //cbForcefully.onchange = () => forcefully = cbForcefully.checked;
  cbForcefully.onchange = e => forcefully = e.target.checked;
  helloButton.onclick = () => output.innerHTML = formatGreeting("Hello",input.value.trim(),forcefully);
  goodbyeButton.onclick = () => output.innerHTML = formatGreeting("Goodbye",input.value.trim(),forcefully);

  console.log("formatGreeting('Fred') = ", formatGreeting('Hey there'));
  console.log("doubleIt(10) = ", doubleIt(10));
  console.log("temp = ", temp);
  //console.log("utils.temp = ", utils.temp); // named import - no such thing!
  console.log("defaultName = ", defaultName);
  console.log("meaningOfLife = ", meaningOfLife);
};