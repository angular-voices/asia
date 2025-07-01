/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],
    theme: {
      extend: {
        colors: {
          'angular-pink': '#ff4081',
          'angular-red': '#f44336',
          'angular-purple': '#9c27b0',
          'angular-blue': '#2196f3',
        },
        fontFamily: {
          'inter': ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  } 