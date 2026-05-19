<script setup lang="ts">
import gsap from "gsap";

interface NavItem {
  path: string;
  label: string;
  angle: number;
}

const R = 500;
const CENTER_Y_OFFSET = 360;
const PADDING = 20;
const SVG_SIZE = (R + PADDING) * 2;
const SVG_TOP = -CENTER_Y_OFFSET - R - PADDING;
const SVG_LEFT_OFFSET = -(R + PADDING);
const VIEWBOX = `${-(R + PADDING)} ${-(R + PADDING)} ${SVG_SIZE} ${SVG_SIZE}`;

const VISIBLE_ANGLE_MAX = (Math.acos(CENTER_Y_OFFSET / R) * 180) / Math.PI;
const SHOW_THRESHOLD_Y = 140;
const HIDE_THRESHOLD_Y = 220;
const HIDE_DELAY_MS = 400;
const ROTATION_DURATION = 0.35;
const TOUCH_SENSITIVITY = 0.2;
const SWIPE_ZONE_HIDDEN_VH = 10;
const SWIPE_ZONE_VISIBLE_VH = 50;
const TRIGGER_STRIP_VW = 40;
const TRIGGER_STRIP_LEFT_VW = (100 - TRIGGER_STRIP_VW) / 2;

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home", angle: -30 },
  { path: "/about", label: "About", angle: -10 },
  { path: "/contact", label: "Contact", angle: 10 },
  { path: "/resume", label: "Resume", angle: 30 },
];

const MAX_DOT_ANGLE = Math.max(...NAV_ITEMS.map((it) => Math.abs(it.angle)));
const MAX_ROTATION = VISIBLE_ANGLE_MAX - MAX_DOT_ANGLE;

const route = useRoute();

const isTouch = ref(false);
const isVisible = ref(false);
const rotation = ref(0);
const focusedIdx = ref(0);
const hasShownHint = ref(false);

const isNavActive = useState("orbital-nav-active", () => false);

const rotationState = { value: 0 };
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let rafId: number | null = null;
let pendingEvent: MouseEvent | null = null;

function processMouseMove() {
  rafId = null;
  if (!pendingEvent) return;
  const e = pendingEvent;
  pendingEvent = null;

  const stripHalfPx = window.innerWidth * (TRIGGER_STRIP_VW / 200);
  const inTriggerStrip =
    Math.abs(e.clientX - window.innerWidth / 2) < stripHalfPx;

  if (e.clientY < SHOW_THRESHOLD_Y && inTriggerStrip) {
    show();
  } else if (e.clientY > HIDE_THRESHOLD_Y) {
    scheduleHide();
    return;
  }

  const cx = window.innerWidth / 2;
  const cy = -CENTER_Y_OFFSET;
  const xRel = e.clientX - cx;
  const yRel = e.clientY - cy;

  // True polar angle of cursor from circle center, measured from down-vertical.
  let targetAngle = (Math.atan2(xRel, yRel) * 180) / Math.PI;
  targetAngle = Math.max(
    -VISIBLE_ANGLE_MAX,
    Math.min(VISIBLE_ANGLE_MAX, targetAngle)
  );

  gsap.to(rotationState, {
    value: targetAngle,
    duration: ROTATION_DURATION,
    ease: "power3.out",
    overwrite: true,
    onUpdate: () => {
      rotation.value = rotationState.value;
    },
  });
}

function onMouseMove(e: MouseEvent) {
  pendingEvent = e;
  if (rafId == null) {
    rafId = requestAnimationFrame(processMouseMove);
  }
}

function show() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  isVisible.value = true;
  isNavActive.value = true;
}

function scheduleHide() {
  if (hideTimer) return;
  hideTimer = setTimeout(() => {
    isVisible.value = false;
    isNavActive.value = false;
    hideTimer = null;
  }, HIDE_DELAY_MS);
}

function onDotClick(idx: number) {
  const target = NAV_ITEMS[idx]!.path;
  if (target === route.path) return;
  navigateTo(target);
}

let touchStartX = 0;
let touchStartRotation = 0;

function dismissSwipeHint() {
  hasShownHint.value = true;
}

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0];
  if (!t) return;
  if (!isVisible.value) {
    isVisible.value = true;
    isNavActive.value = true;
  }
  touchStartX = t.clientX;
  touchStartRotation = rotationState.value;
  gsap.killTweensOf(rotationState);
}

function onTouchMove(e: TouchEvent) {
  const t = e.touches[0];
  if (!t) return;
  // Swipe left (dx < 0) → rotation increases → wheel rotates clockwise (SVG).
  const dx = t.clientX - touchStartX;
  const next = touchStartRotation - dx * TOUCH_SENSITIVITY;
  const clamped = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, next));
  rotationState.value = clamped;
  rotation.value = clamped;
  if (Math.abs(dx) > 8) dismissSwipeHint();
}

function onDocumentTouch(e: TouchEvent) {
  if (!isVisible.value) return;
  const t = e.touches[0];
  if (!t) return;
  // Ignore touches inside the (expanded) nav region while visible.
  const threshold = window.innerHeight * (SWIPE_ZONE_VISIBLE_VH / 100);
  if (t.clientY <= threshold) return;
  isVisible.value = false;
  isNavActive.value = false;
}

onMounted(() => {
  if (window.matchMedia("(pointer: coarse)").matches) {
    isTouch.value = true;
    document.addEventListener("touchstart", onDocumentTouch, { passive: true });
    return;
  }
  document.addEventListener("mousemove", onMouseMove, { passive: true });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("touchstart", onDocumentTouch);
  if (rafId != null) cancelAnimationFrame(rafId);
  if (hideTimer) clearTimeout(hideTimer);
});
</script>

<template>
  <div
    class="orbital-nav"
    :class="{ visible: isVisible, touch: isTouch }"
    aria-hidden="true"
  >
    <div
      v-if="isTouch"
      class="swipe-zone"
      :style="{
        height: `${isVisible ? SWIPE_ZONE_VISIBLE_VH : SWIPE_ZONE_HIDDEN_VH}vh`,
        width: isVisible ? '100vw' : `${TRIGGER_STRIP_VW}vw`,
        left: isVisible ? '0' : `${TRIGGER_STRIP_LEFT_VW}vw`,
      }"
      @touchstart.passive="onTouchStart"
      @touchmove.prevent="onTouchMove"
    />
    <div
      v-if="isTouch && isVisible && !hasShownHint"
      class="swipe-hint glass-pane"
      aria-hidden="true"
    >
      <span class="swipe-hint-label">Swipe to navigate</span>
      <div class="swipe-track">
        <div class="swipe-dot" />
      </div>
    </div>
    <svg
      class="orbital-svg"
      :style="{
        top: `${SVG_TOP}px`,
        marginLeft: `${SVG_LEFT_OFFSET}px`,
        width: `${SVG_SIZE}px`,
        height: `${SVG_SIZE}px`,
      }"
      :viewBox="VIEWBOX"
    >
      <circle cx="0" cy="0" :r="R" class="arc-stroke" />
      <g :transform="`rotate(${rotation})`">
        <g
          v-for="(item, idx) in NAV_ITEMS"
          :key="item.path"
          :transform="`rotate(${item.angle}) translate(0, ${R})`"
          :class="[
            'dot-group',
            {
              focused: focusedIdx === idx,
              active: route.path === item.path,
            },
          ]"
          @click="onDotClick(idx)"
        >
          <circle r="5" class="dot" />
          <circle r="11" class="dot-ring" />
          <text
            :transform="`rotate(${-(rotation + item.angle)})`"
            y="26"
            text-anchor="middle"
            class="dot-label"
          >
            {{ item.label }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.orbital-nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100vw;
  height: 0;
  pointer-events: none;
}

.swipe-zone {
  position: absolute;
  top: 0;
  pointer-events: auto;
  touch-action: none;
}

.swipe-hint {
  position: absolute;
  top: calc(50vh - 80px);
  left: 50%;
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 10px 22px;
  pointer-events: none;
  border-radius: 999px;
  transform: translateX(-50%);
  animation: swipe-hint-fade-in 320ms ease-out both;
}

.swipe-hint-label {
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 11px;
  color: #587b7f;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.swipe-track {
  position: relative;
  width: 36px;
  height: 2px;
  background: rgb(88 123 127 / 35%);
  border-radius: 1px;
}

.swipe-dot {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  background: #dd6031;
  border-radius: 50%;
  box-shadow: 0 0 6px rgb(221 96 49 / 60%);
  transform: translateY(-50%);
  animation: swipe-dot-slide 2.4s infinite;
}

@keyframes swipe-hint-fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, 6px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes swipe-dot-slide {
  0% {
    left: -3px;
    opacity: 0;
  }

  8% {
    left: -3px;
    opacity: 1;
    animation-timing-function: cubic-bezier(0.4, 0, 1, 0.6);
  }

  46% {
    left: calc(100% - 3px);
    animation-timing-function: cubic-bezier(0, 0.4, 0.6, 1);
  }

  54% {
    left: 50%;
    animation-timing-function: cubic-bezier(0.4, 0, 1, 0.6);
  }

  80% {
    left: -3px;
    opacity: 1;
  }

  100% {
    left: -3px;
    opacity: 0;
  }
}

.orbital-svg {
  position: absolute;
  left: 50%;
  overflow: visible;
  opacity: 0;
  transform: translateY(-80px);
  transition:
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease-out;
}

.orbital-nav.visible .orbital-svg {
  opacity: 1;
  transform: translateY(0);
}

.arc-stroke {
  fill: rgb(4 3 3 / 35%);
  stroke: rgb(88 123 127 / 35%);
  stroke-width: 1;
}

.dot {
  fill: #f2f4f3;
  transition:
    r 220ms ease-out,
    fill 220ms ease-out;
}

.dot-ring {
  opacity: 0;
  fill: transparent;
  stroke: #dd6031;
  stroke-width: 1.5;
  transition: opacity 220ms ease-out;
}

.dot-group {
  pointer-events: auto;
  cursor: pointer;
}

.dot-group.active .dot {
  r: 7;
  fill: #dd6031;
}

.dot-group.active .dot-ring {
  opacity: 1;
}

.dot-label {
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  fill: #f2f4f3;
  transition: fill 220ms ease-out;
}

.dot-group.active .dot-label {
  fill: #dd6031;
}
</style>
