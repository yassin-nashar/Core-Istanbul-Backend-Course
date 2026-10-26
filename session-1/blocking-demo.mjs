import { readFileSync } from "node:fs";

console.log("1. Start");

readFileSync("data.txt", "utf8");

console.log("2. File loaded");
console.log("3. Continue working");
