const express = require('express')
const pprof = require('pprof')
const app = express()
const port = 3000

pprof.heap.start(512 * 1024, 64);

const expensiveLoop = () => {
    for (let i = 0; i < 100000; i++) {}
}

app.get('/', (req, res) => {
    expensiveLoop()
    res.send('Hello World!')
})

app.get('/debug/pprof/allocs', (req, res) => {
    const profile = pprof.heap.profile()
    pprof.encode(profile)
        .then((buf) => res.send(buf))
        .catch((err) => res.send(err))
});
app.listen(port, () => {
    console.log(
        `📈 http application telemetry ready on http://localhost:${port}`,
    );
});
