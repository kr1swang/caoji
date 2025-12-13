import { baseConfig } from "@caoji/config/eslint.config.js";

export default [
  ...baseConfig,
  {
    ignores: ['dist/*', 'node_modules/*']
  }
];
