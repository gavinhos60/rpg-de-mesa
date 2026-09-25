import { useCallback, useRef, useState } from "react";

export function floatingPopupStackOffset(stackIndex: number): {
  x: number;
  y: number;
} {
  const i = Math.max(0, stackIndex) % 8;
  return { x: 16 + i * 24, y: 12 + i * 20 };
}

const BASE_Z = 85;

export function useFloatingPopupStack<T extends object>() {
  type StackItem = T & { id: number };
  const seq = useRef(0);
  const [stack, setStack] = useState<StackItem[]>([]);

  const push = useCallback((entry: T) => {
    const id = ++seq.current;
    setStack((items) => [...items, { ...entry, id }]);
    return id;
  }, []);

  const close = useCallback((id: number) => {
    setStack((items) => items.filter((p) => p.id !== id));
  }, []);

  const closeWhere = useCallback((shouldRemove: (item: StackItem) => boolean) => {
    setStack((items) => items.filter((p) => !shouldRemove(p)));
  }, []);

  const activate = useCallback((id: number) => {
    setStack((items) => {
      const item = items.find((p) => p.id === id);
      if (!item) return items;
      return [...items.filter((p) => p.id !== id), item];
    });
  }, []);

  const zIndexFor = useCallback(
    (id: number) => {
      const index = stack.findIndex((p) => p.id === id);
      return index >= 0 ? BASE_Z + index : BASE_Z;
    },
    [stack]
  );

  const stackIndexFor = useCallback(
    (id: number) => Math.max(0, stack.findIndex((p) => p.id === id)),
    [stack]
  );

  return { stack, push, close, closeWhere, activate, zIndexFor, stackIndexFor };
}
