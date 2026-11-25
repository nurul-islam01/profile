"use client";

import * as React from "react";
import { profile } from "@/content/profile";

const city = profile.location.split(",")[0];

/** Current time where Nurul is, e.g. "Dhaka 11:42 PM". Renders nothing until mounted. */
export function LocalTime() {
  const [now, setNow] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: profile.timeZone,
      hour: "numeric",
      minute: "2-digit",
    });
    const update = () => setNow(fmt.format(new Date()));
    update();
    const t = window.setInterval(update, 30_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <p className="min-w-[9rem]">
      {now ? (
        <>
          {city} <time>{now}</time>
        </>
      ) : null}
    </p>
  );
}
