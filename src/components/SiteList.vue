<script setup lang="ts">
import type { SiteTimeData } from '~/types'
import { computed } from 'vue'

interface Props {
  sites: SiteTimeData[]
  totalTime: number
}

const props = defineProps<Props>()

const maxTime = computed(() => {
  return Math.max(...props.sites.map(site => site.totalTime))
})

function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  else if (minutes > 0) {
    return `${minutes}m`
  }
  else {
    return `${seconds}s`
  }
}

function formatPercentage(siteTime: number): string {
  if (props.totalTime === 0)
    return '0'
  return ((siteTime / props.totalTime) * 100).toFixed(1)
}

function getProgressColor(index: number): string {
  const colors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-pink-500 to-pink-600',
    'bg-gradient-to-r from-indigo-500 to-indigo-600',
  ]
  return colors[index % colors.length]
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(site, index) in sites" :key="site.domain"
      class="group relative overflow-hidden rounded-xl bg-white py-4 transition-all duration-200 dark:bg-dark"
      :style="{ animationDelay: `${index * 100}ms` }"
    >
      <!-- Site Info -->
      <div class="flex items-center space-x-4">
        <!-- Favicon/Icon -->
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-zinc-800"
        >
          <img
            v-if="site.favicon" :src="site.favicon" :alt="site.domain" class="h-6 w-6 rounded"
            @error="handleImageError"
          >
          <div v-else class="h-6 w-6 rounded bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>

        <!-- Site Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-semibold text-gray-900 dark:text-gray-300 truncate">
              {{ site.domain }}
            </h3>
            <span class="text-sm font-medium text-gray-900 dark:text-gray-300">{{ formatTime(site.totalTime) }}</span>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-400">
              {{ site.sessions.length }} sessions
            </p>
            <span class="text-xs text-gray-400">{{ formatPercentage(site.totalTime) }}%</span>
          </div>

          <!-- Progress Bar -->
          <div class="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              class="h-2 rounded-full transition-all duration-1000 ease-out"
              :class="getProgressColor(index)" :style="{
                width: `${Math.min((site.totalTime / maxTime) * 100, 100)}%`,
                transitionDelay: `${index * 150}ms`,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
