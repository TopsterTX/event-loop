const fs = require('fs')

console.log('start')                                                              // Синхронная операци

setTimeout(() => {                                                      // Регистрируем колбэк в фазу "timers"
    console.log('setTimeout 1')
}, 0)

setImmediate(() => console.log('setImmediate'))                        // Регистрируем колбэк в фазу "check"

fs.readFile(__filename, () => {                                        // Регистрируем колбэк в фазу "poll"
    setTimeout(() => console.log("readFile setTimeout"), 0)
    setImmediate(() => console.log("readFile setImmediate"))
    process.nextTick(() => console.log("readFile next tick"))
})

Promise.resolve().then(() => {                                                    // Регистрируем колбэк в очередь "microtasks"
    console.log('Promise')
    process.nextTick(() => console.log('Promise next tick'))
})

process.nextTick(() => console.log("next tick"))                       // Регистрируем колбэк в очередь "nextTickQueue"

setTimeout(() => console.log("setTimeout 2"))                           // Регистрируем колбэк в фазу "timers"

console.log('end')                                                                // Синхронная операция

/*
    0. После того Node js запарсил наш код (перед тем как EventLoop начал работу) имеем следующий расклад:

    PHASES:
    1. timers:                          ["setTimeout 1", "setTimeout 2"],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [fs.readFile],
    5. check:                           ["setImmediate"],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   ["next tick"],
    2. microtasks:                      [Promise.resolve],
 */


/*
    1. EventLoop начал работу, в начале выполняет коллбеки в очереди "nextTickQueue"

    PHASES:
    1. timers:                          ["setTimeout 1", "setTimeout 2"],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [fs.readFile],
    5. check:                           ["setImmediate"],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   [],
    2. microtasks:                      [Promise.resolve],
 */

/*
    2. После того как очередь "nextTickQueue" опустела, EventLoop приступает к очереди "microtasks"

    PHASES:
    1. timers:                          ["setTimeout 1", "setTimeout 2"],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [fs.readFile],
    5. check:                           ["setImmediate"],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   ["Promise next tick"],
    2. microtasks:                      [],
 */

/*
    3. Задача из очереди "microtasks" добавила нам колбек в очередь "nextTickQueue", EventLoop вызывает его

    PHASES:
    1. timers:                          ["setTimeout 1", "setTimeout 2"],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [fs.readFile],
    5. check:                           ["setImmediate"],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   [],
    2. microtasks:                      [],
 */

/*
    4. После того как очереди с приоритетными задачами ("nextTickQueue", "microtasks") закончились
       EventLoop приступает к выполнению фаз. Первая на очереди фаза "timers" EventLoop вызывает все колбеки в ней
       После того как выполнил колбэки в фазе "timers", смотрит очереди на наличие задач (их нет)

    PHASES:
    1. timers:                          [],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [fs.readFile],
    5. check:                           ["setImmediate"],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   [],
    2. microtasks:                      [],
 */

/*
    5. Попадает в фазу "pendingCallbacks" не обнаруживает в ней колбэков, выходит, проверяет очереди на наличие задач,
       попадает в фазу "idle, prepare" там тоже ничего нету, выходит, и опять проверяет очереди,
       попадает в фазу "poll" ПРОВЕРЯЕТ НАЛИЧИЕ setImmediate ПЕРЕД ВЫПОЛНЕНИЕМ callback'ов в фазe "poll",
       следовательно выходит с фазы "poll", проверяет очереди, попадает в фазу "check", выполняет все коллбеки

    PHASES:
    1. timers:                          [],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [fs.readFile],
    5. check:                           [],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   [],
    2. microtasks:                      [],
 */

/*
    6. На этом закончился первый цикл EventLoop'а, далее всё начинается заново, в начале проверяются очереди на наличие
       задач, следом идёт выполнение колбеков в каждой фазе по очереди, при выходе с фазы проверяются очереди.
       EventLoop попадает в фазу "poll" выполняет колбэк

    PHASES:
    1. timers:                          ["readFile setTimeout"],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [],
    5. check:                           ["readFile setImmediate"],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   ["readFile next tick"],
    2. microtasks:                      [],
 */

/*
    7. Когда EventLoop выходит из фазы "poll" вызывает колбэк в очереди "nextTickQueue"

    PHASES:
    1. timers:                          ["readFile setTimeout"],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [],
    5. check:                           ["readFile setImmediate"],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   [],
    2. microtasks:                      [],
 */

/*
    8. Далее он попадает в фазу "check" -> вызывает колбэки -> проверяет очереди

    PHASES:
    1. timers:                          ["readFile setTimeout"],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [],
    5. check:                           [],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   [],
    2. microtasks:                      [],
 */

/*
    9. Цикл заканчивается, и начинается по новой с проверки очередей
    -> следом вызываются колбэки в фазе "timers"

    PHASES:
    1. timers:                          [],
    2. pendingCallbacks(I/O operating): [],
    3. idle, prepare:                   [],
    4. poll:                            [],
    5. check:                           [],
    6. closeCallbacks:                  [],

    QUEUES:
    1. nextTickQueue:                   [],
    2. microtasks:                      [],
 */

/*
    10. На этом выполнение EventLoop'а не заканчивается, он проверяет наличие колбэков во всех фазах и очередях
        если их нет, то он завершает свою работу
 */

/*  OUTPUT:
    (0)start
    (0)end
    (1)next tick
    (2)Promise
    (3)Promise next tick
    (4)setTimeout 1
    (4)setTimeout 2
    (5)setImmediate
    (7)readFile next tick
    (8)readFile setImmediate
    (9)readFile setTimeout
 */

/*
    NOTES
    1. Перед выполнением фазы "poll", EventLoop всегда проверяет наличие колбэков в фазе "check" и если
       Они есть выполняет их
    2. Т. к. колбэки I/O операций выполняются в фазе "poll", setImmediate в этих колбеках всегда будет
       выполняться раньше, чем setTimeout и setImmediate
 */