import type { Config } from "tailwindcss";

// Colors are CSS variables holding RGB channels (see app/globals.css) so
// Tailwind's opacity modifiers work: `bg-bg/80`, `text-fg/45`, etc.
const rgb = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.ts",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        bg: rgb("--bg"),
        raised: rgb("--raised"),
        line: rgb("--line"),
        fg: rgb("--fg"),
        muted: rgb("--muted"),
        accent: rgb("--accent"),
        "accent-fg": rgb("--accent-fg"),
        danger: rgb("--danger"),
      },
      maxWidth: {
        page: "78rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        reveal: {
          "0%": { clipPath: "inset(0 0 100% 0 round 0.75rem)" },
          "100%": { clipPath: "inset(0 0 0 0 round 0.75rem)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        reveal: "reveal 0.95s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
