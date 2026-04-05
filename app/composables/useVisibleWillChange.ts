import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  type ComponentPublicInstance,
  type Ref,
} from "vue";

type ObservableTarget =
  | Element
  | ComponentPublicInstance
  | { $el?: unknown }
  | null;

const resolveElement = (value: ObservableTarget): Element | null => {
  if (!value) return null;
  if (value instanceof Element) return value;

  const componentRoot = (value as { $el?: unknown }).$el;
  return componentRoot instanceof Element ? componentRoot : null;
};

/**
 * Toggles a reactive boolean based on element visibility.
 * Use to add will-change only while an element is in the viewport,
 * preventing stale GPU layer promotion.
 */
export function useVisibleWillChange(
  target: Ref<ObservableTarget>,
  rootMargin = "50px",
) {
  const active = ref(false);
  let observer: IntersectionObserver | null = null;
  let observedElement: Element | null = null;

  const observe = (value: ObservableTarget) => {
    const nextElement = resolveElement(value);

    if (observedElement && observer) {
      observer.unobserve(observedElement);
      observedElement = null;
    }

    if (!nextElement || !observer) {
      active.value = false;
      return;
    }

    observedElement = nextElement;
    observer.observe(nextElement);
  };

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        active.value = entry!.isIntersecting;
      },
      { rootMargin },
    );

    observe(target.value);

    watch(
      target,
      (value) => {
        observe(value);
      },
      { flush: "post" },
    );
  });

  onBeforeUnmount(() => {
    if (observer && observedElement) {
      observer.unobserve(observedElement);
      observedElement = null;
    }
    observer?.disconnect();
  });

  return active;
}
