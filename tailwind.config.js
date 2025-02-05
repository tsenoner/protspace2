/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.stories.{js,ts,jsx,tsx}",
    "./components/**/*.stories.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      display: ["responsive"],
      colors: {
        primary: "#0065BD",
        secondaryLight: "#005293",
        secondaryDark: "#003359",
        accentOrange: "#E37222",
        accentGreen: "#A2AD00",
        accentLightBlue: "#98C6EA",
        accentBlue: "#64A0C8",
        accentBeige: "#DAD7CB",
        backgroundDark: "#13005A",
        backgroundLight: "#DAD7CB",
        textPrimary: "#333333",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  variants: {
    extend: {},
  },
};
