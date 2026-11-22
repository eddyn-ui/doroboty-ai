import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type State = { failed: boolean };

/**
 * Replaces a blank page after an unexpected render error with a Polish message
 * and a reload action. Logs only the error name and message, never user text or state.
 */
export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error(`[DoRoboty] Render error: ${error.name}: ${error.message}`);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="prototype-panel" role="alert" style={{ maxWidth: 560, margin: "48px auto" }}>
        <h1>Coś poszło nie tak</h1>
        <p>
          Prototyp napotkał nieoczekiwany błąd. Zapisane dane zostają w tej przeglądarce. Przeładuj
          stronę. Jeśli błąd wróci, napisz do osoby, która udostępniła link.
        </p>
        <Button type="button" onClick={() => window.location.reload()}>
          Przeładuj stronę
        </Button>
      </main>
    );
  }
}
