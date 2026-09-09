import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',   // Extra small devices (phones)
        'sm': '640px',   // Small devices (landscape phone)
        'md': '768px',   // Tablets
        'lg': '1024px',  // Small laptops
        'xl': '1280px',  // Desktop
        '2xl': '1536px', // Large desktop
      },
      colors: {
        'paybancx': {
          'primary': '#285858',
          'action': '#285858',
          'secondary': '#2F6060',
          'success': '#3F8F63',
          'accent': '#FF6845',
          'bg': '#F4F3F9',
          'text-dark': '#171717',
          'text-muted': '#858585',
          'placeholder': '#B5B5B5',
          'border': '#E5E5E5',
          'overlay-text': '#FFFFFF',
          'soft-green': '#E8F5E8',
          'soft-purple': '#F0E8F8',
          'soft-blue': '#E0F0F8',
          'soft-yellow': '#FFF4C8',
          'soft-red': '#F8E0E0',
        },
        'teal': {
          'primary': '#285858',
          'dark': '#234B4B',
          'light': '#F4F3F9',
        },
        'slate': {
          'dark': '#171717',
          'medium': '#858585',
          'light': '#FFFFFF',
        },
        'pastel': {
          'yellow': '#FFF4C8',
          'pink': '#F8E0E0',
          'blue': '#E0F0F8',
          'cyan': '#E8F5E8',
        },
      },
      borderRadius: {
        'card': '12px',
        'btn': '12px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      fontFamily: {
        'sans': ['Inter', 'Geist', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': '11pt',
        'header': '18pt',
      },
    },
  },
  plugins: [],
};
export default config;
