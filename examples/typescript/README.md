# TypeScript examples

From `examples/`, follow the [shared setup](../), then compile and run:

```sh
npm ci
npm run build
node --env-file=.env javascript/create-bucket.js 'acme-docs'
node --env-file=.env javascript/read-tickets.js
npm run check
```

The `.ts` files here compile into `../javascript/`. Both directories implement
the same workflows. The shared guide includes all five commands, ticket events, permissions,
expected output, and quota handling. There is no Revdoku SDK dependency.
