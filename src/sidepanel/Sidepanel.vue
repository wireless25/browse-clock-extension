<script setup lang="ts">
import { currentTabStartTime, isChromeFocused, timeTrackerData, today } from '~/logic/storage'
import DailyStatsCard from '~/components/DailyStatsCard.vue'
import { useRunningClock } from '~/composables/useRunningClock'
import { applyTheme, prefersDarkMode } from '~/logic/common-setup'

const DEBUG = false

const { formattedRunningTime } = useRunningClock({ startTime: currentTabStartTime })

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

// Initial check
applyTheme(prefersDarkMode)

// Listen for changes
prefersDarkMode.addEventListener('change', mql => applyTheme(mql))
</script>

<template>
  <main class="w-full min-h-dvh px-4 py-5 text-center md:bg-gray-50 dark:bg-dark text-gray-700">
    <div class="mt-2">
      <DailyStatsCard
        :key="today"
        :daily-stats="timeTrackerData.dailyStats"
        :current-session="timeTrackerData.currentSession"
        :tab-visited-time="formattedRunningTime"
        :today="today"
      />
    </div>

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div v-if="DEBUG" class="mt-4 text-sm text-gray-500">
      <p>Debug Info:</p>
      <pre>{{ JSON.stringify(timeTrackerData, null, 2) }}</pre>
      <pre>{{ JSON.stringify(isChromeFocused, null, 2) }}</pre>
    </div>
  </main>
</template>
