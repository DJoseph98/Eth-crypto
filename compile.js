const fs = require("fs");
const path = require("path");
const solc = require("solc");

// compile code will go here

const inboxPath = path.join(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":Inbox"];
