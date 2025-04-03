module.exports = {
    mode: 'jit', // Enable Just-In-Time mode
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      fontFamily: {
        primary: 'Poppins',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
      },
      extend: {},
    },
    plugins: [],
  };