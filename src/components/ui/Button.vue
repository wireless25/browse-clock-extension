<template>
  <button
    class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-out
           bg-gradient-to-r from-blue-400 to-blue-500 text-white
           hover:from-blue-500 hover:to-blue-600 hover:shadow-lg
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
           active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </button>
</template>
