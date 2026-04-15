const fs = require("node:fs");

const source = fs.readFileSync("src/app.js", "utf8");

if (source.includes("BUILD_FAIL")) {
  console.error("build failed in src/app.js: found BUILD_FAIL marker");
  process.exit(1);
}

console.log("build passed");
