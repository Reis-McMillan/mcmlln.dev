<template>
  <div class="flex items-end gap-3">
    <div class="flex-1">
      <label class="text-xs text-[#00ff41]">Subscribe to coin</label>
      <input
        v-model="coinSymbol"
        type="text"
        placeholder="BTC-USD"
        class="mt-1 w-full rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 uppercase placeholder:normal-case focus:border-[#00ff41] focus:outline-none"
        @keyup.enter="handleSubscribe"
      />
    </div>
    <button
      class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-[#00ff41]/50 hover:text-[#00ff41]"
      :disabled="loading || !coinSymbol.trim()"
      @click="handleSubscribe"
    >
      {{ loading ? "..." : "Subscribe" }}
    </button>
  </div>
  <p v-if="error" class="mt-1 text-xs text-red-400">{{ error }}</p>
  <p v-if="success" class="mt-1 text-xs text-[#00ff41]">{{ success }}</p>
</template>

<script setup>
const emit = defineEmits(["subscribed"]);

const coinSymbol = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

async function handleSubscribe() {
  const symbol = coinSymbol.value.trim().toUpperCase();
  if (!symbol) return;

  loading.value = true;
  error.value = "";
  success.value = "";
  try {
    const result = await $fetch(
      `/api/coin-monster/${encodeURIComponent(symbol)}`,
      {
        method: "POST",
      }
    );
    success.value = result.message || `Subscribed to ${symbol}`;
    coinSymbol.value = "";
    emit("subscribed");
  } catch (e) {
    error.value = e.data?.message || "Failed to subscribe";
  } finally {
    loading.value = false;
  }
}
</script>
