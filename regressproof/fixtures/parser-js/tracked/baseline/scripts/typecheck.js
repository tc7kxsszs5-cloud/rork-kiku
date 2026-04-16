const fs = require("node:fs");

const source = fs.readFileSync("src/app.js", "utf8");

if (source.includes("TYPE_FAIL")) {
  console.error(`typecheck failed in src/app.js:12:3
error: Type 'number' is not assignable to type 'string'
  12 | const label = 42
     |   ^
at validateTypes (src/app.js:12:3)
at runTypecheck (scripts/typecheck.js:9:1)`);
  process.exit(1);
}

console.log("typecheck passed");
