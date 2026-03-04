<template>
  <div>
    <CoinMonsterDashboardDashboardNav />
    <div class="max-w-8xl relative mx-auto space-y-6 px-6 pb-6">
      <CoinMonsterDashboardCoinDetail
        v-if="selectedCoin"
        :coin="selectedCoin"
        @close="selectedCoin = null"
        @updated="fetchCoins"
      />

      <div
        v-if="canManage"
        class="space-y-4 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
      >
        <CoinMonsterDashboardSubscribeForm @subscribed="fetchCoins" />
      </div>

      <CoinMonsterDashboardCoinTable
        :coins="coins"
        :loading="loading"
        :can-manage="canManage"
        @select="selectedCoin = $event"
        @refresh="fetchCoins"
      />
    </div>
  </div>
</template>

<script setup>
const { hasRole } = useAuth();
const canManage = computed(() => hasRole("admin") || hasRole("coin-manager"));

const coins = ref([]);
const loading = ref(true);
const selectedCoin = ref(null);

async function fetchCoins() {
  loading.value = true;
  try {
    coins.value = await $fetch("/api/coin-monster/");
  } catch {
    coins.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCoins();
});
</script>
