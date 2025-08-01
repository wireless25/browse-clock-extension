<script setup lang="ts">
import { ref } from 'vue'
import Logo from '~/components/Logo.vue'
import { applyTheme, prefersDarkMode } from '~/logic/common-setup'
import { extOptions, timeTrackerData } from '~/logic/storage'

// Local state for the switch, synced with extOptions
const trackLocalhostToggle = ref<boolean>(extOptions.value.trackLocalhost)
const allowList = ref<string>(extOptions.value.allowList.join('\n'))
const excludeList = ref<string>(extOptions.value.excludeList.join('\n'))

// Watch for changes in the local toggle and update extOptions
watch(trackLocalhostToggle, (newValue) => {
  extOptions.value.trackLocalhost = newValue
})
watch(allowList, (newValue) => {
  extOptions.value.allowList = newValue.split('\n').filter(url => url.trim() !== '')
})
watch(excludeList, (newValue) => {
  extOptions.value.excludeList = newValue.split('\n').filter(url => url.trim() !== '')
})

function clearData() {
  timeTrackerData.value = {
    currentSession: null,
    dailyStats: {},
  }
}

applyTheme(prefersDarkMode)

prefersDarkMode.addEventListener('change', mql => applyTheme(mql))
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-dark text-zinc-800 dark:text-gray-100 p-8">
    <div
      class="max-w-xl mx-auto bg-white dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
    >
      <div class="p-6 border-b border-gray-200 dark:border-gray-600 flex items-center">
        <Logo class="h-10 w-10 mr-4" />
        <h1 class="text-3xl font-semibold text-zinc-800 dark:text-gray-100">
          Extension Settings
        </h1>
      </div>

      <div class="p-6 space-y-6">
        <!-- Section for General Settings -->
        <section>
          <h2 class="text-xl font-medium mb-4 text-zinc-800 dark:text-gray-100">
            General
          </h2>
          <div
            class="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-gray-600"
          >
            <label
              for="trackLocalhost"
              class="text-lg font-normal cursor-pointer text-zinc-800 dark:text-gray-100"
            >
              Track Localhost Traffic
            </label>
            <label
              for="trackLocalhost"
              class="relative inline-flex items-center cursor-pointer"
            >
              <input
                id="trackLocalhost"
                v-model="trackLocalhostToggle"
                type="checkbox"
                class="sr-only peer"
                role="switch"
                :aria-checked="trackLocalhostToggle ? 'true' : 'false'"
              >
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"
              />
              <span class="sr-only">Toggle Track Localhost Traffic</span>
            </label>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
            When enabled, the extension will also track traffic from localhost
            servers.
          </p>
        </section>

        <!-- Section for URL Management -->
        <section>
          <h2 class="text-xl font-medium mb-4 text-zinc-800 dark:text-gray-100">
            URL Management
          </h2>
          <div class="space-y-4">
            <!-- Allow List -->
            <div class="bg-gray-50 dark:bg-zinc-800 rounded-md p-4 border border-gray-200 dark:border-gray-600">
              <label
                for="allowList"
                class="text-lg font-normal mb-2 block text-zinc-800 dark:text-gray-100"
              >
                Allow List
              </label>
              <textarea
                id="allowList"
                v-model="allowList"
                rows="5"
                class="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-dark text-zinc-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter URLs to allow (one per line, like https://example.com)"
              />
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Only URLs matching entries in this list will be tracked. If
                this list is empty, all URLs are potentially tracked (subject
                to the exclude list).
              </p>
            </div>

            <!-- Exclude List -->
            <div class="bg-gray-50 dark:bg-zinc-800 rounded-md p-4 border border-gray-200 dark:border-gray-600">
              <label
                for="excludeList"
                class="text-lg font-normal mb-2 block text-zinc-800 dark:text-gray-100"
              >
                Exclude List
              </label>
              <textarea
                id="excludeList"
                v-model="excludeList"
                rows="5"
                class="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-dark text-zinc-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter URLs to allow (one per line, like https://example.com)"
              />
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
                URLs matching entries in this list will *never* be tracked,
                even if they are on the allow list.
              </p>
            </div>
          </div>
        </section>

        <!-- Section for Advanced Settings -->
        <section>
          <h2 class="text-xl font-medium mb-4 text-zinc-800 dark:text-gray-100">
            Data management
          </h2>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-gray-600"
            >
              <span class="text-lg font-normal text-gray-500 dark:text-gray-500">
                Clear today's data
              </span>
              <button
                class="text-sm text-red-600 dark:text-red-400 hover:underline"
                @click="clearData"
              >
                Clear
              </button>
            </div>
          </div>
        </section>
      </div>

      <div
        class="p-6 border-t border-gray-200 dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-500"
      >
        <p>2025 BrowswClock</p>
      </div>
    </div>
  </main>
</template>
