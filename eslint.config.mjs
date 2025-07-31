import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    overrides: {
      'vue/max-attributes-per-line': ['error', {
        multiline: {
          max: 1,
        },
        singleline: {
          max: 1,
        },
      }],
    },
  },
})
