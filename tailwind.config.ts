import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '320px',   // Extra small devices
      'sm': '640px',   // Small devices (mobile)
      'md': '768px',   // Medium devices (tablets)
      'lg': '1024px',  // Large devices (laptops)
      'xl': '1280px',  // Extra large devices (desktops)
      '2xl': '1536px', // 2X large devices (large desktops)
      '3xl': '2560px', // 3X large devices (ultra-wide)
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#faf8f4',
          100: '#f5f0e8',
          200: '#ebe0d1',
          300: '#e0d0ba',
          400: '#d5c0a3',
          500: '#cab08c',
          600: '#bf9f75',
          700: '#b48f5e',
          800: '#a97f47',
          900: '#9e6f30',
        },
        brand: {
          50: '#faf8f4',
          100: '#f5f0e8',
          200: '#ebe0d1',
          300: '#E6D3B3', // Main brand color
          400: '#d5c0a3',
          500: '#cab08c',
          600: '#bf9f75',
          700: '#b48f5e',
          800: '#a97f47',
          900: '#9e6f30',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size for mobile
      },
      minWidth: {
        'touch': '44px', // Minimum touch target size for mobile
      },
    },
  },
  plugins: [],
};
export default config;
