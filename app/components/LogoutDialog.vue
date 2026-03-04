<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      @click.self="$emit('update:modelValue', false)"
    >
      <div
        class="w-80 space-y-4 rounded-xl border border-gray-700 bg-[#1a1a1a] p-6 shadow-2xl"
      >
        <div>
          <h2 class="text-sm font-semibold text-gray-200">Logout</h2>
          <p class="mt-1 text-xs text-gray-400">
            Choose how you want to logout.
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <button
            class="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            @click="handleLogout('local')"
          >
            This application only
          </button>
          <button
            class="w-full rounded-lg border border-red-900 bg-red-950 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-900 hover:text-red-300"
            @click="handleLogout('global')"
          >
            All services
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const { logout } = useAuth();

async function handleLogout(scope) {
  emit("update:modelValue", false);
  await logout(scope);
}
</script>
