<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold text-[#00ff41]">Edit Identity</h4>
      <button
        class="text-xs text-gray-300 hover:text-[#00ff41]"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>

    <div class="space-y-3 text-sm">
      <div>
        <label class="text-xs text-[#00ff41]">Email</label>
        <input
          v-model="form.new_email"
          type="email"
          :placeholder="identity.email"
          class="mt-1 w-full rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 focus:border-[#00ff41] focus:outline-none"
        />
      </div>

      <div>
        <label class="text-xs text-[#00ff41]">Expires</label>
        <input
          v-model="form.new_expires"
          type="datetime-local"
          class="mt-1 w-full rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-300 focus:border-[#00ff41] focus:outline-none"
        />
      </div>

      <div>
        <label class="text-xs text-[#00ff41]">Roles</label>
        <div class="mt-1 flex flex-wrap gap-3">
          <label
            v-for="role in ALL_ROLES"
            :key="role"
            class="flex cursor-pointer items-center gap-1.5 text-xs text-gray-300"
          >
            <input
              v-model="form.new_roles"
              type="checkbox"
              :value="role"
              class="accent-[#00ff41]"
            />
            {{ role }}
          </label>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 border-t border-gray-800 pt-4">
      <button
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-[#00ff41]/50 hover:text-[#00ff41]"
        :disabled="saving"
        @click="handleSave"
      >
        {{ saving ? "Saving..." : "Save" }}
      </button>
    </div>

    <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
  </div>
</template>

<script setup>
const ALL_ROLES = ["default", "service-account", "admin", "coin-manager"];

const props = defineProps({
  identity: { type: Object, required: true },
});

const emit = defineEmits(["saved", "cancel"]);

const form = ref({
  new_email: "",
  new_expires: toDatetimeLocal(props.identity.expires),
  new_roles: [...props.identity.roles],
});

const saving = ref(false);
const error = ref("");

function toDatetimeLocal(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 16);
}

async function handleSave() {
  saving.value = true;
  error.value = "";

  const body = {};
  if (form.value.new_email) body.new_email = form.value.new_email;
  if (form.value.new_expires)
    body.new_expires = new Date(form.value.new_expires).toISOString();
  body.new_roles = form.value.new_roles;

  try {
    await $fetch(`/api/sso/identities/${props.identity.email}`, {
      method: "PUT",
      body,
    });
    emit("saved");
  } catch (e) {
    error.value = e.data?.detail || "Failed to update identity";
  } finally {
    saving.value = false;
  }
}
</script>
