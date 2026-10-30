import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./pwa";
import App from "./App";
import { ErrorBoundary } from "@/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Register the service worker for offline/installable PWA support.
// See public/sw.js for exactly what is (and is not) cached.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Non-fatal: app still works online without the service worker.
    });
  });
}
