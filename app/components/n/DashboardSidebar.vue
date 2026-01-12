<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
export interface DashboardSidebarProps {
  /**
   * The id of the panel.
   */
  // eslint-disable-next-line vue/require-default-prop
  id?: string;
  /**
   * The side to render the panel on.
   * @default 'left'
   */
  side?: "left" | "right";
  /**
   * The minimum size of the panel.
   * @default 10
   */
  minSize?: number;
  /**
   * The maximum size of the panel.
   * @default 20
   */
  maxSize?: number;
  /**
   * The default size of the panel.
   * @default 15
   */
  defaultSize?: number;
  /**
   * Whether to allow the user to resize the panel.
   * @default false
   */
  resizable?: boolean;
  /**
   * Whether to allow the user to collapse the panel.
   * @default false
   */
  collapsible?: boolean;
  /**
   * The size of the panel when collapsed.
   * @default 0
   */
  collapsedSize?: number;
  /**
   * The mode of the sidebar menu.
   * @default 'slideover'
   */
  mode?: "modal" | "slideover" | "drawer";
  /**
   * The props for the sidebar menu component.
   */
  // eslint-disable-next-line vue/require-default-prop
  menu?: any;
  /**
   * Customize the toggle button to open the sidebar.
   * @default true
   */
  toggle?: boolean | any;
  /**
   * The side to render the toggle button on.
   * @default 'left'
   */
  toggleSide?: "left" | "right";
  /**
   * Whether the sidebar is open (for mobile).
   * @default false
   */
  open?: boolean;
  /**
   * Whether the sidebar is collapsed.
   * @default false
   */
  collapsed?: boolean;
  /**
   * Additional CSS classes
   */
  // eslint-disable-next-line vue/require-default-prop
  class?: any;
  /**
   * UI customization slots
   */
  ui?: {
    root?: any;
    header?: any;
    body?: any;
    footer?: any;
    toggle?: any;
    handle?: any;
    content?: any;
    overlay?: any;
  };
}

const props = withDefaults(defineProps<DashboardSidebarProps>(), {
  side: "left",
  minSize: 10,
  maxSize: 20,
  defaultSize: 15,
  resizable: false,
  collapsible: false,
  collapsedSize: 0,
  mode: "slideover",
  toggle: true,
  toggleSide: "left",
  open: false,
  collapsed: false,
  ui: () => {
    const config = useAppConfig();
    return config.ui?.dashboardSidebar?.slots ?? {};
  },
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  "update:collapsed": [value: boolean];
}>();

const toggleSidebar = inject<() => void>("toggleSidebar");
const sidebarState = inject<Readonly<Ref<"expanded" | "collapsed">>>(
  "sidebarState",
  readonly(ref("expanded"))
);

const isCollapsed = computed(() => sidebarState.value === "collapsed");

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const collapse = (value: boolean) => {
  if (toggleSidebar && value !== isCollapsed.value) {
    toggleSidebar();
  }
  emit("update:collapsed", value);
};

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

defineExpose({
  toggle: toggleOpen,
  collapse,
  collapsed: isCollapsed,
  open: isOpen,
});
</script>

<template>
  <aside
    class="flex flex-col gap-6 absolute top-0 left-0 bottom-0 p-3 z-20 sidebar-width transition-[width] duration-300"
    :class="[ui?.root, $props.class]"
    :data-side="side"
    :data-collapsed="isCollapsed"
  >
    <!-- Header -->
    <div v-if="$slots.header" :class="ui?.header">
      <slot name="header" :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <!-- Body/Default -->
    <div class="flex-1 overflow-auto" :class="ui?.body">
      <slot :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" :class="ui?.footer">
      <slot name="footer" :collapsed="isCollapsed" :collapse="collapse" />
    </div>
  </aside>

  <!-- Mobile Toggle Button -->
  <div v-if="toggle && $slots.toggle" :class="ui?.toggle">
    <slot name="toggle" :open="isOpen" :toggle="toggleOpen" :ui="ui" />
  </div>

  <!-- Mobile Menu Content -->
  <div v-if="$slots.content" :class="ui?.content">
    <slot name="content" :close="() => (isOpen = false)" />
  </div>
</template>
