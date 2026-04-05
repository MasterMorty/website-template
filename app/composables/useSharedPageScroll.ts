import { useScroll } from "motion-v";

let cached: ReturnType<typeof useScroll> | null = null;

export function useSharedPageScroll() {
  if (!cached) {
    cached = useScroll();
  }
  return cached;
}
