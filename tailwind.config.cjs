/** @type {import('tailwindcss').Config} */
module.exports = {
  // purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  content: [
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
