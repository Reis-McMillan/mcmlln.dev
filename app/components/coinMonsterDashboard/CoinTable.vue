<template>
  <div
    class="space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-[#00ff41]">Subscriptions</h2>
      <button
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        @click="$emit('refresh')"
      >
        Refresh
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center text-sm text-gray-300">
      Loading subscriptions...
    </div>

    <div
      v-else-if="!coins.length"
      class="py-8 text-center text-sm text-gray-300"
    >
      No active subscriptions.
    </div>

    <div v-else class="overflow-x-auto rounded border border-gray-800">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-gray-800 bg-[#0d0d0d]">
          <tr>
            <th class="px-4 py-2 font-medium text-[#00ff41]">Coin</th>
            <th class="px-4 py-2 font-medium text-[#00ff41]">Main</th>
            <th class="px-4 py-2 font-medium text-[#00ff41]">L2</th>
            <th
              v-if="canManage"
              class="px-4 py-2 font-medium text-[#00ff41]"
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="coin in coins"
            :key="coin"
            class="border-b border-gray-800/50 transition-colors hover:bg-[#0d0d0d]/50"
          >
            <td class="px-4 py-2 text-gray-300">{{ coin }}</td>
            <td class="px-4 py-2">
              <CoinMonsterDashboardStatusBadge :status="statuses[coin]?.main" />
            </td>
            <td class="px-4 py-2">
              <CoinMonsterDashboardStatusBadge :status="statuses[coin]?.l2" />
            </td>
            <td v-if="canManage" class="px-4 py-2 text-right">
              <button
                class="text-xs text-gray-300 hover:text-[#00ff41]"
                @click="$emit('select', coin)"
              >
                Manage
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  coins: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  canManage: { type: Boolean, default: false },
});

defineEmits(["select", "refresh"]);

const statuses = ref({});

async function fetchStatus(coin) {
  try {
    const data = await $fetch(
      `/api/coin-monster/${encodeURIComponent(coin)}/status`
    );
    statuses.value = { ...statuses.value, [coin]: data };
  } catch {
    statuses.value = {
      ...statuses.value,
      [coin]: { main: "error", l2: "error" },
    };
  }
}

watch(
  () => props.coins,
  (newCoins) => {
    statuses.value = {};
    newCoins.forEach((coin) => fetchStatus(coin));
  },
  { immediate: true }
);
</script>
