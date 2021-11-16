# NodeJS pprof example

This repository demonstrates examples of how nodejs applications can be instrumented with pprof.

There are two examples:

* Plain `express` app, see [`app.js`](./app.js).
* Next.js app, see the [`nextjs/` directory](./nextjs/).

## Deploy on Kubernetes

```bash
kubectl run pprof-example-app-node --image=quay.io/polarsignals/pprof-example-app-node:v0.0.1 --port=3000
```
