<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { StorageData } from '../types/index'

const { site } = defineProps<{ site: StorageData['currentSession'], tabVisitedTime: string }>()

function formatDuration(ms: number): string {
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
    parts.push(`${seconds % 60}s`)
  }
  else if (seconds % 60 === 0 && parts.length === 0) {
    parts.push('0s')
  }
  return parts.join(' ')
}

function getDomainIcon(domain: string): string {
  try {
    const url = new URL(`http://${domain}`)
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
  }
  catch (error) {
    console.error('Invalid domain for favicon:', domain, error)
    return 'https://www.google.com/s2/favicons?domain=default&sz=32'
  }
}

const duration = computed(() => {
  if (!site?.startTime)
    return 0
  return new Date().getTime() - new Date(site.startTime).getTime()
})

const time = ref(duration.value ? formatDuration(duration.value) : 'N/A')

function visitDurationTimer() {
  if (!site?.startTime)
    return 'N/A'
  const duration = new Date().getTime() - new Date(site.startTime).getTime()
  time.value = formatDuration(duration)
}

// Pulse animation state
const isPulsing = ref(true)

let interval: ReturnType<typeof setInterval>
onMounted(() => {
  interval = setInterval(() => {
    if (site?.startTime) {
      visitDurationTimer()
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg"
  >
    <!-- Background decoration -->
    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
    <div class="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />

    <div v-if="site" class="relative z-10">
      <!-- Header -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="rounded-full bg-white/20 p-1">
            <!-- Live indicator icon -->
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3" />
            </svg>
          </div>
          <span class="text-sm font-medium opacity-90">Currently Active</span>
        </div>

        <!-- Live indicator -->
        <div class="flex items-center space-x-2">
          <div
            class="h-2 w-2 rounded-full bg-red-400 transition-opacity duration-1000"
            :class="{ 'animate-pulse': isPulsing }"
          />
          <span class="text-xs font-medium opacity-75">LIVE</span>
        </div>
      </div>

      <!-- Site Info -->
      <div class="flex items-center space-x-4">
        <!-- Favicon with enhanced styling -->
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <img :src="getDomainIcon(site.domain)" alt="Favicon" class="h-8 w-8 rounded-lg">
        </div>

        <!-- Site Details -->
        <div class="flex-1 min-w-0">
          <h4 class="text-xl font-bold text-white mb-1 truncate">
            {{ site.domain }}
          </h4>
          <p class="text-sm opacity-75">
            Active session
          </p>
        </div>

        <!-- Timer Display -->
        <div class="text-right">
          <div class="text-3xl font-bold tracking-tight">
            {{ time }}
          </div>
          <p class="text-sm opacity-75">
            elapsed
          </p>
        </div>
      </div>

      <!-- Progress indicator (optional visual enhancement) -->
      <div class="mt-4">
        <div class="flex items-center space-x-2">
          <div class="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white/40 rounded-full animate-pulse" />
          </div>
          <span class="text-xs opacity-75">Recording...</span>
        </div>
      </div>
    </div>

    <!-- No active session state -->
    <div v-else class="relative z-10 text-center py-0.5">
      <div class="mb-4">
        <div class="mx-auto h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <svg class="h-8 w-8 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <h4 class="text-lg font-semibold mb-1">
        No Active Session
      </h4>
      <p class="text-sm opacity-75">
        Visit a website to start tracking
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-slow {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
