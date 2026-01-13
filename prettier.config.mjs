/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "es5",
  printWidth: 100,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["tv", "cn", "cva"],
  overrides: [
    {
      files: "*.vue",
      options: {
        parser: "vue",
      },
    },
  ],
};

export default config;
