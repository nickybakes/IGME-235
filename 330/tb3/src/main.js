"use strict";

const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];

const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];

const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];

generateRandomizedTechnobabble();

//give the buttons' events of onClick calls to the generate function
document.querySelector("#my-button").onclick = () => generateRandomizedTechnobabble(1);
document.querySelector("#babble-button-5").onclick = () => generateRandomizedTechnobabble(5);

//picks and returns a random element from an array given thru parameter
function getRandomWord(words) {
    return words[[Math.floor(Math.random() * words.length)]];
}

//gets 3 randomized technobabble words to create the full technobabble statement
//amount = number of technobabbles to generate at once, default is 1
function generateRandomizedTechnobabble(amount = 1) {
    let babble = "";
    //loops through and generates the requested amount of babbles
    for(let i = 0; i < amount; i+=1){
        babble += `${getRandomWord(words1)} ${getRandomWord(words2)} ${getRandomWord(words3)}`;
        //splits up each babble with a break line, does not put one at the very end (could also do this with commas for a list-like thing)
        if(i < amount - 1)
            babble += "<br/>";
    }
    //finally, replace the output html with the babbles!
    document.querySelector("#output").innerHTML = babble;
}
