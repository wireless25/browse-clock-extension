declare module 'vue' {
  interface ComponentCustomProperties {
    $app: {
      context: string
    }
  }
}

// https://vuejs.org/guide/typescript/options-api.html#type-augmentation-placement
export {}
