<script setup lang="ts">
import { currentTab, currentTabStartTime, timeTrackerData, today } from '~/logic/storage'
import DailyStatsCard from '~/components/DailyStatsCard.vue'
import UiButton from '~/components/ui/Button.vue'
import { useRunningClock } from '~/composables/useRunningClock'
import { applyTheme, prefersDarkMode } from '~/logic/common-setup'

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
        :key="today" :daily-stats="timeTrackerData.dailyStats"
        :current-session="timeTrackerData.currentSession" :current-tab-start-time="currentTabStartTime"
        :current-tab="currentTab" :tab-visited-time="formattedRunningTime" :today="today"
      />
    </div>
    <UiButton @click="openOptionsPage">
      Open Options
    </UiButton>
  </main>
</template>
