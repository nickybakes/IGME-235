import { loadTextXHR } from "./utils";

function updateTaffyOutput(e) {
    document.querySelector("#output-1").innerHTML = e.target.responseText;
}

function updateVikingOutput(e) {
    document.querySelector("#output-2").innerHTML = e.target.responseText;
}

document.querySelector("#button-1").onclick = () => { loadTextXHR("../data/taffy-facts.txt", updateTaffyOutput) };
document.querySelector("#button-2").onclick = () => { loadTextXHR("../data/viking-facts.txt", updateVikingOutput) };
