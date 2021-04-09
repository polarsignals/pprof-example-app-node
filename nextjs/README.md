# Pprof Next.js

Example of how to add pprof http endpoints to a Next.js app.

Most of this app is a generated example, and the important part on how this is instrumented is located in [`main.js`](./main.js). The key is to use one `express` server to host the Next.js app, and one to serve the pprof endpoints.

> Note it is not strictly necessary to have two endpoints, but it is convenient to not accidentally expose the pprof endpoint to the public. If desired, the endpoints can be on the same `express` server as well.