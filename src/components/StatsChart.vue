<script setup lang="ts">
import { computed } from 'vue'

interface ChartDataPoint {
  label: string
  value: number
  date: string
}

interface Props {
  title: string
  chartData: ChartDataPoint[]
  activePeriod: '7D' | '90D'
  periods: ('7D' | '90D')[]
}

const props = defineProps<Props>()

defineEmits<{
  periodChange: [period: '7D' | '90D']
}>()

const maxValue = computed(() => {
  const max = Math.max(...props.chartData.map(d => d.value))
  return max || 1 // Avoid division by zero
})

const totalTime = computed(() => {
  return props.chartData.reduce((sum, day) => sum + day.value, 0)
})

const averageTime = computed(() => {
  return totalTime.value / props.chartData.length || 0
})

function formatTime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  else if (minutes > 0) {
    return `${minutes}m`
  }
  else {
    return `${Math.floor(milliseconds / 1000)}s`
  }
}

function getBarColor(value: number, max: number): string {
  const intensity = value / max

  if (intensity > 0.8) {
    return 'bg-gradient-to-t from-red-400 to-red-500'
  }
  else if (intensity > 0.6) {
    return 'bg-gradient-to-t from-orange-400 to-orange-500'
  }
  else if (intensity > 0.4) {
    return 'bg-gradient-to-t from-yellow-400 to-yellow-500'
  }
  else if (intensity > 0.2) {
    return 'bg-gradient-to-t from-green-400 to-green-500'
  }
  else {
    return 'bg-gradient-to-t from-blue-400 to-blue-500'
  }
}
</script>

<template>
  <div class="rounded-2xl bg-white dark:bg-dark py-6">
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h3>
      <div class="flex space-x-2">
        <button
          v-for="period in periods" :key="period"
          class="rounded-lg px-3 py-1 text-sm font-medium transition-colors" :class="[
            activePeriod === period
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700',
          ]" @click="$emit('periodChange', period)"
        >
          {{ period }}
        </button>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="relative h-48 px-4">
      <div class="absolute left-0 top-0 flex h-40 flex-col justify-between text-xs text-gray-400 w-12">
        <span class="text-right pr-2 leading-none">{{ formatTime(maxValue) }}</span>
        <span class="text-right pr-2 leading-none">{{ formatTime(maxValue / 2) }}</span>
        <span class="text-right pr-2 leading-none">0</span>
      </div>
      <div class="absolute inset-0 flex items-end justify-between space-x-2 ml-14 mr-2">
        <div v-for="(day, index) in chartData" :key="day.label" class="flex flex-1 flex-col items-center min-w-0">
          <div class="relative w-full flex flex-col justify-end h-40 mb-2 overflow-hidden">
            <div
              v-if="(day.value / maxValue) > 0.7"
              class="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap z-10"
            >
              {{ formatTime(day.value) }}
            </div>
            <div
              class="w-full rounded-t-lg transition-all duration-1000 ease-out"
              :class="getBarColor(day.value, maxValue)" :style="{
                height: `${Math.max((day.value / maxValue) * 100, 2)}%`,
                transitionDelay: `${index * 100}ms`,
              }"
            />
          </div>

          <!-- Label -->
          <span class="text-xs font-medium text-gray-500 truncate w-full text-center">{{ day.label }}</span>
          <span class="text-xs text-gray-400 mt-1 truncate w-full text-center">
            {{ formatTime(day.value) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="mt-6 grid grid-cols-3 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ formatTime(totalTime) }}
        </p>
        <p class="text-sm text-gray-500">
          Total
        </p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ formatTime(averageTime) }}
        </p>
        <p class="text-sm text-gray-500">
          Average
        </p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ formatTime(maxValue) }}
        </p>
        <p class="text-sm text-gray-500">
          Peak
        </p>
      </div>
    </div>
  </div>
</template>
