"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false pendant le rendu serveur et l'hydratation, true ensuite (données du navigateur disponibles). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
