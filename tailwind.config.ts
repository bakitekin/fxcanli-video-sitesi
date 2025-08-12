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
        brand: {
          black: "#151313",
          orange: "#ff5734",
          purple: "#be94f5",
          yellow: "#fccc42",
          white: "#f7f7f5",
        },
      },
      fontFamily: {
        sans: ["Kodchasan", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
