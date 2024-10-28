module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  plugins: [
    'html'
  ],
  'globals': {
    'wx': 0,
    'getCurrentPages': 0
  },
  'parser': 'babel-eslint',
  settings: {
    'html/html-extensions': ['.html', '.wpy', '.vue']
  },
  'rules': {
    'no-console': ['error', {allow: ['warn', 'log', 'error']}],
    'indent': [
      'warn',
      2
    ],
    'linebreak-style': [
      'warn',
      'unix'
    ],
    'quotes': [
      'warn',
      'single'
    ],
    'semi': [
      'warn',
      'always'
    ]
  }
}