import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface State {
  error: Error | null;
}

// Shows the error on screen instead of a blank white page.
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#b91c1c" }}>কিছু একটা ভুল হয়েছে / Something went wrong</h2>
        <p style={{ wordBreak: "break-word", fontSize: 14 }}>{String(this.state.error.message)}</p>
        <button
          style={{ marginTop: 12, padding: "10px 16px", borderRadius: 8, border: "1px solid #b91c1c", background: "#fff" }}
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}
