# SimpleLogs + React

A plain React app (Vite) instrumented with
[`@simplelogs/react`](https://www.npmjs.com/package/@simplelogs/react). The
same setup works in Create React App, Remix, React Router or any other React
root.

The whole integration is one provider. Everything else in this repo is the demo
around it.

**If you use Next.js, use
[`@simplelogs/next`](https://github.com/SimpleLogs/simplelogs-next-example)
instead** — it covers the browser and the server in one install.

## Setup

You need a **client key** — SimpleLogs dashboard → **Settings → API Keys**.

```bash
cp .env.example .env     # paste your client key into VITE_SIMPLELOGS_CLIENT_KEY
npm install
npm run dev              # http://localhost:5174
```

Add `http://localhost:5174` to the key's allowed origins in Settings → API
Keys. Client keys are origin-locked, so nothing is recorded until you do.

Requires Node 20 or newer.

## The integration

One provider at the root — [`src/main.jsx`](src/main.jsx):

```jsx
import { SimpleLogsProvider } from "@simplelogs/react";

<SimpleLogsProvider config={{ clientKey: import.meta.env.VITE_SIMPLELOGS_CLIENT_KEY }}>
  <App />
</SimpleLogsProvider>
```

That is it. A plain React app has no server render, so the provider configures
the SDK on mount.

## What you get without writing any logging code

As soon as the provider mounts:

- **Page views**, including soft navigations
- **Web Vitals** — FCP, LCP, TTFB, CLS
- **Uncaught errors** and unhandled promise rejections

## What this app adds on top

[`src/App.jsx`](src/App.jsx) demonstrates the hooks:

| API | What it does |
|---|---|
| `useSimpleLogs()` | The logger — `log`, `start`, `end`, `record` |
| `usePageLoadTime({ touchpoint })` | Times a screen under a name you choose, rather than its URL |
| `useTimedCallback(fn, { touchpoint })` | Times an async call; on error the timing is still recorded, then the error rethrows |
| `identify()` / `clearIdentity()` | Attaches a user after login, releases them on logout |

`useComponentMountTime()` and `useWebVitals()` are also available.

## Routers

Soft navigations are picked up from `pushState` and `popstate`, so React
Router, TanStack Router and plain `history` all work with no adapter and no
router-specific integration.

## Which key goes in the browser

The **client** key, and only ever that one.

Vite exposes variables prefixed `VITE_` to the bundle, and that prefix is the
boundary you want: the client key is public by design and origin-locked under
Settings → API Keys, while the **server** key must never reach a page. Do not
prefix the server key with `VITE_`.

## Session replay

Off in this example. `enabled` is read at runtime, so no bundler can eliminate
rrweb on it — the SDK imports it dynamically, and in a production build it
lands in its own lazy chunk that is simply never fetched. What the flag saves
is the download, not the build output.

```jsx
config={{ clientKey: "...", sessionReplay: { enabled: true } }}
```

## Adding a backend

Frontend and backend packages are complementary, not alternatives. If this app
talks to an Express or Node API, instrument that too: the SDK's patched `fetch`
forwards page, session and trace headers on same-origin requests, so a slow API
call shows up **inside** the page's trace rather than as an unattached server
span. Neither side has to pass an id explicitly.

## Other examples

| Your app | Example | Package |
|---|---|---|
| React (Vite, CRA, Remix, React Router) | **this repo** | `@simplelogs/react` |
| Plain HTML / any framework | [simplelogs-vanilla-example](https://github.com/SimpleLogs/simplelogs-vanilla-example) | `@simplelogs/browser` |
| Next.js | [simplelogs-next-example](https://github.com/SimpleLogs/simplelogs-next-example) | `@simplelogs/next` |
| Express | [simplelogs-express-example](https://github.com/SimpleLogs/simplelogs-express-example) | `@simplelogs/express` |
| Node, any other server | [simplelogs-node-example](https://github.com/SimpleLogs/simplelogs-node-example) | `@simplelogs/node` |
