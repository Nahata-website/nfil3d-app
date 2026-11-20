import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { authReady, signOutEverywhere, watchAuth } from '@/lib/auth';

export type User = { name: string; contact: string; method: 'google' | 'apple' } | null;
export type CartItem = { id: number; qty: number };
export type Upload = { id: string; title: string; notes: string; createdAt: string };

type State = {
  ready: boolean;
  onboarded: boolean;
  user: User;
  cart: CartItem[];
  printer: string | null;
  printQueue: string[];
  saved: number[];
  uploads: Upload[];
  quizPoints: number;
};

const initial: State = {
  ready: false,
  onboarded: false,
  user: null,
  cart: [],
  printer: null,
  printQueue: [],
  saved: [],
  uploads: [],
  quizPoints: 0,
};

const KEY = 'nfil3d-app-state-v1';

type Ctx = State & {
  finishOnboarding: (user: User) => void;
  signOut: () => void;
  addToCart: (id: number, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  pairPrinter: (key: string | null) => void;
  queuePrint: (title: string) => void;
  toggleSaved: (id: number) => void;
  addUpload: (u: Omit<Upload, 'id' | 'createdAt'>) => void;
  addPoints: (n: number) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : {};
        if (authReady) delete saved.user; // restored from Firebase instead
        else if (saved.user && !['google', 'apple'].includes(saved.user.method)) saved.user = null; // old test-login profiles
        setS((prev) => ({ ...prev, ...saved, ready: true }));
      })
      .catch(() => setS((prev) => ({ ...prev, ready: true })));
  }, []);

  // Firebase is the source of truth for who is signed in.
  useEffect(() => {
    if (!authReady) return;
    return watchAuth((u) => setS((p) => ({ ...p, user: u, onboarded: p.onboarded || !!u })));
  }, []);

  useEffect(() => {
    if (!s.ready) return;
    const { ready, ...persist } = s;
    AsyncStorage.setItem(KEY, JSON.stringify(persist)).catch(() => {});
  }, [s]);

  const api = useMemo<Ctx>(
    () => ({
      ...s,
      finishOnboarding: (user) => setS((p) => ({ ...p, onboarded: true, user })),
      signOut: () => {
        signOutEverywhere();
        setS((p) => ({ ...p, user: null }));
      },
      addToCart: (id, qty = 1) =>
        setS((p) => {
          const found = p.cart.find((c) => c.id === id);
          const cart = found ? p.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c)) : [...p.cart, { id, qty }];
          return { ...p, cart };
        }),
      setQty: (id, qty) =>
        setS((p) => ({ ...p, cart: qty <= 0 ? p.cart.filter((c) => c.id !== id) : p.cart.map((c) => (c.id === id ? { ...c, qty } : c)) })),
      clearCart: () => setS((p) => ({ ...p, cart: [] })),
      pairPrinter: (key) => setS((p) => ({ ...p, printer: key, printQueue: key ? p.printQueue : [] })),
      queuePrint: (title) => setS((p) => ({ ...p, printQueue: [...p.printQueue, title] })),
      toggleSaved: (id) => setS((p) => ({ ...p, saved: p.saved.includes(id) ? p.saved.filter((x) => x !== id) : [...p.saved, id] })),
      addUpload: (u) =>
        setS((p) => ({ ...p, uploads: [{ ...u, id: String(Date.now()), createdAt: new Date().toISOString() }, ...p.uploads] })),
      addPoints: (n) => setS((p) => ({ ...p, quizPoints: p.quizPoints + n })),
    }),
    [s]
  );

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
