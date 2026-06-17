module.exports = {
  extends: [
    // 'stylelint-config-standard',
    // 'stylelint-config-rational-order',
    'stylelint-config-standard-scss',
    'stylelint-8-point-grid',
  ],
  plugins: [
    'stylelint-order',
  ],
  rules: {
    'plugin/8-point-grid': {
      base: 4,
      allowlist: ['2px', '1px', '0.0625rem'],
      customProperties: ['size', 'position'],
      ignorelist: ['width', 'height'],
    },

    // 'plugin/8-point-grid': {
    //   base: 4,
    //   allowlist: ['2px', '1px', '0.0625rem'],
    //   ignorelist: ['width', 'height']
    // },

    // "number-leading-zero": "always",
    // "selector-no-qualifying-type": [
    //   true,
    //   {
    //     "ignore": ["attribute"]
    //   }
    // ],

    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'screen',
        ],
      },
    ],
    'declaration-empty-line-before': [
      'always',
      {
        ignore: [
          'after-comment',
          'after-declaration',
          'first-nested',
          'inside-single-line-block',
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          'theme',
        ],
      },
    ],

    'no-duplicate-selectors': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': true,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'composes',
        ],
      },
    ],
    'scss/comment-no-empty': null,
    // 'selector-class-pattern': [
    //   '^(slds|app)(-[a-z0-9_-]+|)$',
    //   {
    //     severity: 'error',
    //     resolveNestedSelectors: true,
    //   },
    // ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [
          'global',
        ],
      },
    ],
  },
}
