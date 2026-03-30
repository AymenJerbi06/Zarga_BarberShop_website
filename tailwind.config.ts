import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Poppins", "sans-serif"],
      },
      colors: {
        accent: "#111111",
        "accent-soft": "#5f5f5f",
        "bg-main": "#f7f4ef",
        "bg-section": "#ffffff",
        "border-subtle": "#ddd7ce",
      },
    },
  },
  plugins: [],
};

export default config;
