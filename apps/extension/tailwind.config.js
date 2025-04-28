/** @type {import('tailwindcss').Config} */
const sharedConfig = require("@repo/tailwind-config");

module.exports = {
  // Extend the shared config
  ...sharedConfig,
  // Override content to include app specific paths
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ]
}