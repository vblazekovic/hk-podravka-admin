
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        klub: {
          red: "#D21E2B",
          gold: "#C6A753",
          white: "#FFFFFF"
        }
      }
    }
  },
  plugins: []
};
