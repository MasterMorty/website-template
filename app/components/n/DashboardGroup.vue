<script setup lang="ts">
export interface DashboardGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any;
  /**
   * The storage to use for the size.
   * @default 'cookie'
   */
  storage?: "cookie" | "local";
  /**
   * Unique id used to auto-save size.
   * @default 'dashboard'
   */
  storageKey?: string;
  /**
   * Whether to persist the size in the storage.
   * @default true
   */
  persistent?: boolean;
  /**
   * The unit to use for size values.
   * @default '%'
   */
  unit?: "%" | "rem" | "px";
  /**
   * Additional CSS classes
   */
  class?: any;
}

const props = withDefaults(defineProps<DashboardGroupProps>(), {
  as: "div",
  storage: "cookie",
  storageKey: "dashboard",
  persistent: true,
  unit: "%",
});

const mainRef = ref<HTMLElement | null>(null);

const getInitialSidebarState = (): "expanded" | "collapsed" => {
  if (!props.persistent) return "expanded";
  
  const storageKey = `${props.storageKey}-sidebar`;
  
  if (props.storage === "local") {
    if (import.meta.client) {
      const stored = localStorage.getItem(storageKey);
      if (stored === "collapsed" || stored === "expanded") {
        return stored;
      }
    }
  } else {
    const cookie = useCookie<"expanded" | "collapsed">(storageKey);
    if (cookie.value === "collapsed" || cookie.value === "expanded") {
      return cookie.value;
    }
  }
  
  return "expanded";
};

const sidebarState = ref<"expanded" | "collapsed">(getInitialSidebarState());

const toggleSidebar = () => {
  sidebarState.value =
    sidebarState.value === "expanded" ? "collapsed" : "expanded";

  if (props.persistent) {
    const storageKey = `${props.storageKey}-sidebar`;

    if (props.storage === "local") {
      localStorage.setItem(storageKey, sidebarState.value);
    } else {
      // Cookie storage
      const cookie = useCookie(storageKey);
      cookie.value = sidebarState.value;
    }
  }
};

provide("toggleSidebar", toggleSidebar);
provide("sidebarState", readonly(sidebarState));
</script>

<template>
  <component
    :is="as"
    id="main"
    ref="mainRef"
    class="fixed top-0 bottom-0 left-0 right-0 globals bg-neutral-100 dark:bg-black"
    :class="$props.class"
    :data-sidebar="sidebarState"
  >
    <slot name="sidebar" />
    <div
      id="dashboard-group"
      class="absolute top-2 right-2 bottom-2 sidebar-pos overflow-auto z-30 transition-[left] duration-300 rounded-lg bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700/50"
    >
      <slot />
    </div>
  </component>
</template>

<style>
[data-sidebar="expanded"] .sidebar-width {
  width: var(--side-nav-width);
}
[data-sidebar="collapsed"] .sidebar-width {
  width: var(--side-nav-width-collapsed);
}

[data-sidebar="expanded"] .sidebar-pos {
  left: var(--side-nav-width);
}
[data-sidebar="collapsed"] .sidebar-pos {
  left: var(--side-nav-width-collapsed);
}

.globals {
  --side-nav-width: 210px;
  --side-nav-width-collapsed: 63px;
}
</style>
