<template>
  <div
    class="space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-[#00ff41]">{{ coin }}</h3>
      <button
        class="text-xs text-gray-300 hover:text-[#00ff41]"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>

    <div v-if="statusLoading" class="py-4 text-sm text-gray-300">
      Loading status...
    </div>

    <div v-else-if="status" class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span class="text-[#00ff41]">Main Status</span>
        <p>
          <CoinMonsterDashboardStatusBadge :status="status.main" />
        </p>
      </div>
      <div>
        <span class="text-[#00ff41]">L2 Status</span>
        <p>
          <CoinMonsterDashboardStatusBadge :status="status.l2" />
        </p>
      </div>
    </div>

    <div class="flex gap-2 border-t border-gray-800 pt-4">
      <button
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-[#00ff41]/50 hover:text-[#00ff41]"
        :disabled="actionLoading"
        @click="fetchStatus"
      >
        Refresh Status
      </button>
      <button
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-400"
        :disabled="actionLoading"
        @click="handleUnsubscribe"
      >
        Unsubscribe
      </button>
    </div>

    <p v-if="actionError" class="text-sm text-red-400">{{ actionError }}</p>
    <p v-if="actionSuccess" class="text-sm text-[#00ff41]">
      {{ actionSuccess }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  coin: { type: String, required: true },
});

const emit = defineEmits(["close", "updated"]);

const status = ref(null);
const statusLoading = ref(true);
const actionLoading = ref(false);
const actionError = ref("");
const actionSuccess = ref("");

async function fetchStatus() {
  statusLoading.value = true;
  try {
    status.value = await $fetch(
      `/api/coin-monster/${encodeURIComponent(props.coin)}/status`
    );
  } catch {
    status.value = null;
  } finally {
    statusLoading.value = false;
  }
}

async function handleUnsubscribe() {
  actionLoading.value = true;
  actionError.value = "";
  actionSuccess.value = "";
  try {
    await $fetch(`/api/coin-monster/${encodeURIComponent(props.coin)}`, {
      method: "DELETE",
    });
    actionSuccess.value = `Unsubscribed from ${props.coin}`;
    emit("updated");
  } catch (e) {
    actionError.value = e.data?.message || "Failed to unsubscribe";
  } finally {
    actionLoading.value = false;
  }
}

onMounted(() => fetchStatus());
</script>
