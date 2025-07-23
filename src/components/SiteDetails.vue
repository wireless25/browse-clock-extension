<script setup>
import { ref } from 'vue'

defineProps({
  site: {
    type: Object,
    required: true,
  },
})

const showSessions = ref(false)

function toggleSessions() {
  showSessions.value = !showSessions.value
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const parts = []
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes % 60 > 0) {
    parts.push(`${minutes % 60}m`)
  }
  if (seconds % 60 > 0 && hours === 0) {
    // Only show seconds if less than a minute
    parts.push(`${seconds % 60}s`)
  }
  else if (seconds % 60 === 0 && parts.length === 0) {
    parts.push('0s') // Handle cases where total time is 0
  }
  return parts.join(' ')
}

function formatDateTime(isoString) {
  if (!isoString)
    return 'N/A'
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function getDomainIcon(domain) {
  try {
    const url = new URL(`https://${domain}`) // Prepend http to parse correctly
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
  }
  catch (error) {
    console.error('Invalid domain for favicon:', domain, error)
    return 'https://www.google.com/s2/favicons?domain=default&sz=64' // Fallback icon
  }
}
</script>

<template>
  <div
    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 dark:border-gray-700 dark:bg-dark"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img :src="getDomainIcon(site.domain)" alt="Favicon" class="mr-3 h-6 w-6 rounded-full">
        <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 md:text-xl">
          {{ site.domain }}
        </h4>
      </div>
      <div class="flex items-center">
        <span class="mr-4 text-base font-semibold text-blue-600 dark:text-blue-400">{{
          formatDuration(site.totalTime) }}</span>
        <button
          class="flex items-center rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          :aria-expanded="showSessions"
          :aria-controls="`sessions-${site.domain.replace(/\./g, '-')}`" @click="toggleSessions"
        >
          <svg
            v-if="!showSessions" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="site.lastVisited" class="mb-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
      Last visited: {{ formatDateTime(site.lastVisited) }}
    </div>

    <Transition name="fade-slide">
      <div
        v-if="showSessions" :id="`sessions-${site.domain.replace(/\./g, '-')}`"
        class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700"
      >
        <h5 class="mb-3 text-base font-medium text-gray-700 dark:text-gray-300">
          Sessions:
        </h5>
        <ul class="space-y-2">
          <li
            v-for="(session, index) in site.sessions" :key="index"
            class="flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-700"
          >
            <div class="flex-grow">
              <span class="font-medium text-gray-800 dark:text-gray-200">
                {{ formatDateTime(session.startTime) }} -
                {{ formatDateTime(session.endTime) }}
              </span>
            </div>
            <span
              class="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-800 dark:text-green-100"
            >{{
              formatDuration(session.duration) }}</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Transition styles for expanding/collapsing sessions */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.3s ease,
        max-height 0.3s ease;
    overflow: hidden;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    max-height: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    max-height: 500px;
    /* Adjust based on expected content height */
}
</style>
