import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          bg: 'var(--tg-theme-bg-color, #fff)',
          text: 'var(--tg-theme-text-color, #000)',
          hint: 'var(--tg-theme-hint-color, #999)',
          link: 'var(--tg-theme-link-color, #2481cc)',
          button: 'var(--tg-theme-button-color, #2481cc)',
          buttonText: 'var(--tg-theme-button-text-color, #fff)',
          secondaryBg: 'var(--tg-theme-secondary-bg-color, #efeff3)',
        }
      },
    },
  },
  plugins: [],
};
export default config;
