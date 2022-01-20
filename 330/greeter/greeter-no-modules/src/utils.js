const meaningOfLife = 42;
const defaultName = "Mr. X";
//let temp = "utils.js temp value"; // can not have 2 `temp` variables

const doubleIt = val =>  val * 2;

const formatGreeting = (greeting, name, forcefully) => {
  const recipient  = name ? name : defaultName;
  const str = `${greeting} ${recipient}`;
  return forcefully ? `${str.toUpperCase()}!` : str;
};

//export { defaultName, doubleIt, formatGreeting, temp };
// everything is public!