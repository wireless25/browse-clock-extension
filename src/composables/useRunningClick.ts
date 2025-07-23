import type { ComputedRef, Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

/**
 * @interface UseRunningClockOptions
 * Options for the useRunningClock composable.
 */
interface UseRunningClockOptions {
  /**
   * A reactive reference or computed property holding the start time as an ISO string (e.g., '2023-01-01T10:00:00Z').
   */
  startTime: Ref<string> | ComputedRef<string>
}

/**
 * @interface UseRunningClockReturn
 * The return type of the useRunningClock composable.
 */
interface UseRunningClockReturn {
  /**
   * A reactive reference to the formatted running time string (HH:MM:SS).
   */
  formattedRunningTime: Ref<string>
}

/**
 * A Vue composable to display a running clock from a given start time.
 * The clock updates in real-time every second and reacts to changes in the provided startTime.
 *
 * @param {UseRunningClockOptions} options - The options object containing the reactive start time.
 * @returns {UseRunningClockReturn} An object containing reactive references for the running time.
 */
export function useRunningClock(options: UseRunningClockOptions): UseRunningClockReturn {
  const { startTime } = options // startTime is now a Ref<string> or ComputedRef<string>

  const internalRunningSeconds = ref(0)
  let intervalId: number | null = null // Store the interval ID for cleanup

  const calculateRunningSeconds = (): void => {
    // Ensure startTime.value is a valid date string before proceeding
    if (!startTime.value) {
      internalRunningSeconds.value = 0
      return
    }
    const startTimestamp = new Date(startTime.value).getTime()
    const nowTimestamp = Date.now()
    // Calculate difference in milliseconds and convert to seconds
    internalRunningSeconds.value = Math.floor((nowTimestamp - startTimestamp) / 1000)
  }

  const formattedRunningTime = computed<string>(() => {
    const totalSeconds = internalRunningSeconds.value
    // Handle cases where totalSeconds might be negative (if start time is in the future)
    if (totalSeconds < 0) {
      return '00:00:00' // Or some other indication like '-HH:MM:SS'
    }

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    // Helper function to pad numbers with a leading zero if less than 10
    const pad = (num: number): string => num.toString().padStart(2, '0')

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  })

  // Watch the reactive startTime property
  watch(
    startTime,
    () => {
      // When startTime changes, recalculate the initial running seconds immediately
      calculateRunningSeconds()
    },
    { immediate: true }, // Run the watch callback immediately on component mount
  )

  onMounted(() => {
    // The initial calculation is now handled by the immediate watch,
    // but we still need to start the interval here.
    intervalId = window.setInterval(calculateRunningSeconds, 1000)
  })

  onUnmounted(() => {
    // Clean up the interval when the component unmounts to prevent memory leaks
    if (intervalId !== null) {
      window.clearInterval(intervalId)
    }
  })

  return {
    formattedRunningTime,
  }
}
