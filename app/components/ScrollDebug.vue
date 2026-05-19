<script setup lang="ts">
const { scrollPxToUnits } = useScrollUnits();

const scrollY = ref(0);
const docHeight = ref(0);
const viewHeight = ref(0);

let rafId = 0;
let mounted = false;

function update() {
  if (!mounted) return;
  scrollY.value = window.scrollY;
  docHeight.value = document.documentElement.scrollHeight;
  viewHeight.value = window.innerHeight;
  rafId = requestAnimationFrame(update);
}

onMounted(() => {
  if (import.meta.server) return;
  mounted = true;
  update();
});

onBeforeUnmount(() => {
  mounted = false;
  if (rafId) cancelAnimationFrame(rafId);
});

const pctDoc = computed(() =>
  docHeight.value > 0
    ? ((scrollY.value / docHeight.value) * 100).toFixed(2)
    : "0.00"
);
const units = computed(() =>
  docHeight.value > 0 ? scrollPxToUnits(scrollY.value).toFixed(2) : "0.00"
);
</script>

<template>
  <DevOnly>
    <div class="scroll-debug" aria-hidden="true">
      <div class="row">
        <span class="k">scrollY</span>
        <span class="v">{{ scrollY }}px</span>
      </div>
      <div class="row">
        <span class="k">% of docHeight</span>
        <span class="v">{{ pctDoc }}%</span>
      </div>
      <div class="row">
        <span class="k">units (% scrollable)</span>
        <span class="v">{{ units }}</span>
      </div>
    </div>
  </DevOnly>
</template>

<style scoped>
.scroll-debug {
  position: fixed;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 9999;
  padding: 0.5rem 0.75rem;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px;
  line-height: 1.4;
  color: #22c55e;
  background: rgb(0 0 0 / 75%);
  border: 1px solid rgb(34 197 94 / 50%);
  border-radius: 6px;
  /* stylelint-disable-next-line order/properties-order */
  pointer-events: none;
  user-select: none;
}

.row {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.k {
  color: rgb(34 197 94 / 60%);
}

.v {
  font-weight: 600;
}
</style>
