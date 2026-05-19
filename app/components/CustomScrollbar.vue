<script setup lang="ts">
const MIN_THUMB_HEIGHT = 30;
const TRACK_INSET = 8;

const { getInstance: getLenis } = useLenis();

const thumbTop = ref(0);
const thumbHeight = ref(0);
const isScrollable = ref(false);
const isDragging = ref(false);

let dragStartY = 0;
let dragStartScroll = 0;
let resizeObserver: ResizeObserver | null = null;

function update() {
  if (import.meta.server) return;
  const scrollHeight = document.documentElement.scrollHeight;
  const viewport = window.innerHeight;
  const scrollY = window.scrollY;
  const maxScroll = scrollHeight - viewport;

  if (maxScroll <= 0) {
    isScrollable.value = false;
    return;
  }
  isScrollable.value = true;

  const trackHeight = viewport - TRACK_INSET * 2;
  const proposedThumb = (viewport / scrollHeight) * trackHeight;
  const actualThumb = Math.max(MIN_THUMB_HEIGHT, proposedThumb);
  const travel = trackHeight - actualThumb;

  thumbHeight.value = actualThumb;
  thumbTop.value = TRACK_INSET + (scrollY / maxScroll) * travel;
}

function onThumbPointerDown(e: PointerEvent) {
  e.preventDefault();
  isDragging.value = true;
  dragStartY = e.clientY;
  dragStartScroll = window.scrollY;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return;
  const viewport = window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  const trackHeight = viewport - TRACK_INSET * 2;
  const travel = trackHeight - thumbHeight.value;
  if (travel <= 0) return;
  const maxScroll = scrollHeight - viewport;
  const deltaY = e.clientY - dragStartY;
  const targetScroll = Math.max(
    0,
    Math.min(maxScroll, dragStartScroll + (deltaY / travel) * maxScroll)
  );
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(targetScroll, { immediate: true, force: true });
  } else {
    window.scrollTo({ top: targetScroll });
  }
}

function onPointerUp() {
  isDragging.value = false;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
}

function onScroll() {
  update();
}

function onResize() {
  update();
}

onMounted(() => {
  if (import.meta.server) return;
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  resizeObserver = new ResizeObserver(() => update());
  resizeObserver.observe(document.documentElement);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<template>
  <div
    v-if="isScrollable"
    class="custom-scrollbar"
    :class="{ dragging: isDragging }"
    aria-hidden="true"
  >
    <div
      class="custom-scrollbar-thumb"
      :style="{ top: `${thumbTop}px`, height: `${thumbHeight}px` }"
      @pointerdown="onThumbPointerDown"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar {
  position: fixed;
  top: 0;
  right: 4px;
  bottom: 0;
  z-index: 60;
  width: 8px;
  pointer-events: none;
}

.custom-scrollbar-thumb {
  position: absolute;
  left: 0;
  width: 100%;
  pointer-events: auto;
  cursor: grab;
  background: #dd6031;
  border-radius: 999px;
  transition: background 200ms ease-out;
}

.custom-scrollbar-thumb:hover,
.custom-scrollbar.dragging .custom-scrollbar-thumb {
  background: #e3744a;
}

.custom-scrollbar.dragging .custom-scrollbar-thumb {
  cursor: grabbing;
}
</style>
