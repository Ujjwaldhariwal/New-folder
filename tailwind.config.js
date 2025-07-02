/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        'primary-chart': 'var(--primary-chart-color)',
        'secondary-chart': 'var(--secondary-chart-color)',
        'primary-border': 'var(--primary-border-color)',
        'secondary-border': 'var(--secondary-border-color)',
        '--bar-axis-color': 'var(----bar-axis-color)',
        body: 'var(--body-color)',
        cardHeader: 'var(--card-Header-color)',
        card: 'var(--card-color)',
        'bar-axis': 'var(--barAxis-color)',
        NavActive: 'var(--nav-active-color)',
      },
      plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
      ],
    },
  },
  variants: {
    extend: {},
  },
  
};
