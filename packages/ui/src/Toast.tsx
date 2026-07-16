"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Toast (components/toast.md) — a brief, transient confirmation of a low-stakes action that carries
 * NOTHING the user must keep (no reference numbers, never errors — those are Alerts). It is
 * announced via aria-live="polite" without stealing focus, and auto-dismisses.
 *
 * Provided as a context so any component can raise one; the region lives once near the app root.
 */
interface ToastMessage {
  id: number;
  variant: "success" | "info";
  message: ReactNode;
}

interface ToastContextValue {
  /** Raise a transient confirmation. Never pass anything the user must keep. */
  toast: (message: ReactNode, variant?: "success" | "info") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // A monotonic counter would use Date.now(); keep a simple incrementing id in state instead.
  const [nextId, setNextId] = useState(1);

  const toast = useCallback(
    (message: ReactNode, variant: "success" | "info" = "success") => {
      setNextId((id) => {
        setToasts((current) => [...current, { id, variant, message }]);
        return id + 1;
      });
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="gov-toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDone={() => setToasts((c) => c.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: ToastMessage; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`gov-toast gov-toast--${toast.variant}`}>
      <span aria-hidden="true">{toast.variant === "success" ? "✓" : "ℹ"}</span>
      {toast.message}
    </div>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within a <ToastProvider>.");
  return value;
}
