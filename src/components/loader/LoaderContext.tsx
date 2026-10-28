import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const SESSION_KEY = "dishcult_loader_seen";

type LoaderState = {
  /** true once the loader starts its exit — use it to start hero/navbar entrance animations */
  done: boolean;
  finish: () => void;
};

const LoaderContext = createContext<LoaderState>({ done: true, finish: () => {} });

function hasSeenLoader(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<boolean>(hasSeenLoader);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setDone(true);
  }, []);

  return <LoaderContext.Provider value={{ done, finish }}>{children}</LoaderContext.Provider>;
}

export const useLoader = () => useContext(LoaderContext);
