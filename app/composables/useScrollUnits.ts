export function useScrollUnits() {
  function unitsToScrollPx(units: number): number {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return (units / 100) * max;
  }

  function scrollPxToUnits(scrollY: number): number {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return (scrollY / max) * 100;
  }

  return {
    unitsToScrollPx,
    scrollPxToUnits,
  };
}
