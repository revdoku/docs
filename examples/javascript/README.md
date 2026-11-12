# JavaScript examples

From `examples/`, follow the [shared setup](../), then run:

```sh
node --env-file=.env javascript/create-bucket.js 'acme-docs'
node --env-file=.env javascript/read-tickets.js
node --env-file=.env javascript/quotas-and-retries.js
```

Node.js 22+ provides fetch and `.env` loading; no package install is needed to
run these JavaScript examples. The shared guide covers attachment downloads,
file uploads, ticket events, permissions, expected output, and retries.

These files are generated from the matching TypeScript examples. Make changes
there and run `npm ci && npm run build` from `examples/` to regenerate them.
