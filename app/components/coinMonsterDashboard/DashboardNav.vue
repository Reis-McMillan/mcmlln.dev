<template>
  <nav class="max-w-8xl relative mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="text-[#00ff41]">coin-monster</span>
      </div>
      <div class="flex items-center gap-4">
        <template v-if="identity">
          <span class="text-xs text-gray-300">
            {{ identity.email }}
          </span>
          <button
            class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            @click="showLogoutDialog = true"
          >
            Logout
          </button>
        </template>
        <NuxtLink
          v-else
          to="/login?redirect=/coin-monster-dashboard"
          class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          Login
        </NuxtLink>
      </div>
    </div>
  </nav>
  <LogoutDialog v-model="showLogoutDialog" />
</template>

<script setup>
const { identity } = useAuth();
const showLogoutDialog = ref(false);
</script>
