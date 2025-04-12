/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    screens: {
      "3xl": { max: "2560px" },
      "2xl": { max: "1440px" },
      xl: { max: "1200px" },
      lg: { max: "1024px" },
      md: { max: "768px" },
      sm: { max: "640px" },
      xs: { max: "320px" },
    },
    // screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    container: {
      center: true,
      padding: "2rem",
      // screens: {
      //   "2xl": "1400px",
      // },
    },
    extend: {
      colors: {
        deep_orange: { 500: "#f15f30" },
        gray: {
          100: "#f5f5f5",
          400: "#c4c4c4",
          700: "#555555",
          900: "#191619",
          "50_01": "#fcfcfc",
        },
        black: {
          900: "#000000",
          "900_3f": "#0000003f",
          "900_77": "#00000077",
          "900_33": "#00000033",
        },
        white: { A700_63: "#ffffff63", A700: "#ffffff", A700_7f: "#ffffff7f" },
        orange: { 50: "#ffefdb", 300: "#e1b068" },
        teal: { 900: "#002d51" },
        cyan: { 900: "#003f71" },
        light_blue: { "900_01": "#00457d" },
        blue_gray: { 900: "#292e36", "900_01": "#252b42" },
        indigo: { 500: "#474bca", 900: "#1b317a" },
        red: { 50: "#fff2f2", 600: "#e64040" },
        amber: { 400: "#ffcc28" },
        green: { 300: "#96bb7c" },
      },
      boxShadow: {
        xs: "1px -2px  26px 0px #0000003f",
        sm: "0px 13px  19px 0px #00000011",
        md: "0px 7px  10px 0px #00000007",
        lg: "0px 4px  35px 0px #0000003f",
      },
      fontFamily: {
        plusjakartasans: "Plus Jakarta Sans",
        raleway: "Raleway",
        oswald: "Oswald",
        inter: "Inter",
        montserrat: "Montserrat",
        poppins: "Poppins",
      },
      opacity: { 0.1: 0.1 },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
};
