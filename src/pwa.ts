// Captures the browser's one-time "beforeinstallprompt" event as soon as the
// app starts. The event fires early (before most pages mount), so listening
// only inside a page component misses it and the install button never shows.

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Listener = () => void;

let deferred: BeforeInstallPromptEvent | null = null;
let installed = window.matchMedia?.("(display-mode: standalone)").matches ?? false;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferred = e as BeforeInstallPromptEvent;
  notify();
});

window.addEventListener("appinstalled", () => {
  deferred = null;
  installed = true;
  notify();
});

export function subscribePwa(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPwaState() {
  return { canInstall: deferred !== null && !installed, installed };
}

export async function promptPwaInstall(): Promise<boolean> {
  if (!deferred) return false;
  const event = deferred;
  await event.prompt();
  const choice = await event.userChoice;
  deferred = null;
  notify();
  return choice.outcome === "accepted";
}
