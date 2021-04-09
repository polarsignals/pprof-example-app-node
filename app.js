const express = require('express')
const pprof = require('pprof')
const app = express()
const port = 3000

pprof.heap.start(512 * 1024, 64);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/debug/pprof/heap', (req, res) => {
    const profile = pprof.heap.profile()
    pprof.encode(profile)
        .then((buf) => res.send(buf))
        .catch((err) => res.send(err))
});
app.get('/debug/pprof/profile', async (req, res) => {
    try {
        const profile = await pprof.time.profile({
            durationMillis: 10000,    // time in milliseconds for which to
            // collect profile.
        });
        pprof.encode(profile)
            .then((buf) => res.send(buf))
            .catch((err) => res.send(err))
    } catch (e) {
        res.send('error profiling: ' + e)
    }
});
app.listen(port, () => {
    console.log(
        `📈 http application telemetry ready on http://localhost:${port}`,
    );
});
