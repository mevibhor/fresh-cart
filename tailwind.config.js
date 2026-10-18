/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        default: ["Montserrat", "sans-serif"],
        heading: ["League Spartan", "sans-serif"],
      },
    },
  },
  plugins: [],
};
