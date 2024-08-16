/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '770px',    // Small devices (phones)
      md: '920px',    // Medium devices (tablets)
      lg: '1120px',   // Large devices (desktops)
      xl: '1280px',   // Extra large devices
      '2xl': '1536px' // 2X Extra large devices
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
};
