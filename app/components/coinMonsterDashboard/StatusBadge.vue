<template>
  <span
    class="inline-block rounded-full"
    :class="{ 'animate-pulse': !status }"
    :style="{ width: '12px', height: '12px', backgroundColor: color }"
    :title="status || 'pending'"
  ></span>
</template>

<script setup>
const props = defineProps({
  status: { type: String, default: null },
});

const color = computed(() => {
  switch (props.status) {
    case "starting":
      return "rgba(59, 130, 246, 0.6)";
    case "healthy":
      return "rgba(34, 197, 94, 0.6)";
    case "error":
      return "rgba(249, 115, 22, 0.6)";
    case "failed":
      return "rgba(239, 68, 68, 0.6)";
    default:
      return "rgba(107, 114, 128, 0.4)";
  }
});
</script>
