console.log(1, "// 1");

setTimeout(() => console.log(2, "// 5"));

Promise.reject(3).catch(console.log); // 3

new Promise((resolve) => setTimeout(resolve)).then(() =>
  console.log(4, "// 6")
);

Promise.resolve(5).then(console.log); // 4

console.log(6, "// 2");

setTimeout(() => console.log(7, "// 7"), 0);
