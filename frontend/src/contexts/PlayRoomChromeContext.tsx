import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PlayRoomChromeContextValue = {
  immersive: boolean;
  setImmersive: (value: boolean) => void;
  toggleImmersive: () => void;
  openMenu: () => void;
  registerOpenMenu: (fn: () => void) => void;
};

const PlayRoomChromeContext = createContext<PlayRoomChromeContextValue | null>(
  null
);

export function PlayRoomChromeProvider({ children }: { children: ReactNode }) {
  const [immersive, setImmersive] = useState(false);
  const [openMenuFn, setOpenMenuFn] = useState<(() => void) | null>(null);

  const registerOpenMenu = useCallback((fn: () => void) => {
    setOpenMenuFn(() => fn);
  }, []);

  const openMenu = useCallback(() => {
    openMenuFn?.();
  }, [openMenuFn]);

  const toggleImmersive = useCallback(() => {
    setImmersive((previous) => !previous);
  }, []);

  const value = useMemo(
    () => ({
      immersive,
      setImmersive,
      toggleImmersive,
      openMenu,
      registerOpenMenu,
    }),
    [immersive, openMenu, registerOpenMenu, toggleImmersive, setImmersive]
  );

  return (
    <PlayRoomChromeContext.Provider value={value}>
      {children}
    </PlayRoomChromeContext.Provider>
  );
}

export function usePlayRoomChrome() {
  const ctx = useContext(PlayRoomChromeContext);
  if (!ctx) {
    throw new Error("usePlayRoomChrome must be used within PlayRoomChromeProvider");
  }
  return ctx;
}

export function usePlayRoomChromeOptional() {
  return useContext(PlayRoomChromeContext);
}
