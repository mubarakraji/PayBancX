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
        // PayBancX FinTech Color Palette (Updated)
        'paybancx': {
          'primary': '#1C3F3B',    // Deep Teal (Primary - Headers & Card Backgrounds)
          'action': '#1C3F3B',     // Deep Teal (Primary Buttons & Actions)
          'success': '#22C55E',    // Green (Success)
          'bg': '#F5F6F8',         // Soft Gray (App Background)
          'text-dark': '#333333',  // Dark Gray (Main text on light backgrounds)
          'text-muted': '#888888', // Medium Gray (Subtitles & Placeholders)
          'border': '#E2E8F0',     // Light Gray (Borders)
          'overlay-text': '#FFFFFF',  // Pure White (Text on dark/teal backgrounds)
        },
        // Legacy colors for backward compatibility
        'teal': {
          'primary': '#1C3F3B',
          'dark': '#152d2a',
          'light': '#F5F6F8',
        },
        'slate': {
          'dark': '#333333',
          'medium': '#888888',
          'light': '#FFFFFF',
        },
        'pastel': {
          'yellow': '#FFF4D9',
          'pink': '#FFE5EC',
          'blue': '#E5F0F7',
          'cyan': '#D0F0F8',
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
