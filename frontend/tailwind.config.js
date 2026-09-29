/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#fdfbf7',
        ink: '#2d2d2d',
        'muted-paper': '#e5e0d8',
        'accent-red': '#ff4d4d',
        'secondary-blue': '#2d5da1',
        postit: {
          yellow: '#fff9c4',
          pink: '#ffd1dc',
          green: '#d4edda',
          blue: '#d0e8ff',
        },
      },
      fontFamily: {
        heading: ['Kalam', 'cursive', 'sans-serif'],
        body: ['Patrick Hand', 'cursive', 'sans-serif'],
        hand: ['Patrick Hand', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'hard-sm': '2px 2px 0px 0px #2d2d2d',
        'hard': '4px 4px 0px 0px #2d2d2d',
        'hard-lg': '8px 8px 0px 0px #2d2d2d',
        'hard-red': '4px 4px 0px 0px #ff4d4d',
        'hard-blue': '4px 4px 0px 0px #2d5da1',
      },
      borderRadius: {
        'wobbly': '255px 15px 225px 15px / 15px 225px 15px 255px',
        'wobbly-sm': '180px 10px 160px 12px / 12px 170px 10px 180px',
        'wobbly-md': '240px 18px 230px 14px / 14px 230px 18px 240px',
        'wobbly-badge': '90px 12px 80px 10px / 10px 85px 12px 90px',
      },
    },
  },
  plugins: [],
}
