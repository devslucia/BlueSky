/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#F0F7FC',
          100: '#E1F0FA',
          200: '#C3E1F5',
          300: '#A8CCE8',
          400: '#7AB3D9',
          500: '#5B8DB8',
          600: '#4A7AA3',
          700: '#3D6689',
          800: '#34546F',
          900: '#2C4256',
        },
        cloud: {
          50: '#FAFCFF',
          100: '#F0F7FC',
          200: '#E5F1FA',
        },
        navy: {
          50: '#1A2D45',
          100: '#0F1B2D',
          200: '#2A4060',
          300: '#3A5080',
        },
      },
      backgroundImage: {
        'cloud-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cpath fill='%23A8CCE8' fill-opacity='0.08' d='M61.4,-46.2C76.3,-34.1,85.3,-15.5,83.8,2.4C82.3,20.3,70.3,37.3,55.9,50.6C41.5,63.9,24.7,73.5,4.9,75.1C-14.9,76.7,-37.7,70.3,-54.9,56.4C-72.1,42.5,-83.7,21.1,-83.3,0.3C-82.9,-20.5,-70.5,-40.7,-54.5,-54.9C-38.5,-69.1,-18.9,-77.3,1.3,-78.5C21.5,-79.7,43.1,-73.9,61.4,-46.2Z' transform='translate(100 200)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
