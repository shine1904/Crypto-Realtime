import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        binance: {
          black: '#0B0E11',
          yellow: '#F0B90B',
          gray: '#1E2329',
          green: '#0ECB81',
          red: '#F6465D',
          textGray: '#848E9C',
        },
      },
      fontFamily: {
        // Sử dụng font Inter mà chúng ta đã khai báo trong layout.tsx
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
export default config;