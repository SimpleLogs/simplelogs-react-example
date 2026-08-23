import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SimpleLogsProvider } from "@simplelogs/react";
import App from "./App.jsx";

// This is the whole integration: wrap the tree once.
//
// It is the same provider a Next.js app puts in its root layout — there is no
// React-only variant. In a plain React app there is no server render, so it
// simply configures the SDK on mount.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SimpleLogsProvider
      config={{
        clientKey: import.meta.env.VITE_SIMPLELOGS_CLIENT_KEY,
        environment: import.meta.env.MODE,
        // Session replay is opt-in. Turning it on dynamically imports rrweb,
        // so a build that leaves it off never pays for the bytes.
        sessionReplay: { enabled: false },
      }}
    >
      <App />
    </SimpleLogsProvider>
  </StrictMode>,
);
