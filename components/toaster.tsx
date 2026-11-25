"use client";

import { Toaster as Sonner } from "sonner";

// Sonner reads its colours from CSS variables on the toaster element;
// point them at the site's tokens so toasts follow the theme.
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      style={
        {
          "--normal-bg": "rgb(var(--raised))",
          "--normal-border": "rgb(var(--line))",
          "--normal-text": "rgb(var(--fg))",
          fontFamily: "var(--font-sans)",
        } as React.CSSProperties
      }
    />
  );
}
