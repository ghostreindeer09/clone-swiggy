
module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        console: "readonly"
      },
    },
  },
  require("eslint/js").configs.recommended,
];

