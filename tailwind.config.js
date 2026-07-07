/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#FFC61A",
          light: "#FFDD66",
          dark: "#D9A400",
        },
        charcoal: {
          DEFAULT: "#222222",
          soft: "#2E2E2E",
        },
        cream: "#FAF8F3",
        sand: "#F3EEE4",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.12) translate(-1.5%, -1.5%)" },
        },
        fadeup: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slidein: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        kenburns: "kenburns 6s ease-out forwards",
        fadeup: "fadeup 0.7s ease-out forwards",
        slidein: "slidein 0.6s ease-out forwards",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
