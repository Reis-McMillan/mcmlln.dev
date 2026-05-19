<script setup lang="ts">
import { ScrollTrigger } from "gsap/ScrollTrigger";

const isNavActive = useState("orbital-nav-active", () => false);
const isFooterVisible = useState("footer-visible", () => false);
const currentYear = new Date().getFullYear();
const route = useRoute();

const REVEAL_THRESHOLD_PX = 100;

let trigger: ScrollTrigger | null = null;

function handleScroll() {
  const remaining =
    document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
  isFooterVisible.value = window.scrollY > 0 && remaining < REVEAL_THRESHOLD_PX;
}

function cleanup() {
  trigger?.kill();
  trigger = null;
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
  isFooterVisible.value = false;
}

function setupForRoute(path: string) {
  cleanup();
  if (path === "/") {
    // Home: appear alongside the ContactSection at scroll 85%.
    trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "85% top",
      onEnter: () => {
        isFooterVisible.value = true;
      },
      onLeaveBack: () => {
        isFooterVisible.value = false;
      },
    });
    // Footer mounts before the page slot's 1200vh spacer is in the DOM, so
    // ScrollTrigger initially captures a stale (tiny) document height. Refresh
    // after layout settles so the 85% trigger lines up with the real page end.
    setTimeout(() => trigger?.refresh(), 100);
    setTimeout(() => trigger?.refresh(), 600);
  } else {
    // Other pages: appear once the user is within REVEAL_THRESHOLD_PX of the
    // document bottom.
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
  }
}

onMounted(() => {
  if (import.meta.server) return;
  setupForRoute(route.path);
});

watch(
  () => route.path,
  (newPath) => {
    setupForRoute(newPath);
  }
);

onBeforeUnmount(() => {
  cleanup();
});
</script>

<template>
  <footer
    class="footer-bar"
    :class="{ 'is-hidden': isNavActive || !isFooterVisible }"
    aria-label="Site footer"
  >
    <div class="footer-row footer-row-main">
      <span class="rule rule-start" />
      <span class="text">Find me on</span>
      <span class="rule rule-long" />
      <a
        href="https://www.linkedin.com/in/reis-t-mcmillan/"
        target="_blank"
        rel="noopener noreferrer"
        class="text text--icon"
        aria-label="LinkedIn"
      >
        <Icon name="lucide:linkedin" size="22" />
      </a>
      <a
        href="https://github.com/Reis-McMillan"
        target="_blank"
        rel="noopener noreferrer"
        class="text text--icon"
        aria-label="GitHub"
      >
        <Icon name="lucide:github" size="22" />
      </a>
      <span class="rule rule-end" />
    </div>
    <div class="footer-row footer-row-copy">
      <span class="text text-copy">© {{ currentYear }} Reis McMillan</span>
    </div>
  </footer>
</template>

<style scoped>
.footer-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 45;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 128px;
  padding: 0 24px;
  pointer-events: none;
  background: color-mix(in srgb, #fff 8%, transparent);
  border-top: 1px solid color-mix(in srgb, #fff 20%, transparent);
  backdrop-filter: blur(14px);
  transition: opacity 260ms ease-out;
}

.footer-bar.is-hidden {
  opacity: 0;
}

.footer-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.footer-row-main {
  gap: 12px;
}

.footer-row-copy {
  justify-content: center;
  margin-top: 4px;
}

.rule {
  flex: 0 0 auto;
  height: 1px;
  background: #dd6031;
}

.rule-start,
.rule-end {
  width: 14px;
  transition: width 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.footer-bar:not(.is-hidden) .rule-start,
.footer-bar:not(.is-hidden) .rule-end {
  width: 24px;
}

.rule-long {
  flex: 1 1 auto;
}

.text {
  flex: 0 0 auto;
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 24px;
  color: #587b7f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

/* stylelint-disable-next-line selector-class-pattern */
.text--icon {
  display: inline-flex;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;
  transition: color 200ms ease-out;
}

/* stylelint-disable-next-line selector-class-pattern */
.text--icon:hover {
  color: #dd6031;
}

.text-copy {
  padding: 0;
  font-size: 10px;
  color: color-mix(in srgb, #587b7f 80%, transparent);
  letter-spacing: 0.18em;
}
</style>
