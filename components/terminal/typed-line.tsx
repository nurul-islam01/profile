"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { Caret } from "./caret";
import { cn } from "@/lib/cn";

type TypedLineProps = {
  text: string;
  /** Characters per second */
  speed?: number;
  /** Delay before starting (ms) */
  delay?: number;
  className?: string;
  /** Show caret while typing */
  caret?: boolean;
  /** Fires once the line is complete */
  onDone?: () => void;
};

export function TypedLine({
  text,
  speed = 45,
  delay = 0,
  className,
  caret = true,
  onDone,
}: TypedLineProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState(reduced ? text : "");
  const [done, setDone] = React.useState(Boolean(reduced));

  React.useEffect(() => {
    if (reduced) {
      setShown(text);
      setDone(true);
      onDone?.();
      return;
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
          onDone?.();
        }
      }, 1000 / speed);
    }, delay);
    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay, reduced, onDone]);

  return (
    <span className={cn("font-mono", className)}>
      <span>{shown}</span>
      {caret && !done ? <Caret className="text-terminal-fg" /> : null}
    </span>
  );
}
