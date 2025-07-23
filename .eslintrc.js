module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-return-await': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'import/no-cycle': 'off',
    'global-require': 'off',
    'arrow-body-style': 'off',
    'max-len': 'off',
    camelcase: 'off',
    'class-methods-use-this': 'off',
    'no-throw-literal': 'off',
    'no-useless-constructor': 'off',
    'max-classes-per-file': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'linebreak-style': [0, 'error', 'windows'],
    'object-curly-newline': [
      'error',
      {
        // "ObjectExpression": "always",
        ObjectPattern: { multiline: true },
      },
    ],
    'import/extensions': 'off',
  },
  globals: {
    TWEEN: true,
    THREE: true,
    $: true,
  },
};
