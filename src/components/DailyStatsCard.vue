<script setup lang="ts">
import { computed } from 'vue'
import SiteList from './SiteList.vue'
import StatsChart from './StatsChart.vue'
import { timeTrackerData, today } from '~/logic/storage'
import type { ChartDataPoint, DailyStats, SiteTimeData, StorageData } from '~/types'

const props = defineProps<{
  tabVisitedTime: string
  currentSession: {
    domain: string
    startTime: string
  } | null
  dailyStats: Record<string, DailyStats>
}>()

const dayData = computed<StorageData['dailyStats'][typeof today.value]>(() => props.dailyStats[today.value])
const formattedDate = computed(() => {
  if (!today.value)
    return ''
  const date = new Date(today.value)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

function getWeeklyChartData(dailyStats: Record<string, DailyStats>): ChartDataPoint[] {
  const today = new Date()
  const weekData: ChartDataPoint[] = []

  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayStats = dailyStats[dateStr]
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' })

    weekData.push({
      label: dayLabel,
      value: Object.values(dayStats?.sites || {}).reduce(
        (sum, site) => sum + site.totalTime,
        0,
      ),
      date: dateStr,
    })
  }

  return weekData
}

function getTimePeriodData(
  dailyStats: Record<string, DailyStats>,
  period: '7D' | '30D' | '90D',
): ChartDataPoint[] {
  switch (period) {
    case '7D':
      return getWeeklyChartData(dailyStats)
    case '90D':
      return getQuarterlyChartData(dailyStats)
    default:
      return getWeeklyChartData(dailyStats)
  }
}

function getQuarterlyChartData(dailyStats: Record<string, DailyStats>): ChartDataPoint[] {
  const today = new Date()
  const quarterData: ChartDataPoint[] = []

  // Group by weeks for 90 days (13 weeks)
  for (let week = 12; week >= 0; week--) {
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - (week * 7) - 6)

    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() - (week * 7))

    let weekTotal = 0

    // Sum up the week
    for (let day = 0; day < 7; day++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + day)
      const dateStr = date.toISOString().split('T')[0]

      const dayStats = dailyStats[dateStr]
      if (dayStats) {
        weekTotal += Object.values(dayStats?.sites || {}).reduce(
          (sum, site) => sum + site.totalTime,
          0,
        )
      }
    }

    quarterData.push({
      label: `${13 - week}`,
      value: weekTotal,
      date: weekStart.toISOString().split('T')[0],
    })
  }

  return quarterData
}

function getTodayTopSites(dailyStats: Record<string, DailyStats>, limit = 5): SiteTimeData[] {
  const todayStats = dailyStats[today.value]

  if (!todayStats)
    return []

  return Object.values(todayStats.sites)
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, limit)
}

const activePeriod = ref<'7D' | '90D'>('7D')
const chartData = computed(() =>
  getTimePeriodData(timeTrackerData.value.dailyStats, activePeriod.value),
)
const topSites = computed(() => getTodayTopSites(timeTrackerData.value.dailyStats, 5))
const todayTotal = computed(() => Object.values(timeTrackerData.value.dailyStats[new Date().toISOString().split('T')[0]]?.sites || {}).reduce(
  (sum, site) => sum + site.totalTime,
  0,
))

function handlePeriodChange(period: '7D' | '90D') {
  activePeriod.value = period
}

// rerender the current session card when the current session changes
const rerenderKey = computed(() => `${props.currentSession?.domain}-${Date.now()}`)
</script>

<template>
  <div class="mx-auto w-full md:max-w-2xl rounded-lg bg-white md:p-6 md:shadow-xl dark:bg-dark md:dark:border md:dark:border-gray-600">
    <div class="mb-6 flex flex-wrap text-left gap-x-10 items-center justify-between border-b pb-4 dark:border-gray-700">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 md:text-3xl">
        Daily Usage Report
      </h2>
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400 md:text-base">{{ formattedDate }}</span>
    </div>

    <div class="space-y-4">
      <div>
        <CurrentSiteDetails :key="rerenderKey" :site="currentSession" :tab-visited-time="tabVisitedTime" />
      </div>
      <div v-if="dayData && Object.keys(dayData.sites).length > 0">
        <h3 class="text-lg text-left font-semibold text-gray-900 dark:text-gray-100">
          Top Sites Today
        </h3>
        <SiteList :sites="topSites" :total-time="todayTotal" />
        <StatsChart
          title="Weekly Activity" :chart-data="chartData" :active-period="activePeriod" :periods="['7D', '90D']"
          @period-change="handlePeriodChange"
        />
      </div>
    </div>
  </div>
</template>
