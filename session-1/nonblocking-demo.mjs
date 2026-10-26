import { readFile } from "node:fs";

console.log("1. Start");

readFile("data.txt", "utf8", (error) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log("3. File loaded");
});

console.log("2. Continue working");
