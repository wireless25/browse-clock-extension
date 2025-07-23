<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  timeMs: number
  subtitle?: string
  showProgress?: boolean
  progressPercentage?: number
  gradient?: 'blue' | 'green' | 'purple' | 'orange'
  icon?: 'clock' | 'target' | 'trending' | 'activity'
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: false,
  progressPercentage: 0,
  gradient: 'blue',
  icon: 'clock',
})

const formattedTime = computed(() => {
  const seconds = Math.floor(props.timeMs / 1000)
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
})

const circumference = computed(() => 2 * Math.PI * 40)
const strokeDashoffset = computed(() => {
  return circumference.value - (props.progressPercentage / 100) * circumference.value
})

// Simple icon components (you can replace with your preferred icon library)
const iconComponent = computed(() => {
  const icons = {
    clock: 'ClockIcon',
    target: 'TargetIcon',
    trending: 'TrendingIcon',
    activity: 'ActivityIcon',
  }
  return icons[props.icon]
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white shadow-lg"
  >
    <div class="relative z-10">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="text-sm font-medium opacity-90">
          {{ title }}
        </h3>
        <div class="rounded-full bg-white/20 p-1">
          <component :is="iconComponent" class="h-4 w-4" />
        </div>
      </div>

      <div class="mb-4">
        <p class="text-3xl font-bold tracking-tight">
          {{ formattedTime }}
        </p>
        <p v-if="subtitle" class="text-sm opacity-75">
          {{ subtitle }}
        </p>
      </div>

      <!-- Progress Ring -->
      <div v-if="showProgress" class="flex items-center justify-center">
        <div class="relative h-20 w-20">
          <svg class="h-20 w-20 -rotate-90 transform" viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle
              cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none"
              class="opacity-20"
            />
            <!-- Progress circle -->
            <circle
              cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none"
              stroke-linecap="round" class="transition-all duration-1000 ease-out"
              :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xs font-semibold">{{ Math.round(progressPercentage) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
    <div class="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />
  </div>
</template>
