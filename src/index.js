import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import "./index.css";
import App from "./App";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.01,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
