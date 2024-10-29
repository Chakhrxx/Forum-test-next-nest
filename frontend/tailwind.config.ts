import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Add Castoro here
        castoro: ["Castoro", "serif"],
        "ibm-plex": ["IBM Plex Sans", "sans-serif"],
      },
      colors: {
        primary: "#191919",
        secondary: "#A0AFBA",
        danger: "#ef4444",
        "green-100": "#D8E9E4",
        "green-500": "#243831",
        "green-300": "#2B5F44",
        golden: "#C5A365",
        "grey-100": "#BBC2C0",
        "grey-300": "#939494",
        success: "#49A569",
      },
    },
  },
  plugins: [],
};
export default config;
