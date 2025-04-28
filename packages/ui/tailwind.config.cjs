// @ts-check
/** @type {import('tailwindcss').Config} */
const sharedConfig = require("@repo/tailwind-config");

module.exports = {
  // Extend the shared config 
  ...sharedConfig,
  // Override the content array to include UI package source
  content: ["./src/**/*.{js,ts,jsx,tsx}"]
}