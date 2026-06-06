import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#0F2B3D",
          700: "#1A4A5C",
          500: "#2D6A7A",
          300: "#7BAFB8",
          100: "#E8F2F4",
        },
        accent: {
          600: "#B8863A",
          500: "#C9A24D",
          400: "#D4B56A",
          100: "#F5EDD8",
        },
        neutral: {
          950: "#0D0D0D",
          700: "#4A4A4A",
          500: "#767676",
          300: "#D4D4D4",
          100: "#F7F5F2",
          50: "#FDFCFA",
        },
        success: { 600: "#2D6A4E", 100: "#E6F4EC" },
        error: { 600: "#B42318", 100: "#FEF3F2" },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        cta: "0 4px 14px rgba(201, 162, 77, 0.30)",
        card: "0 4px 16px rgba(15, 43, 61, 0.08)",
      },
      maxWidth: {
        content: "1200px",
        prose: "720px",
      },
    },
  },
  plugins: [],
};

export default config;
