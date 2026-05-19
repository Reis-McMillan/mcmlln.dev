<script setup lang="ts">
import gsap from "gsap";
const { unitsToScrollPx } = useScrollUnits();

const props = defineProps<{
  scrollStart: number;
  scrollEnd: number;
}>();

interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  link?: string;
  tint: string;
}

const PANE_WIDTH_DESKTOP = 720;
const PANE_HEIGHT_DESKTOP = 360;
const PANE_GAP_DESKTOP = 96;
const PANE_GAP_MOBILE = 32;
const MOBILE_BREAKPOINT_PX = 640;
const SNAP_DEBOUNCE_MS = 80;
const SNAP_DURATION_S = 0.5;
const SNAP_VELOCITY_THRESHOLD = 0.5;

let PANE_WIDTH = PANE_WIDTH_DESKTOP;
let PANE_HEIGHT = PANE_HEIGHT_DESKTOP;
let PANE_GAP = PANE_GAP_DESKTOP;
let xStart = 0;
let xEnd = 0;

const paneWidthPx = ref(PANE_WIDTH_DESKTOP);
const paneHeightPx = ref(PANE_HEIGHT_DESKTOP);
const paneGapPx = ref(PANE_GAP_DESKTOP);

function applyPaneDimensions() {
  if (window.innerWidth < MOBILE_BREAKPOINT_PX) {
    PANE_WIDTH = Math.min(window.innerWidth - 48, 360);
    PANE_HEIGHT = Math.round(PANE_WIDTH * 1.2);
    PANE_GAP = PANE_GAP_MOBILE;
  } else {
    PANE_WIDTH = PANE_WIDTH_DESKTOP;
    PANE_HEIGHT = PANE_HEIGHT_DESKTOP;
    PANE_GAP = PANE_GAP_DESKTOP;
  }
  paneWidthPx.value = PANE_WIDTH;
  paneHeightPx.value = PANE_HEIGHT;
  paneGapPx.value = PANE_GAP;
}

function containerWidthPx(): number {
  return projects.length * PANE_WIDTH + (projects.length - 1) * PANE_GAP;
}

function computeXBounds() {
  const cw = containerWidthPx();
  xStart = ((window.innerWidth / 2) * 100) / cw;
  xEnd = (-(window.innerWidth / 2 + cw) * 100) / cw;
}

const projects: Project[] = [
  {
    title: "Moneypenny",
    description:
      "Moneypenny is an AI email assistant, capable of supporting " +
      "multiple emails for a user. As a RAG agent, Moneypenny ingests " +
      "users' emails and creates vector embeddings to encode the " +
      "contents of each email, enabling semantic search.",
    tech: ["vLLM", "Vector Search", "LangChain", "MongoDB"],
    github: "https://github.com/Reis-McMillan/moneypenny",
    link: "https://moneypenny.mcmlln.dev",
    tint: "#22c55e",
  },
  {
    title: "Verys",
    description:
      "Verys is an federated identity provider that adheres to the " +
      "OpenID Connect standard. Users can link accounts from external " +
      "identity providers for which the access tokens can be propogated " +
      "to services downstream of Verys, provided the user gives consent.",
    tech: ["OpenID Connect", "FastAPI", "PostgreSQL"],
    github: "https://github.com/Reis-McMillan/moneypenny",
    link: "https://verys.mcmlln.dev",
    tint: "#af4d98",
  },
  {
    title: "Email MCP Server",
    description:
      "In order to enable Moneypenny to perform actions with " +
      "user emails, like drafting, sending, and trashing emails, " +
      "I built an MCP Server which is email provider agnostic.",
    tech: ["OpenID Connect", "FastAPI", "PostgreSQL"],
    github: "https://github.com/Reis-McMillan/moneypenny",
    tint: "#ab3428",
  },
  {
    title: "Modernizing Fracdiff Python Package",
    description:
      "Fracdiff-modern brings an out-dated fractional differencing Python package " +
      "up-to-date, implementing a modern build system with support for " +
      "newer Python versions.",
    tech: ["Python", "GitHub Actions", "Scikit-Learn", "PyTorch"],
    github: "https://github.com/Reis-McMillan/fracdiff-modern",
    link: "https://reis-mcmillan.github.io/fracdiff-modern/",
    tint: "#3fa7d6",
  },
  {
    title: "Installing Arch Linux",
    description:
      "Yea, I'll admit it... I use Arch. I removed the original Windows " +
      "OS on my HP Envy x360 2-in-1, and installed Arch instead. I even " +
      "enabled facial recognition and tablet mode for the new OS. " +
      "Haven't looked back since.",
    tech: ["System Management", "UEFI Firmware", "Hardware Interfacing"],
    tint: "#f59e0b",
  },
];

const PROXIMITY_RANGE_PX = 400;
const PROJECTION_MAX_OPACITY = 0.35;

const sectionRoot = ref<HTMLElement | null>(null);
const panesContainer = ref<HTMLElement | null>(null);
const paneRefs = ref<HTMLElement[]>([]);
const projectionRefs = ref<HTMLElement[]>([]);
const titlePaneEl = ref<HTMLElement | null>(null);

const sync = useSceneSync();
const { getInstance: getLenis } = useLenis();

let revealTimeline: gsap.core.Timeline | null = null;
let tickerFn: ((time: number) => void) | null = null;
let snapTimer: ReturnType<typeof setTimeout> | null = null;
let isSnapping = false;

function smoothstep(x: number, edge0: number, edge1: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const SHADOW_DEPTH_PX = 320;
const SHADOW_CORNER_RADIUS = 18;

function projectRayToFloor(
  cornerX: number,
  cornerY: number,
  sunX: number,
  sunY: number,
  floorY: number
): number {
  const denom = cornerY - sunY;
  if (Math.abs(denom) < 0.01) return cornerX;
  const t = (floorY - sunY) / denom;
  return sunX + t * (cornerX - sunX);
}

function roundedPolygonPath(
  points: { x: number; y: number }[],
  radius: number
): string {
  const n = points.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n]!;
    const curr = points[i]!;
    const next = points[(i + 1) % n]!;
    const dxPrev = prev.x - curr.x;
    const dyPrev = prev.y - curr.y;
    const lenPrev = Math.hypot(dxPrev, dyPrev) || 1;
    const rPrev = Math.min(radius, lenPrev / 2);
    const entryX = curr.x + (dxPrev / lenPrev) * rPrev;
    const entryY = curr.y + (dyPrev / lenPrev) * rPrev;
    const dxNext = next.x - curr.x;
    const dyNext = next.y - curr.y;
    const lenNext = Math.hypot(dxNext, dyNext) || 1;
    const rNext = Math.min(radius, lenNext / 2);
    const exitX = curr.x + (dxNext / lenNext) * rNext;
    const exitY = curr.y + (dyNext / lenNext) * rNext;
    d += (i === 0 ? "M" : " L") + ` ${entryX} ${entryY}`;
    d += ` Q ${curr.x} ${curr.y} ${exitX} ${exitY}`;
  }
  return d + " Z";
}

function updateProjections() {
  if (!paneRefs.value.length) return;
  const screenCenterX = window.innerWidth / 2;
  for (let i = 0; i < paneRefs.value.length; i++) {
    const pane = paneRefs.value[i];
    const projection = projectionRefs.value[i];
    if (!pane || !projection) continue;
    const rect = pane.getBoundingClientRect();
    const paneCenterX = rect.left + rect.width / 2;
    const distance = Math.abs(paneCenterX - screenCenterX);
    const proximity = 1 - smoothstep(distance, 0, PROXIMITY_RANGE_PX);
    pane.style.setProperty("--glow-intensity", String(proximity));
    projection.style.opacity = String(proximity * PROJECTION_MAX_OPACITY);

    const sunX = sync.sunScreenX;
    const sunY = Math.min(sync.sunScreenY, rect.top - 50);
    const floorY = rect.bottom + SHADOW_DEPTH_PX;
    const farLeftX = projectRayToFloor(rect.left, rect.top, sunX, sunY, floorY);
    const farRightX = projectRayToFloor(
      rect.right,
      rect.top,
      sunX,
      sunY,
      floorY
    );

    const corners = [
      { x: rect.left, y: rect.bottom },
      { x: rect.right, y: rect.bottom },
      { x: farRightX, y: floorY },
      { x: farLeftX, y: floorY },
    ];
    const d = roundedPolygonPath(corners, SHADOW_CORNER_RADIUS);
    projection.style.clipPath = `path("${d}")`;
  }
}

function getXPercentForScrollPercent(sp: number): number {
  const range = props.scrollEnd - props.scrollStart;
  if (range <= 0) return xStart;
  const t = Math.max(0, Math.min(1, (sp - props.scrollStart) / range));
  return xStart - t * (xStart - xEnd);
}

function getXPercentForPane(idx: number): number {
  const offsetX = idx * (PANE_WIDTH + PANE_GAP);
  return -((offsetX + PANE_WIDTH / 2) * 100) / containerWidthPx();
}

function getScrollYForXPercent(targetXPercent: number): number {
  const t = (xStart - targetXPercent) / (xStart - xEnd);
  const scrollPercent =
    props.scrollStart + t * (props.scrollEnd - props.scrollStart);
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  return (pageHeight * scrollPercent) / 100;
}

function currentScrollPercent(): number {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (pageHeight <= 0) return 0;
  return (window.scrollY / pageHeight) * 100;
}

function snapToNearestPane() {
  const lenis = getLenis();
  if (lenis && Math.abs(lenis.velocity) > SNAP_VELOCITY_THRESHOLD) {
    snapTimer = setTimeout(snapToNearestPane, SNAP_DEBOUNCE_MS);
    return;
  }

  const currentX = getXPercentForScrollPercent(currentScrollPercent());
  let closestIdx = 0;
  let minDist = Infinity;
  for (let i = 0; i < projects.length; i++) {
    const target = getXPercentForPane(i);
    const dist = Math.abs(currentX - target);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = i;
    }
  }
  const targetXPercent = getXPercentForPane(closestIdx);
  const targetScrollY = getScrollYForXPercent(targetXPercent);
  if (Math.abs(targetScrollY - window.scrollY) < 2) return;

  isSnapping = true;
  const release = () => {
    isSnapping = false;
  };
  if (lenis) {
    lenis.scrollTo(targetScrollY, {
      duration: SNAP_DURATION_S,
      onComplete: release,
    });
    setTimeout(release, (SNAP_DURATION_S + 0.3) * 1000);
  } else {
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    setTimeout(release, SNAP_DURATION_S * 1000);
  }
}

function handleScroll() {
  if (isSnapping) return;
  if (snapTimer) clearTimeout(snapTimer);
  const sp = currentScrollPercent();
  if (sp < props.scrollStart || sp > props.scrollEnd) return;
  const currentX = getXPercentForScrollPercent(sp);
  // Only snap while at least one pane's center sits within the inner 75% of
  // the viewport. Pane centers run from firstOffset to firstOffset+(N-1)·d
  // measured from screen-center; that range overlaps [-0.375vw, +0.375vw]
  // iff firstOffset ≤ +0.375vw AND lastOffset ≥ -0.375vw.
  const cw = containerWidthPx();
  const halfInner = 0.375 * window.innerWidth;
  const firstOffset = (currentX * cw) / 100 + PANE_WIDTH / 2;
  const lastOffset =
    firstOffset + (projects.length - 1) * (PANE_WIDTH + PANE_GAP);
  if (firstOffset > halfInner || lastOffset < -halfInner) return;
  snapTimer = setTimeout(snapToNearestPane, SNAP_DEBOUNCE_MS);
}

function handleResize() {
  applyPaneDimensions();
  computeXBounds();
  if (revealTimeline) {
    revealTimeline.scrollTrigger?.refresh();
  }
}

onMounted(() => {
  if (import.meta.server) return;
  if (!sectionRoot.value || !panesContainer.value) return;

  applyPaneDimensions();
  computeXBounds();

  gsap.set(titlePaneEl.value, { autoAlpha: 0 });

  revealTimeline = gsap.timeline({
    scrollTrigger: {
      start: unitsToScrollPx(props.scrollStart),
      end: unitsToScrollPx(props.scrollEnd),
      scrub: 1,
    },
  });
  revealTimeline
    .fromTo(
      panesContainer.value,
      { xPercent: xStart },
      { xPercent: xEnd, ease: "none", duration: 10 },
      0
    )
    .to(titlePaneEl.value, { autoAlpha: 1, duration: 1.5 }, 0)
    .to(titlePaneEl.value, { autoAlpha: 0, duration: 1.5 }, 8.5);

  tickerFn = () => updateProjections();
  gsap.ticker.add(tickerFn);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
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
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  if (snapTimer) {
    clearTimeout(snapTimer);
    snapTimer = null;
  }
});
</script>

<template>
  <section
    ref="sectionRoot"
    class="pointer-events-none fixed inset-0 z-10 overflow-hidden"
  >
    <h2
      ref="titlePaneEl"
      class="absolute top-12 left-12 z-20 inline-block px-3 py-1 text-4xl font-thin opacity-0 before:absolute before:top-0 before:left-0 before:h-3 before:w-3 before:rounded-tl-md before:border-t-2 before:border-l-2 before:border-[#DD6031] before:content-[''] after:absolute after:right-0 after:bottom-0 after:h-3 after:w-3 after:rounded-br-md after:border-r-2 after:border-b-2 after:border-[#DD6031] after:content-['']"
    >
      My Projects
    </h2>
    <div
      ref="panesContainer"
      class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2"
      :style="{ gap: `${paneGapPx}px` }"
    >
      <div
        v-for="project in projects"
        :key="project.title"
        ref="paneRefs"
        class="glass-pane project-card pointer-events-auto"
        :style="{
          '--tint-color': project.tint,
          width: `${paneWidthPx}px`,
          height: `${paneHeightPx}px`,
        }"
      >
        <h3 class="engraved mb-3 text-xl font-bold">
          {{ project.title }}
        </h3>
        <p class="engraved mb-4 text-sm leading-relaxed">
          {{ project.description }}
        </p>
        <div class="mb-4 flex flex-wrap gap-2">
          <span
            v-for="t in project.tech"
            :key="t"
            class="engraved rounded border border-white/10 px-2 py-1 text-[10px] tracking-wider uppercase"
          >
            {{ t }}
          </span>
        </div>
        <div class="absolute right-5 bottom-5 flex gap-2">
          <a
            v-if="project.link"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-button engraved"
            :title="`${project.title} — project link`"
          >
            <Icon name="lucide:external-link" size="18" />
          </a>
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-button engraved"
            :title="`${project.title} — GitHub`"
          >
            <Icon name="lucide:github" size="18" />
          </a>
        </div>
      </div>
    </div>
    <div
      v-for="project in projects"
      :key="`proj-${project.title}`"
      ref="projectionRefs"
      class="projection"
      :style="{ '--tint-color': project.tint }"
    ></div>
  </section>
</template>

<style scoped>
.project-card {
  overflow: hidden;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: rgb(255 255 255 / 85%);
  pointer-events: auto;
  background: rgb(255 255 255 / 6%);
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 9999px;
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s;
}

.icon-button:hover {
  color: rgb(255 255 255 / 100%);
  background: color-mix(in srgb, var(--tint-color, #fff) 18%, transparent);
  border-color: color-mix(in srgb, var(--tint-color, #fff) 60%, transparent);
}

.projection {
  position: fixed;
  inset: 0;
  z-index: 9;
  pointer-events: none;
  background: var(--tint-color, #fff);
  opacity: 0;
  filter: blur(40px);
}
</style>
