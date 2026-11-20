# Working in simplelogs-react-example

This repo demonstrates `@simplelogs/react` (provider and hooks) in a plain
React app on Vite. The integration is `src/main.jsx`; `src/App.jsx` shows the
hooks.

## House style

Each installable SDK package has one standalone example repo: vanilla
(`@simplelogs/browser`, port 5173), react (`@simplelogs/react`, 5174), next
(`@simplelogs/next`, 5175), express (`@simplelogs/express`, 3100) and node
(`@simplelogs/node`, 3200). The five share one style, so keep it:

- npm, not pnpm. Plain JS: no TypeScript, Tailwind or ESLint.
- A `.env.example` with the SimpleLogs variables the app reads.
- A README covering setup, key handling and the reasoning behind each choice,
  with a cross-link table to the other examples at the end.

## Dependencies

These repos are the first thing a new user runs.

- Never use a `file:` or absolute-path dependency.
- Pin `@simplelogs/*` only to versions npm already publishes; check with
  `npm view @simplelogs/react versions`.
- An SDK change is released before an example bumps to it. If the example
  change has to be written first, open it as a draft that names the SDK PR it
  waits on.

## Environment variables

Vite exposes only `VITE_`-prefixed variables to the browser bundle. This app
reads `VITE_SIMPLELOGS_CLIENT_KEY` (the client key) and Vite's built-in
`import.meta.env.MODE` (as `environment`). Never give the server key a `VITE_`
prefix.

## Verifying a change

- `npm install && npm run build` must pass.
- Run `npm run dev` (http://localhost:5174) and check telemetry in a real
  browser, in the network tab's requests to `/enqueue`; `curl` runs no
  JavaScript. Any non-empty client key makes the SDK send, so those requests
  show it fires even with the placeholder key; nothing is recorded until a real
  key lists `http://localhost:5174` in its allowed origins.
- `SIMPLELOGS_API_ENDPOINT` has no effect here. The SDK reads it only on its
  server path, so in the browser, requests go to the SDK's built-in endpoint.
