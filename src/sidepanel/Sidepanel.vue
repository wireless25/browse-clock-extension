<script setup lang="ts">
import DailyStatsCard from '~/components/DailyStatsCard.vue'
import SessionHistory from '~/components/SessionHistory.vue'
import UiButton from '~/components/ui/Button.vue'
import { useRunningClock } from '~/composables/useRunningClock'
import { applyTheme, prefersDarkMode } from '~/logic/common-setup'
import { currentTab, currentTabStartTime, timeTrackerData, today } from '~/logic/storage'

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
        :current-session="timeTrackerData.currentSession"
        :current-tab="currentTab"
        :tab-visited-time="formattedRunningTime"
        :today="today"
      />
    </div>
    <div class="mt-4">
      <SessionHistory :daily-stats="timeTrackerData.dailyStats" />
    </div>
    <UiButton class="mt-4" @click="openOptionsPage">
      Open Options
    </UiButton>
  </main>
</template>
