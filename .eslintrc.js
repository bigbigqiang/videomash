module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: ['plugin:vue/recommended', '@vue/airbnb'],
    // https://eslint.org/docs/rules/
    rules: {
        'no-debugger': 'off',
        'no-console': 0,
        indent: [2, 4, { SwitchCase: 1 }],
        'max-len': ['error', { code: 180 }],
        'linebreak-style': 0,
        'arrow-parens': 0,
        'generator-star-spacing': 0,
        'operator-linebreak': ['error', 'before'],
        'eol-last': 0,
        'global-require': 0,
        semi: ['error', 'never'],
        'comma-dangle': ['error', 'only-multiline'],
        'no-underscore-dangle': 0,
        'space-before-function-paren': [0, 'always'],
        'keyword-spacing': 0,
        'no-new': 0,
        'default-case': 0,
        'no-unused-expressions': [
            'error',
            {
                allowShortCircuit: true,
                allowTernary: true,
            },
        ],
        'no-param-reassign': [
            'error',
            {
                props: false,
            },
        ],
        'no-plusplus': [
            'error',
            {
                allowForLoopAfterthoughts: true,
            },
        ],
        'no-confusing-arrow': [
            'error',
            {
                allowParens: true,
            },
        ],
        'no-mixed-operators': 0,
        'no-bitwise': 0,
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'import/first': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/named': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-duplicates': 'off',
        'import/no-cycle': 'off',
        'import/order': 'off',
        'import/no-self-import': 'off',
        'import/no-useless-path-segments': 'off',
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
        'vue/html-quotes': ['error', 'double'],
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': ['error', {
            singleline: 1,
            multiline: {
                max: 1,
                allowFirstLine: true
            }
        }],
        'vue/html-self-closing': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/require-default-prop': 'off',
        'vue/attribute-hyphenation': [2, 'never', { ignore: ['custom-prop'] }],
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
}
