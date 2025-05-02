/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      primary: "#202020",
      secondary: "#303030",
      tertiary: "#707070",
      quaternary: "#CFCFCF",
      quinary: "#F0EACE",
      senary: "#EEEEEE",
      septenary: "#323232",
      octonary: "#252525",
      nonary: "#3A3A3A",
      decenary: "#454545",
      undecenary: "#FFFFFF",
    },
    fontFamily: {
      cormorant: ["CormorantGaramond"],
      cormorantItalic: ["CormorantGaramond-Italic"],
      ebgaramond: ["EBGaramond"],
      ebgaramondItalic: ["EBGaramond-Italic"],
      inter: ["Inter"],
      interItalic: ["Inter-Italic"],
    },
  },
  plugins: [],
};
