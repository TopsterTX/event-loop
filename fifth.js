const myPromise = (delay) =>
  new Promise((res, rej) => {
    setTimeout(res, delay);
  });
setTimeout(() => console.log("in setTimeout1", "// 2"), 1000);
myPromise(1000).then((res) => console.log("in Promise 1", "// 3"));
setTimeout(() => console.log("in setTimeout2", "// 1"), 100);
myPromise(2000).then((res) => console.log("in Promise 2", "// 6"));
setTimeout(() => console.log("in setTimeout3", "// 7"), 2000);
myPromise(1000).then((res) => console.log("in Promise 3", "// 4"));
setTimeout(() => console.log("in setTimeout4", "// 5"), 1000);
myPromise(5000).then((res) => console.log("in Promise ", "// 8"));
