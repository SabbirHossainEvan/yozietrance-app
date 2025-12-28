/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./*.{js,jsx,ts,tsx}",          // Root files: index.tsx, chat.tsx, etc.
    "./app/**/*.{js,jsx,ts,tsx}",   // app/ folder and subfolders like (tabs)
    "./screens/**/*.{js,jsx,ts,tsx}", // screens/ folder
    "./components/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}", // modules/ if it has .tsx files
    "./global.tsx"                  // Explicitly include global.tsx
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
