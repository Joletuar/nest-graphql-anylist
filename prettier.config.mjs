// @ts-check

const config = {
  quoteProps: 'consistent',
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  endOfLine: 'lf',

  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  importOrder: [
    '^node:/(.*)$',
    ' ',
    '^@nestjs/(.*)$',
    ' ',
    '<THIRD_PARTY_MODULES>',
    ' ',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};

export default config;
