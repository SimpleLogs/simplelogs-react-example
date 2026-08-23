import { useEffect, useState } from "react";
import {
  useSimpleLogs,
  usePageLoadTime,
  useTimedCallback,
  identify,
  clearIdentity,
} from "@simplelogs/react";

export default function App() {
  const [status, setStatus] = useState("ready");
  const logger = useSimpleLogs();

  // --- Time this screen's load ---------------------------------------------
  // Page views and Web Vitals are already captured automatically. This adds a
  // timing named for the screen rather than for the URL.
  usePageLoadTime({ touchpoint: "dashboard/load" });

  // --- Wrap an async operation in a timing ---------------------------------
  // The hook keys each invocation, so overlapping calls stay separate timings.
  // If the callback throws, the error is recorded and then rethrown — your own
  // error handling still runs.
  const loadReport = useTimedCallback(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { total: 4200 };
    },
    { touchpoint: "dashboard/report-fetch" },
  );

  // --- Attach a user --------------------------------------------------------
  // Call after login, and on any load that restores a session. Activity from
  // before the user identified is attributed retroactively.
  useEffect(() => {
    identify({
      userId: "user_123",
      email: "ada@example.com",
      groupId: "acme",
      traits: { plan: "pro" },
    });

    // clearIdentity() on logout rotates the anonymous id, so the next visitor
    // on this browser is not attributed to the previous one.
    return () => clearIdentity();
  }, []);

  return (
    <main style={styles.main}>
      <h1>React</h1>
      <p>
        One provider at the root, in <code>src/main.jsx</code>. Page views and
        Web Vitals are already being captured — open the network tab and look
        for requests to <code>/enqueue</code>.
      </p>

      <button
        style={styles.button}
        onClick={() => {
          logger.log({
            touchpoint: "dashboard/button-click",
            level: "info",
            message: "Clicked the log button",
          });
          setStatus("logged dashboard/button-click");
        }}
      >
        Send a log
      </button>

      <button
        style={styles.button}
        onClick={async () => {
          const report = await loadReport();
          setStatus(`report loaded (${report.total}) and timed`);
        }}
      >
        Run a timed operation
      </button>

      <pre style={styles.out}>{status}</pre>
    </main>
  );
}

const styles = {
  main: { fontFamily: "system-ui, sans-serif", maxWidth: "42rem", margin: "4rem auto", padding: "0 1rem", lineHeight: 1.6 },
  button: { font: "inherit", padding: "0.5rem 1rem", margin: "0.25rem 0.25rem 0.25rem 0", cursor: "pointer" },
  out: { background: "#f4f4f5", padding: "1rem", borderRadius: 6, overflowX: "auto" },
};
