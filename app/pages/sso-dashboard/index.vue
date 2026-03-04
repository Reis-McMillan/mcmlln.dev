<template>
  <div class="max-w-8xl relative mx-auto space-y-6 px-6 pb-6">
    <SsoDashboardIdentityDetail
      v-if="selectedIdentity"
      :identity="selectedIdentity"
      @close="selectedIdentity = null"
      @updated="fetchIdentities"
    />

    <SsoDashboardIdentityTable
      :identities="identities"
      :loading="loading"
      @select="selectedIdentity = $event"
      @refresh="fetchIdentities"
    />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["authenticate", "admin"],
});

const identities = ref([]);
const loading = ref(true);
const selectedIdentity = ref(null);

async function fetchIdentities() {
  loading.value = true;
  try {
    identities.value = await $fetch("/api/sso/identities");
  } catch {
    identities.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchIdentities();
});
</script>
