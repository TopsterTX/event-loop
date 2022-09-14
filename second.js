setTimeout(function timeout() {
  console.log("Таймаут //4");
}, 0);

let p = new Promise(function (resolve, reject) {
  console.log("Создание промиса // 1");
  resolve();
});

p.then(function () {
  console.log("Обработка промиса // 3");
});

console.log("Конец скрипта // 2");
