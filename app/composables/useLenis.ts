import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let pluginRegistered = false;

export function useLenis() {
  const isInitialized = ref(false);

  function init() {
    if (import.meta.server || lenisInstance) return;

    if (!pluginRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      pluginRegistered = true;
    }

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisInstance.on("scroll", ScrollTrigger.update);

    tickerCallback = (time: number) => {
      lenisInstance?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    isInitialized.value = true;
  }

  function destroy() {
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
    }
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
      isInitialized.value = false;
    }
  }

  function getInstance() {
    return lenisInstance;
  }

  function stop() {
    lenisInstance?.stop();
  }

  function start() {
    lenisInstance?.start();
  }

  return {
    init,
    destroy,
    isInitialized,
    getInstance,
    stop,
    start,
  };
}
