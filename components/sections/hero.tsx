"use client";

import * as React from "react";
import Link from "next/link";
import { WindowChrome } from "@/components/terminal/window-chrome";
import { TypedLine } from "@/components/terminal/typed-line";
import { Caret } from "@/components/terminal/caret";
import { profile } from "@/content/profile";

export function Hero() {
  const [step, setStep] = React.useState(0);
  const next = React.useCallback(() => setStep((s) => s + 1), []);

  return (
    <section
      id="top"
      className="relative px-6 pt-16 pb-20 sm:pt-24 sm:pb-28"
      aria-labelledby="hero-heading"
    >
      <h1 id="hero-heading" className="sr-only">
        {profile.name} — {profile.role}
      </h1>
      <div className="mx-auto max-w-3xl">
        <WindowChrome title={`${profile.username}@dev: ~`}>
          <div className="space-y-2 leading-relaxed">
            {/* whoami */}
            <div>
              <span className="text-terminal-accent">{profile.username}@dev</span>
              <span className="text-terminal-muted">:</span>
              <span className="text-terminal-prompt">~</span>
              <span className="text-terminal-muted">$ </span>
              <TypedLine text="whoami" speed={28} caret={step === 0} onDone={next} />
            </div>

            {step >= 1 && (
              <>
                <div className="pl-0">
                  <TypedLine
                    text={`> ${profile.name}`}
                    speed={50}
                    delay={150}
                    caret={false}
                    className="text-2xl sm:text-3xl font-semibold text-terminal-fg"
                    onDone={next}
                  />
                </div>
              </>
            )}

            {step >= 2 && (
              <div className="pl-0 text-terminal-muted">
                <TypedLine
                  text={`> role: "${profile.role}"`}
                  speed={70}
                  delay={100}
                  caret={false}
                  onDone={next}
                />
              </div>
            )}

            {step >= 3 && (
              <div className="pl-0 text-terminal-muted">
                <TypedLine
                  text={`> company: "${profile.company}" · ${profile.location}`}
                  speed={80}
                  delay={100}
                  caret={false}
                  onDone={next}
                />
              </div>
            )}

            {step >= 4 && (
              <div className="pl-0 text-terminal-muted">
                <TypedLine
                  text={`> stack: [next.js, go, node, react, postgres, docker]`}
                  speed={80}
                  delay={100}
                  caret={false}
                  onDone={next}
                />
              </div>
            )}

            {step >= 5 && (
              <div className="pt-4">
                <span className="text-terminal-accent">{profile.username}@dev</span>
                <span className="text-terminal-muted">:</span>
                <span className="text-terminal-prompt">~</span>
                <span className="text-terminal-muted">$ </span>
                <Caret className="text-terminal-fg" />
              </div>
            )}
          </div>
        </WindowChrome>

        <p className="mt-8 font-sans text-base sm:text-lg leading-relaxed text-terminal-muted max-w-2xl">
          {profile.headline}
        </p>

        <div className="mt-6 font-mono text-sm leading-loose">
          <p className="text-terminal-muted">
            <span className="text-terminal-comment"># try one:</span>
          </p>
          <ul className="space-y-1">
            <li>
              <Link
                href="#projects"
                className="group inline-flex items-baseline gap-2 text-terminal-muted transition-colors hover:text-terminal-fg"
              >
                <span className="text-terminal-prompt">$</span>
                <span className="text-terminal-fg group-hover:underline group-hover:decoration-terminal-prompt group-hover:underline-offset-4">
                  ./view-work
                </span>
                <span className="text-terminal-comment opacity-0 transition-opacity group-hover:opacity-100">
                  # jump to projects
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="group inline-flex items-baseline gap-2 text-terminal-muted transition-colors hover:text-terminal-fg"
              >
                <span className="text-terminal-prompt">$</span>
                <span className="text-terminal-fg group-hover:underline group-hover:decoration-terminal-prompt group-hover:underline-offset-4">
                  ./send-message
                </span>
                <span className="text-terminal-comment opacity-0 transition-opacity group-hover:opacity-100">
                  # open contact form
                </span>
              </Link>
            </li>
            <li>
              <a
                href={profile.resumeUrl}
                className="group inline-flex items-baseline gap-2 text-terminal-muted transition-colors hover:text-terminal-fg"
              >
                <span className="text-terminal-prompt">$</span>
                <span className="text-terminal-fg group-hover:underline group-hover:decoration-terminal-prompt group-hover:underline-offset-4">
                  cat resume.pdf
                </span>
                <span className="text-terminal-comment opacity-0 transition-opacity group-hover:opacity-100">
                  # download résumé
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
