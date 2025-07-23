<script setup lang="ts">
import { applyTheme, prefersDarkMode } from '~/logic/common-setup'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

// Initial check
applyTheme(prefersDarkMode)

// Listen for changes
prefersDarkMode.addEventListener('change', mql => applyTheme(mql))
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700 dark:bg-dark dark:text-gray-100">
    <Logo />
    <h1 class="text-2xl font-bold">
      BrowseClock
    </h1>
    <button class="btn mt-4" @click="openOptionsPage">
      Open Options
    </button>
  </main>
</template>
