/* eslint-disable */
const shelljs = require("shelljs");

shelljs.rm("-rf", "./lib/chromium-data");
shelljs.mkdir("./lib/chromium-data");

shelljs.cp("-R", "./src/whatsapp-output", "./lib");
shelljs.rm("-f", "./lib/whatsapp-output/.gitignore");
