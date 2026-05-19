<script setup lang="ts">
import * as THREE from "three";
import gsap from "gsap";

interface SkillItem {
  name: string;
  icon: string;
  description: string;
}

const HOVER_SCALE = 1.6;
const HOVER_LERP = 0.18;
const HIT_RADIUS = 56;
const HOVER_DEPTH_THRESHOLD = 0.3;
const SECTION_ACTIVE_THRESHOLD = 0.5;
const ROW_LATITUDES = [Math.PI / 36, 0, -Math.PI / 36];
const ICON_SPAN = Math.PI * 0.5;
const SNAP_DEBOUNCE_MS = 100;
const SNAP_DURATION_S = 0.6;
const SNAP_VELOCITY_THRESHOLD = 0.5;
const MAX_OPACITY_TIMELINE_T = 0.5;

const { unitsToScrollPx } = useScrollUnits();
const { getInstance: getLenis } = useLenis();

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    icons: SkillItem[];
    scrollStart: number;
    scrollEnd: number;
    iconRadius?: number;
  }>(),
  { iconRadius: 200 }
);

const ICON_FADE_DURATION = 2.5 / props.icons.length;

const titleEl = ref<HTMLElement | null>(null);
const titlePaneEl = ref<HTMLElement | null>(null);
const iconWrappers = ref<HTMLElement[]>([]);
const iconInners = ref<HTMLElement[]>([]);
const sync = useSceneSync();
const hoveredIndex = ref<number | null>(null);
const hoveredSkill = computed(() =>
  hoveredIndex.value !== null ? (props.icons[hoveredIndex.value] ?? null) : null
);

const anchors: {
  lat: number;
  lon: number;
  hoverScale: number;
  sx: number;
  sy: number;
  depthOpacity: number;
}[] = [];

let lastMouseX = -1;
let lastMouseY = -1;

const pos = new THREE.Vector3();
const camDirVec = new THREE.Vector3();
const iconDirVec = new THREE.Vector3();
const projVec = new THREE.Vector3();

let revealTimeline: gsap.core.Timeline | null = null;
let tickerFn: ((time: number) => void) | null = null;
let snapTimer: ReturnType<typeof setTimeout> | null = null;
let isSnapping = false;

function currentScrollPercent(): number {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (pageHeight <= 0) return 0;
  return (window.scrollY / pageHeight) * 100;
}

function maxOpacityScrollPercent(): number {
  return (
    props.scrollStart +
    MAX_OPACITY_TIMELINE_T * (props.scrollEnd - props.scrollStart)
  );
}

function snapToMaxOpacity() {
  const lenis = getLenis();
  if (lenis && Math.abs(lenis.velocity) > SNAP_VELOCITY_THRESHOLD) {
    snapTimer = setTimeout(snapToMaxOpacity, SNAP_DEBOUNCE_MS);
    return;
  }
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const targetY = (pageHeight * maxOpacityScrollPercent()) / 100;
  if (Math.abs(targetY - window.scrollY) < 2) return;

  isSnapping = true;
  const release = () => {
    isSnapping = false;
  };
  if (lenis) {
    lenis.scrollTo(targetY, {
      duration: SNAP_DURATION_S,
      onComplete: release,
    });
    setTimeout(release, (SNAP_DURATION_S + 0.3) * 1000);
  } else {
    window.scrollTo({ top: targetY, behavior: "smooth" });
    setTimeout(release, SNAP_DURATION_S * 1000);
  }
}

function handleScroll() {
  if (isSnapping) return;
  if (snapTimer) clearTimeout(snapTimer);
  const sp = currentScrollPercent();
  if (sp < props.scrollStart || sp > props.scrollEnd) return;
  snapTimer = setTimeout(snapToMaxOpacity, SNAP_DEBOUNCE_MS);
}

function placeAnchors() {
  anchors.length = 0;
  const total = props.icons.length;
  if (total === 0) return;
  const perRow = total / 3;
  const sideOffset = ICON_SPAN / (2 * perRow);

  for (let r = 0; r < ROW_LATITUDES.length; r++) {
    const lat = ROW_LATITUDES[r]!;
    const isMiddle = r === 1;
    const rowOffset = isMiddle ? -sideOffset / 2 : sideOffset / 2;
    for (let i = 0; i < perRow; i++) {
      const lon = ((i + 0.5) / perRow) * ICON_SPAN + rowOffset;
      anchors.push({
        lat,
        lon,
        hoverScale: 1,
        sx: 0,
        sy: 0,
        depthOpacity: 0,
      });
    }
  }
}

function updateIcons() {
  if (!sync.camera) return;
  const R = props.iconRadius;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const sectionActive = isSectionActive();
  camDirVec.subVectors(sync.camera.position, sync.sphereCenter).normalize();

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]!;
    const inner = iconInners.value[i];
    if (!inner) continue;
    const raw = anchor.lon - sync.sphereRotation;
    const wrapped = ((raw % ICON_SPAN) + ICON_SPAN) % ICON_SPAN;
    const lonEff = Math.PI / 2 - ICON_SPAN / 2 + wrapped;
    const cosLat = Math.cos(anchor.lat);
    pos
      .set(
        R * cosLat * Math.cos(lonEff),
        R * Math.sin(anchor.lat),
        R * cosLat * Math.sin(lonEff)
      )
      .add(sync.sphereCenter);
    iconDirVec.subVectors(pos, sync.sphereCenter).normalize();
    const dot = camDirVec.dot(iconDirVec);
    const arcDistance = Math.min(wrapped, ICON_SPAN - wrapped);
    const arcEdgeFade = THREE.MathUtils.smoothstep(arcDistance, 0, 0.05);
    const depthOpacity =
      THREE.MathUtils.smoothstep(dot, 0.75, 0.8) * arcEdgeFade;
    const iconDist = sync.camera.position.distanceTo(pos);
    const baseScale = THREE.MathUtils.clamp(60 / iconDist, 0.4, 1.2);
    const targetHover = i === hoveredIndex.value ? HOVER_SCALE : 1;
    anchor.hoverScale += (targetHover - anchor.hoverScale) * HOVER_LERP;
    const scale = baseScale * anchor.hoverScale;
    projVec.copy(pos).project(sync.camera);
    const sx = (projVec.x + 1) * 0.5 * w;
    const sy = (-projVec.y + 1) * 0.5 * h;
    anchor.sx = sx;
    anchor.sy = sy;
    anchor.depthOpacity = depthOpacity;
    inner.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(${scale})`;
    inner.style.opacity = String(depthOpacity);
    inner.style.pointerEvents =
      sectionActive && depthOpacity > HOVER_DEPTH_THRESHOLD ? "auto" : "none";
  }

  if (!sectionActive && hoveredIndex.value !== null) {
    hoveredIndex.value = null;
    sync.spinPaused = false;
  }
}

function isSectionActive(): boolean {
  const el = titlePaneEl.value;
  if (!el) return false;
  return parseFloat(el.style.opacity || "0") > SECTION_ACTIVE_THRESHOLD;
}

function hitTest() {
  if (!isSectionActive() || lastMouseX < 0) {
    if (hoveredIndex.value !== null) {
      hoveredIndex.value = null;
      sync.spinPaused = false;
    }
    return;
  }
  let bestIdx: number | null = null;
  let bestDist = HIT_RADIUS;
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i]!;
    if (a.depthOpacity < HOVER_DEPTH_THRESHOLD) continue;
    const dx = a.sx - lastMouseX;
    const dy = a.sy - lastMouseY;
    const dist = Math.hypot(dx, dy);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }
  if (bestIdx !== hoveredIndex.value) {
    hoveredIndex.value = bestIdx;
    sync.spinPaused = bestIdx !== null;
  }
}

function handleMouseMove(e: MouseEvent) {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function selectIcon(i: number) {
  if (!isSectionActive()) return;
  hoveredIndex.value = i;
  sync.spinPaused = true;
}

function handleDocumentTouch(e: TouchEvent) {
  if (!isSectionActive()) return;
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (target.closest("[data-skill-icon]")) return;
  if (hoveredIndex.value !== null) {
    hoveredIndex.value = null;
    sync.spinPaused = false;
  }
}

const isTouch = ref(false);

onMounted(() => {
  if (import.meta.server) return;
  if (!titleEl.value) return;

  placeAnchors();

  isTouch.value = window.matchMedia("(pointer: coarse)").matches;

  revealTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: document.documentElement,
      start: unitsToScrollPx(props.scrollStart),
      end: unitsToScrollPx(props.scrollEnd),
      scrub: 1,
    },
  });
  revealTimeline
    .to(titlePaneEl.value, { autoAlpha: 1, duration: 2.5 }, 0)
    .to(
      iconWrappers.value,
      {
        autoAlpha: 1,
        duration: ICON_FADE_DURATION,
        stagger: ICON_FADE_DURATION,
      },
      0
    )
    .to(titlePaneEl.value, { autoAlpha: 0, duration: 2.5 }, 7.5)
    .to(
      iconWrappers.value,
      {
        autoAlpha: 0,
        duration: ICON_FADE_DURATION,
        stagger: ICON_FADE_DURATION,
      },
      7.5
    );

  if (isTouch.value) {
    tickerFn = () => updateIcons();
    document.addEventListener("touchstart", handleDocumentTouch, {
      passive: true,
    });
  } else {
    tickerFn = () => {
      updateIcons();
      hitTest();
    };
    document.addEventListener("mousemove", handleMouseMove);
  }
  gsap.ticker.add(tickerFn);
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  if (revealTimeline) {
    revealTimeline.scrollTrigger?.kill();
    revealTimeline.kill();
    revealTimeline = null;
  }
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("touchstart", handleDocumentTouch);
  window.removeEventListener("scroll", handleScroll);
  if (snapTimer) {
    clearTimeout(snapTimer);
    snapTimer = null;
  }
  hoveredIndex.value = null;
  sync.spinPaused = false;
});
</script>

<template>
  <section class="pointer-events-none fixed inset-0 z-10">
    <div
      ref="titleEl"
      class="absolute top-12 left-1/2 z-20 w-[calc(100%-3rem)] max-w-96 -translate-x-1/2 sm:left-12 sm:w-96 sm:max-w-none sm:translate-x-0"
    >
      <div ref="titlePaneEl" class="glass-pane opacity-0">
        <h2
          class="engraved relative mb-2 inline-block px-3 py-1 text-4xl font-thin before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-['']"
        >
          {{ title }}
        </h2>
        <p class="engraved">{{ description }}</p>
      </div>
      <div class="relative mt-3 h-48">
        <Transition name="fade">
          <div
            v-if="hoveredSkill"
            :key="hoveredSkill.name"
            class="glass-pane detail-pane"
          >
            <h3
              class="engraved relative mb-2 inline-block px-3 py-1 text-xl font-thin before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-['']"
            >
              {{ hoveredSkill.name }}
            </h3>
            <p class="engraved mt-1 text-sm">
              {{ hoveredSkill.description }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
    <div
      v-for="(skill, i) in icons"
      :key="skill.name"
      ref="iconWrappers"
      class="absolute top-0 left-0 opacity-0"
      :data-icon-index="i"
    >
      <div
        ref="iconInners"
        data-skill-icon
        class="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-[#F2F4F3] p-5"
        @click="isTouch && selectIcon(i)"
      >
        <img
          v-if="skill.icon.startsWith('/')"
          :src="skill.icon"
          :alt="skill.name"
          class="h-14 w-14 object-contain"
        />
        <Icon v-else :name="skill.icon" size="56" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.glass-pane {
  backdrop-filter: blur(12px);
}

.detail-pane {
  position: absolute;
  inset: 0;
}
</style>
