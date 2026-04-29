/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#dc2626', // Red 600
          hover: '#b91c1c',   // Red 700
          light: '#ef4444',   // Red 500
        },
        dark: {
          base: '#000000',    // Pure Black
          surface: '#171717', // Neutral 900
          border: '#262626',  // Neutral 800
        }
      },
      backgroundImage: {
        'vp-logo': "url('/logo-vp.jpg')",
      }
    },
  },
  plugins: [],
}
