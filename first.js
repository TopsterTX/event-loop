console.log("start", "// 1");

const p = new Promise((res, rej) => {
  console.log("Start promise", "// 2");
  res();
});

p.then(() => {
  console.log("promise then", "// 4");
});

setTimeout(() => {
  console.log("2 sec", "// 6");
}, 2000);

setTimeout(() => {
  console.log("0 ms", "// 5");
}, 0);

console.log("end", "// 3");
