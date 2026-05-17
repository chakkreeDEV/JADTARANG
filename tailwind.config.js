export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // แทนที่ yellow ด้วยสีแดงเลือดหมู
        primary: {
          50:  '#fdf2f2',
          100: '#fde8e8',
          400: '#8b1a1a',  // แดงเลือดหมูหลัก
          500: '#7a1515',
          600: '#6b1212',
          700: '#5a0f0f',
          800: '#4a0c0c',
          900: '#3b0909',
        },
      },
    },
  },
  plugins: [],
}