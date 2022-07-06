const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    colors: {
      gray: colors.stone,
      primary: colors.amber,
      secondary: colors.violet,
      white: colors.white,
    }
  },
  variants: {},
  plugins: [],
};
