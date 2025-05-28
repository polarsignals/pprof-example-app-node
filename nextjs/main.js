// This is an example of an entrypoint js file that can be used to profile nextjs apps.

const { parse } = require('url');
const pprof = require('pprof');
const next = require('next');
const express = require('express');
const dev = process.env.NODE_ENV !== 'production';

pprof.heap.start(512 * 1024, 64);

const PUBLIC_HTTP_PORT = 3000;
const PRIVATE_HTTP_PORT = 3001;

const app = next({ dev });
const handle = app.getRequestHandler();
const publicServer = express();
const privateServer = express();

const nextAppHandler = (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // assets folder in public which are own files
    if (pathname.startsWith('/assets')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    handle(req, res, parsedUrl);
};

app.prepare().then(() => {
    // this is the endpoint we give for our metrics, in our cluster its never reachable from outside

    publicServer.all('*', (req, res) => {
        return nextAppHandler(req, res)
    })

    publicServer.listen(PUBLIC_HTTP_PORT, () => {
        console.log(
            `🚀 http application ready on http://localhost:${PUBLIC_HTTP_PORT}`,
        );
    });

});

privateServer.get('/debug/pprof/allocs', (req, res) => {
    const profile = pprof.heap.profile()
    pprof.encode(profile)
        .then((buf) => res.send(buf))
        .catch((err) => res.send(err))
});
privateServer.listen(PRIVATE_HTTP_PORT, () => {
    console.log(
        `📈 http application telemetry ready on http://localhost:${PRIVATE_HTTP_PORT}`,
    );
});
