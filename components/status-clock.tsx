"use client";

import * as React from "react";

function fmt(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function StatusClock() {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTime(fmt(new Date()));
    const id = setInterval(() => setTime(fmt(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <span
        suppressHydrationWarning
        aria-hidden
        className="hidden font-mono text-[11px] text-terminal-muted lg:inline-flex"
      >
        <span className="text-terminal-prompt">●</span>
        <span className="ml-1.5 opacity-0">00:00:00</span>
      </span>
    );
  }

  return (
    <span
      className="hidden font-mono text-[11px] text-terminal-muted lg:inline-flex lg:items-center"
      aria-label={`Local time ${time}`}
      title="Local time"
    >
      <span className="text-terminal-accent">●</span>
      <span className="ml-1.5 tabular-nums">{time}</span>
    </span>
  );
}
