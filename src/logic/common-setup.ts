import type { App } from 'vue'

export function setupApp(app: App) {
  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = {
    context: '',
  }

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)
}

export const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

export function applyTheme(mediaQuery: MediaQueryList | MediaQueryListEvent) {
  if (mediaQuery.matches) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}
