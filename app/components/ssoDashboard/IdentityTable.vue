<template>
  <div
    class="space-y-6 overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] p-6 shadow-2xl backdrop-blur-md"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-[#00ff41]">Identities</h2>
      <button
        class="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        @click="$emit('refresh')"
      >
        Refresh
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center text-sm text-gray-300">
      Loading identities...
    </div>

    <div
      v-else-if="!identities.length"
      class="py-8 text-center text-sm text-gray-300"
    >
      No identities found.
    </div>

    <div v-else class="overflow-x-auto rounded border border-gray-800">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-gray-800 bg-[#0d0d0d]">
          <tr>
            <th class="px-4 py-2 font-medium text-[#00ff41]">Email</th>
            <th class="px-4 py-2 font-medium text-[#00ff41]">Roles</th>
            <th class="px-4 py-2 font-medium text-[#00ff41]">Expires</th>
            <th class="px-4 py-2 font-medium text-[#00ff41]">Status</th>
            <th class="px-4 py-2 font-medium text-[#00ff41]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="identity in identities"
            :key="identity.id"
            class="border-b border-gray-800/50 transition-colors hover:bg-[#0d0d0d]/50"
          >
            <td class="px-4 py-2 text-gray-300">{{ identity.email }}</td>
            <td class="px-4 py-2">
              <span
                v-for="role in identity.roles"
                :key="role"
                class="mr-1 inline-block rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300"
              >
                {{ role }}
              </span>
            </td>
            <td class="px-4 py-2 text-gray-300">
              {{ formatDate(identity.expires) }}
            </td>
            <td class="px-4 py-2">
              <span
                class="text-xs"
                :class="identity.closed ? 'text-red-400' : 'text-[#00ff41]'"
              >
                {{ identity.closed ? "Closed" : "Active" }}
              </span>
            </td>
            <td class="px-4 py-2 text-right">
              <button
                class="text-xs text-gray-300 hover:text-[#00ff41]"
                @click="$emit('select', identity)"
              >
                Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  identities: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

defineEmits(["select", "refresh"]);

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
