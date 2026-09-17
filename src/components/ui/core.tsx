"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { Dice5 } from "lucide-react";
import { ShuffMascot } from "@/components/mascot/shuff-mascot";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="Shuffle">
      <span className="brand__mark"><Dice5 size={compact ? 19 : 22} strokeWidth={2.8} /></span>
      <span>shuffle</span>
    </span>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "dark" }) {
  return <button className={`button button--${variant} ${className}`} {...props}>{children}</button>;
}

export function Modal({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button, input, textarea, select")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  function keepFocusInside(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") onClose();
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])") ?? []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1)!;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-label={label} onKeyDown={keepFocusInside}>
        {children}
      </section>
    </div>
  );
}

export function EmptyState({ mood, title, text, action }: { mood: "sleep" | "confused" | "happy"; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <ShuffMascot mood={mood} size="medium" />
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
