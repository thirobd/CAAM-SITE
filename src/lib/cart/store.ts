// Panier stocké dans le navigateur (localStorage), exposé comme un « external store »
// React (useSyncExternalStore) : pas de décalage d'hydratation, synchro entre onglets.
// Les prix enregistrés ici servent à l'affichage ; le serveur les recalcule à la commande.

export type CartLine = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  sizeMl: number;
  unitPriceXof: number;
  /** Plafond connu au moment de l'ajout (stock et limite par commande). */
  maxQuantity: number;
  quantity: number;
  tint: string;
  image?: string;
};

// v3 : identifiants de contenance issus de Supabase (les anciens paniers sont ignorés).
const STORAGE_KEY = "caam-cart-v3";
const EMPTY: CartLine[] = [];

let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartLine[]).filter((l) => l && typeof l.variantId === "string") : [];
  } catch {
    return [];
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Stockage indisponible (navigation privée…) : le panier reste en mémoire.
  }
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  lines = read();
  listeners.forEach((l) => l());
}

const clamp = (q: number, max: number) => Math.max(0, Math.min(q, max));

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (listeners.size === 1) window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot(): CartLine[] {
    if (lines === null) lines = read();
    return lines;
  },
  getServerSnapshot(): CartLine[] {
    return EMPTY;
  },
  /** Ajoute un article ; renvoie la quantité réellement ajoutée (0 si plafond atteint). */
  add(line: Omit<CartLine, "quantity">, quantity: number): number {
    const current = cartStore.getSnapshot();
    const existing = current.find((l) => l.variantId === line.variantId);
    const before = existing?.quantity ?? 0;
    const after = clamp(before + quantity, line.maxQuantity);
    if (after === before) return 0;
    commit(
      existing
        ? current.map((l) => (l.variantId === line.variantId ? { ...l, ...line, quantity: after } : l))
        : [...current, { ...line, quantity: after }],
    );
    return after - before;
  },
  setQuantity(variantId: string, quantity: number) {
    const current = cartStore.getSnapshot();
    commit(
      quantity <= 0
        ? current.filter((l) => l.variantId !== variantId)
        : current.map((l) => (l.variantId === variantId ? { ...l, quantity: clamp(quantity, l.maxQuantity) } : l)),
    );
  },
  remove(variantId: string) {
    commit(cartStore.getSnapshot().filter((l) => l.variantId !== variantId));
  },
  clear() {
    commit([]);
  },
};
