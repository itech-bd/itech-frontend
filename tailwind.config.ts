import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          deep: "var(--brand-primary-deep)",
          orange: "var(--brand-orange)",
          red: "var(--brand-red)",
          surface: "var(--surface-page)",
          strong: "var(--text-strong)",
          muted: "var(--text-muted)",
        },
      },
      boxShadow: {
        brand: "0 18px 40px rgba(41, 43, 134, 0.12)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
