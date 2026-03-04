<template>
  <div
    class="space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-[#00ff41]">
        {{ identity.email }}
      </h3>
      <button
        class="text-xs text-gray-300 hover:text-[#00ff41]"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>

    <SsoDashboardIdentityEdit
      v-if="showEdit"
      :identity="identity"
      @saved="onSaved"
      @cancel="showEdit = false"
    />

    <template v-else>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-[#00ff41]">ID</span>
          <p class="text-gray-300">{{ identity.id }}</p>
        </div>
        <div>
          <span class="text-[#00ff41]">Status</span>
          <p :class="identity.closed ? 'text-red-400' : 'text-[#00ff41]'">
            {{ identity.closed ? "Closed" : "Active" }}
          </p>
        </div>
        <div>
          <span class="text-[#00ff41]">Created</span>
          <p class="text-gray-300">{{ formatDate(identity.origination) }}</p>
        </div>
        <div>
          <span class="text-[#00ff41]">Expires</span>
          <p class="text-gray-300">{{ formatDate(identity.expires) }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-sm text-[#00ff41]">Roles</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="role in identity.roles"
            :key="role"
            class="inline-block rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300"
          >
            {{ role }}
          </span>
        </div>
      </div>

      <div class="flex gap-2 border-t border-gray-800 pt-4">
        <button
          v-if="!identity.closed"
          class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-[#00ff41]/50 hover:text-[#00ff41]"
          :disabled="actionLoading"
          @click="showEdit = true"
        >
          Edit
        </button>
        <button
          v-if="!identity.closed"
          class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-yellow-500/50 hover:text-yellow-400"
          :disabled="actionLoading"
          @click="handleLogout"
        >
          Force Logout
        </button>
        <button
          v-if="!identity.closed"
          class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-400"
          :disabled="actionLoading"
          @click="handleDelete"
        >
          Close Identity
        </button>
      </div>

      <p v-if="actionError" class="text-sm text-red-400">{{ actionError }}</p>
      <p v-if="actionSuccess" class="text-sm text-[#00ff41]">
        {{ actionSuccess }}
      </p>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  identity: { type: Object, required: true },
});

const emit = defineEmits(["close", "updated"]);

const showEdit = ref(false);
const actionLoading = ref(false);
const actionError = ref("");
const actionSuccess = ref("");

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function onSaved() {
  showEdit.value = false;
  emit("updated");
}

async function handleLogout() {
  actionLoading.value = true;
  actionError.value = "";
  actionSuccess.value = "";
  try {
    await $fetch(`/api/sso/identities/${props.identity.email}/logout`, {
      method: "POST",
      body: { expires: props.identity.expires },
    });
    actionSuccess.value = "Identity logged out (auth key rotated)";
    emit("updated");
  } catch (e) {
    actionError.value = e.data?.message || "Failed to logout identity";
  } finally {
    actionLoading.value = false;
  }
}

async function handleDelete() {
  actionLoading.value = true;
  actionError.value = "";
  actionSuccess.value = "";
  try {
    await $fetch(`/api/sso/identities/${props.identity.email}`, {
      method: "DELETE",
    });
    actionSuccess.value = "Identity closed";
    emit("updated");
  } catch (e) {
    actionError.value = e.data?.message || "Failed to close identity";
  } finally {
    actionLoading.value = false;
  }
}
</script>
