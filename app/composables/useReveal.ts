import { onMounted, onBeforeUnmount } from "vue";

interface UseRevealOptions {
  selector?: string;
  rootMargin?: string;
  staggerMs?: number;
  revealedClass?: string;
}

export function useReveal(options: UseRevealOptions = {}) {
  const selector = options.selector ?? ".reveal";
  const rootMargin = options.rootMargin ?? "0px 0px -10% 0px";
  const staggerMs = options.staggerMs ?? 120;
  const revealedClass = options.revealedClass ?? "is-revealed";

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(revealedClass);
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin }
    );

    requestAnimationFrame(() => {
      const viewportHeight = window.innerHeight;
      let staggerIndex = 0;
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight) {
          const delay = staggerIndex * staggerMs;
          staggerIndex += 1;
          window.setTimeout(() => el.classList.add(revealedClass), delay);
        } else {
          observer?.observe(el);
        }
      });
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });
}
