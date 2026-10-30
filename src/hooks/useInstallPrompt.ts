import { useEffect, useState } from "react";
import { getPwaState, promptPwaInstall, subscribePwa } from "@/pwa";

export function useInstallPrompt() {
  const [state, setState] = useState(getPwaState);

  useEffect(() => {
    // Re-read immediately: the event may already have fired before this mounted.
    setState(getPwaState());
    return subscribePwa(() => setState(getPwaState()));
  }, []);

  return { canInstall: state.canInstall, installed: state.installed, promptInstall: promptPwaInstall };
}
