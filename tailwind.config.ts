import scrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        "hover-hover": { raw: "(hover: hover)" },
      },
      keyframes: {
        bottomUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        bottomUp:
          "bottomUp 0.5s cubic-bezier(0, 0, 0.2, 1), fadeIn 0.5s cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],
};
export default config;
