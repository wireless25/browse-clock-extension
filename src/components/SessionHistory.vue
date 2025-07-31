<script setup lang="ts">
import type { DailyStats } from '~/types'
import { computed } from 'vue'
import { formatDuration, formatTime } from '~/logic/utils'

const { dailyStats } = defineProps<{
  dailyStats: Record<string, DailyStats>
}>()

const sortedDays = computed(() => {
  return Object.values(dailyStats).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function formatDailyTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 1000 / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  else if (minutes > 0) {
    return `${minutes}m`
  }
  else {
    return `< 1m`
  }
}
</script>

<template>
  <div
    class="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
  >
    <details class="group">
      <summary
        class="flex cursor-pointer items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-5 text-lg font-semibold text-gray-900 transition-all hover:bg-gray-100 dark:from-gray-800 dark:to-gray-700 dark:text-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600"
      >
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-600 transition-transform group-open:rotate-90 dark:text-gray-400"
            viewBox="0 0 20 20" fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Session History</span>
        </div>
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          {{ Object.keys(dailyStats).length }} days
        </span>
      </summary>

      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="day in sortedDays" :key="day.date"
          class="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <details class="group">
            <summary class="flex cursor-pointer items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-500 transition-transform group-open:rotate-90 dark:text-gray-400"
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h3 class="text-md font-medium text-gray-800 dark:text-gray-200">
                  {{ new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric' }) }}
                </h3>
              </div>
              <span
                class="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              >
                {{ formatDailyTime(Object.values(day.sites).reduce((acc, site) => acc + site.totalTime, 0)) }}
              </span>
            </summary>

            <div class="mt-3 ml-6 space-y-3">
              <div
                v-for="site in Object.values(day.sites).sort((a, b) => b.totalTime - a.totalTime)" :key="site.domain"
                class="group"
              >
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <span class="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                    {{ site.domain }}
                  </h4>
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {{ formatDuration(site.totalTime) }}
                  </span>
                </div>
                <ul class="mt-2 space-y-1.5 ml-4 border-l-2 border-gray-100 pl-3 dark:border-gray-800">
                  <li
                    v-for="(session, index) in site.sessions" :key="index"
                    class="text-xs text-gray-600 dark:text-gray-400 flex items-center"
                  >
                    <span class="w-1 h-1 rounded-full bg-gray-400 mr-2" />
                    <span class="font-mono">{{ formatTime(session.startTime) }} - {{ formatTime(session.endTime)
                    }}</span>
                    <span class="mx-2">•</span>
                    <span class="font-medium">{{ formatDuration(session.duration) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </details>
  </div>
</template>
