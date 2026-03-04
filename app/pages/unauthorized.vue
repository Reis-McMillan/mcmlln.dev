<template>
  <div class="flex min-h-[80vh] items-center justify-center">
    <div
      class="w-96 space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 text-center shadow-2xl backdrop-blur-md"
    >
      <h1 class="text-2xl font-bold text-red-400">Access Denied</h1>
      <p class="text-sm text-gray-300">
        You do not have permission to access
        <span v-if="from" class="text-[#00ff41]">{{ from }}</span>
        <span v-else>the requested page</span>
        .
      </p>
      <div class="flex justify-center gap-3">
        <NuxtLink
          to="/"
          class="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const from = computed(() => route.query.from || "");
</script>
