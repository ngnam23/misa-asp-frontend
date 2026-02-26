/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/views/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{vue,js,ts,jsx,tsx,mdx}',
    './src/App.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ca01c',
        111: '#111111',
        212: '#212121',
        '85f': '#85ff74',
        ff3: '#fff3',
        '31a': '#31ac00',
        '3b3c': '#3b3c3f',
        d2d3: '#d2d3d6',
        ece: '#eceef1',
        ef1: '#eeeff1',
        '35b': '#35bf22',
        ef1: '#eef1f5',
        c7: '#c7c7c7',
        e0e: '#e0e0e0',
        '8d9': '#8d9096',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
