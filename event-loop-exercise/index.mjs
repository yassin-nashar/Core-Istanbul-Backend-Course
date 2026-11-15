console.log("1 - Start");

setTimeout(() => {
  console.log("2 - Timer A");

  Promise.resolve().then(() => {
    console.log("3 - Promise inside Timer");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("4 - Promise A");

  setTimeout(() => {
    console.log("5 - Timer B");
  }, 0);
});

console.log("6 - End");
