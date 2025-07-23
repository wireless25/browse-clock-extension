<script setup lang="ts">
import { computed } from 'vue'

interface RingData {
  label: string
  value: number
  target: number
  color: string
}

interface Props {
  rings: RingData[]
  totalTime: number
  size?: number
  ringWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  ringWidth: 12,
})

const center = computed(() => props.size / 2)

const rings = computed(() => {
  return props.rings.map((ring, index) => {
    const radius = center.value - (props.ringWidth / 2) - (index * (props.ringWidth + 4))
    const circumference = 2 * Math.PI * radius
    const percentage = Math.min((ring.value / ring.target) * 100, 100)
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return {
      ...ring,
      radius,
      circumference,
      percentage,
      strokeDashoffset,
      bgColor: `${ring.color}20`, // Add opacity to background
    }
  })
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
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <!-- SVG Rings -->
      <svg :width="size" :height="size" class="transform -rotate-90">
        <!-- Background rings -->
        <circle
          v-for="(ring, index) in rings" :key="`bg-${index}`" :cx="center" :cy="center" :r="ring.radius"
          :stroke="ring.bgColor" :stroke-width="ringWidth" fill="none" class="opacity-20"
        />

        <!-- Progress rings -->
        <circle
          v-for="(ring, index) in rings" :key="`progress-${index}`" :cx="center" :cy="center"
          :r="ring.radius" :stroke="ring.color" :stroke-width="ringWidth" fill="none" stroke-linecap="round"
          class="transition-all duration-1000 ease-out" :stroke-dasharray="ring.circumference"
          :stroke-dashoffset="ring.strokeDashoffset" :style="{ transitionDelay: `${index * 200}ms` }"
        />
      </svg>

      <!-- Center content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <p class="text-2xl font-bold text-gray-900">
          {{ formatTime(totalTime) }}
        </p>
        <p class="text-sm text-gray-500">
          Total Time
        </p>
      </div>
    </div>

    <!-- Ring Labels -->
    <div class="mt-4 space-y-2">
      <div v-for="(ring, index) in rings" :key="`label-${index}`" class="flex items-center space-x-2">
        <div class="h-3 w-3 rounded-full" :style="{ backgroundColor: ring.color }" />
        <span class="text-sm font-medium text-gray-700">{{ ring.label }}</span>
        <span class="text-sm text-gray-500">{{ Math.round(ring.percentage) }}%</span>
      </div>
    </div>
  </div>
</template>
