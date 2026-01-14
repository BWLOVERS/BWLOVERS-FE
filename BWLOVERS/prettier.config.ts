import { type Config } from 'prettier';

const config: Config = {
  trailingComma: 'none',
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/index.css'
};

export default config;
