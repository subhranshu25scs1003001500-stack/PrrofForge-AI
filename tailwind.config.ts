import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090D16",
        foreground: "#F1F5F9",
        command: {
          950: "#06080E",
          900: "#090D16",
          850: "#0D1322",
          800: "#131B2E",
          700: "#1E2A44",
          600: "#2B3A5C",
          500: "#475569",
        },
        cyber: {
          cyan: "#00F2FE",
          cyanGlow: "rgba(0, 242, 254, 0.25)",
          violet: "#8B5CF6",
          violetGlow: "rgba(139, 92, 246, 0.25)",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "command-grid": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        glow: {
          "0%": { opacity: "0.4", filter: "drop-shadow(0 0 8px rgba(0,242,254,0.3))" },
          "100%": { opacity: "1", filter: "drop-shadow(0 0 16px rgba(0,242,254,0.7))" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

