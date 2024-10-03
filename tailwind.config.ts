import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "link-color": "var(--link-color)",
        "link-hover-color": "var(--link-hover-color)",
        "soft-bg": "var(--soft-bg)",
        "soft-text-color": "var(--soft-text-color)",
      },
      textColor: {
        "link-color": "var(--link-color)",
        "link-hover-color": "var(--link-hover-color)",
      },
      backgroundColor: {
        "soft-bg": "var(--soft-bg)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
