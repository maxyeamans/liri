// Get .env values into the app
require("dotenv").config();

// Hold the command for this round
const COMMAND = process.argv[2];

// Hold all of the Node arguments, minus the first three
const nodeArg = process.argv.slice(3);

console.log(nodeArg);

const COMMAND_ARG = nodeArg.join(" ");

console.log(COMMAND_ARG);