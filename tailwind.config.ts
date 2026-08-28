import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#1E2430", cream: "#FFFDF7", chalk: "#F4F2EA", cobalt: "#006BFF", lime: "#E5F52F", pink: "#FF5E8A", sky: "#4DD8FF", lilac: "#B7A4FF" }, fontFamily: { display: ["var(--font-fraunces)", "serif"], sans: ["var(--font-instrument)", "sans-serif"], body: ["var(--font-inter)", "sans-serif"], mono: ["var(--font-mono)", "monospace"] } } },
  plugins: [],
} satisfies Config;
