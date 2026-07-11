import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8FA",
        ink: "#14161C",
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1B1E26",
        },
        border: {
          DEFAULT: "#E4E6EB",
          dark: "#2A2E38",
        },
        signal: {
          DEFAULT: "#2451FF",
          dim: "#E8ECFF",
          darkDim: "#1C2547",
        },
        success: {
          DEFAULT: "#1C8A5F",
          dim: "#E4F5EC",
          darkDim: "#123A2B",
        },
        warn: {
          DEFAULT: "#C77A1F",
          dim: "#FBF0DE",
          darkDim: "#3A2C10",
        },
        danger: {
          DEFAULT: "#C43D3D",
          dim: "#FBEAEA",
          darkDim: "#3A1616",
        },
      },
      fontFamily: {
        display: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
