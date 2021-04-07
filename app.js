const express = require('express')
const pprof = require('pprof')
const app = express()
const port = 3000

pprof.heap.start(512 * 1024, 64);
// pprof.time.start(1000);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/cpu', (req, res) => {
    const f = fib(123)
    res.send(`fib(1234) = ${f}`)
})

const fib = (n) => {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2)
}

app.get('/memory', (req, res) => {
    let arr = Array(1e8).fill("some string");
    arr.reverse();
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    res.send(`We've used approximately ${used}MiB`)
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})

app.get('/debug/pprof/heap', (req, res) => {
    const profile = pprof.heap.profile()
    pprof.encode(profile)
        .then((buf) => res.send(buf))
        .catch((err) => res.send(err))
})

app.get('/debug/pprof/profile', (req, res) => {
    pprof.time.profile(10 * 1000 * 1000)
        .then((profile) => pprof.encode(profile))
        .then((buf) => res.send(buf))
        .catch((err) => res.send(err))
})
