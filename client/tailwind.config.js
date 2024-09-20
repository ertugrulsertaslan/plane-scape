/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fly: "fly 4s linear infinite",
      },
      keyframes: {
        fly: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      colors: {
        customBodyColor: "#e7dcff",
        customBgColor: "#f6f4f8",
      },
    },
  },
  plugins: [],
};
