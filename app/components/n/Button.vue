<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import type { IconProps } from "@nuxt/ui";

export interface NButtonProps {
  /**
   * The label of the button
   */
  label?: string;
  /**
   * The leading icon name
   * @IconifyIcon
   */
  icon?: IconProps["name"];
  /**
   * Display an avatar on the left side
   */
  // eslint-disable-next-line vue/require-default-prop
  avatar?: {
    src?: string;
    alt?: string;
    icon?: string;
    text?: string;
    size?: string;
    [key: string]: any;
  };
  /**
   * The trailing icon name
   * @IconifyIcon
   */
  trailingIcon?: string;
  /**
   * Display a badge on the button
   */
  badge?:
    | string
    | number
    | {
        label?: string | number;
        color?:
          | "neutral"
          | "success"
          | "warning"
          | "error"
          | "primary"
          | "secondary"
          | "info";
        variant?: "solid" | "outline" | "soft" | "subtle";
      };
  /**
   * The element or component this should render as
   * @defaultValue 'button'
   */
  as?: string | Component;
  /**
   * The route to navigate to (NuxtLink)
   */
  to?: RouteLocationRaw;
  /**
   * The external URL (anchor tag)
   */
  href?: string;
  /**
   * The target attribute for links
   * @defaultValue '_self'
   */
  target?: "_self" | "_blank" | "_parent" | "_top";
  /**
   * Whether the button is active/selected
   * @defaultValue false
   */
  active?: boolean;
  /**
   * Whether the button is disabled
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * The size of the button
   * @defaultValue 'md'
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * The color variant
   * @defaultValue 'none'
   */
  color?:
    | "none"
    | "neutral"
    | "success"
    | "warning"
    | "error"
    | "primary"
    | "custom";
  /**
   * The visual variant
   * @defaultValue 'ghost'
   */
  variant?: "solid" | "outline" | "ghost" | "link";
  /**
   * Whether to apply hover effects
   * @defaultValue true
   */
  hover?: boolean;
  /**
   * Whether text should fade when collapsed (for sidebars)
   * @defaultValue false
   */
  collapsible?: boolean;
  /**
   * Display external link icon for external URLs
   * @defaultValue true
   */
  external?: boolean;
  /**
   * Additional CSS classes
   */
  class?: string;
  /**
   * Alignment of content
   */
  align?: "start" | "center" | "end";
}

const props = withDefaults(defineProps<NButtonProps>(), {
  as: "button",
  size: "md",
  color: "none",
  variant: "ghost",
  target: "_self",
  align: "start",
  active: false,
  disabled: false,
  hover: true,
  collapsible: false,
  external: true,
  badge: undefined,
  class: '',
  href: undefined,
  to: undefined,
  label: undefined,
  icon: undefined,
  trailingIcon: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Determine component type
const component = computed(() => {
  if (props.to) return resolveComponent("NuxtLink");
  if (props.href) return "a";
  return props.as;
});

// Determine if external link
const isExternalLink = computed(() => {
  if (!props.href) return false;
  return props.href.startsWith("http") || props.href.startsWith("//");
});

// Show external icon
const showExternalIcon = computed(() => {
  return props.external && isExternalLink.value && !props.trailingIcon;
});

// Icon sizes
const iconSize = computed(() => {
  const sizes = {
    xs: "size-3",
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
    xl: "size-7",
  };
  return sizes[props.size] as IconProps["size"];
});

// Button padding
const padding = computed(() => {
  const paddings = {
    xs: "px-2 py-1",
    sm: "px-2 py-1.5",
    md: "px-3 py-2",
    lg: "px-4 py-2.5",
    xl: "px-5 py-3",
  };
  return paddings[props.size];
});

const classClass = computed(() => {
  return props.class;
});

// Color classes
const colorClasses = computed(() => {
  const colors = {
    none: "before:opacity-0 before:bg-neutral-300 dark:before:bg-zinc-600 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200",
    neutral:
      "before:opacity-35 before:bg-zinc-500 dark:before:bg-zinc-500 text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-200",
    success:
      "before:opacity-100 before:bg-emerald-600 dark:before:bg-emerald-700 text-white font-semibold",
    warning: "before:opacity-100 before:bg-orange-500 dark:before:bg-orange-500 text-white font-semibold",
    error: "before:opacity-100 before:bg-red-600 dark:before:bg-red-600 text-white font-semibold",
    primary:
      "before:opacity-100 before:bg-primary-500 dark:before:bg-primary-500 text-white font-semibold",
    custom: "",
  };
  return colors[props.color];
});

// Handle click
function handleClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  emit("click", e);
}

// Badge computed
const badgeProps = computed(() => {
  if (!props.badge) return null;
  if (typeof props.badge === "object") return props.badge;
  return { label: props.badge };
});

// Template ref for dropdown positioning
const buttonRef = ref<HTMLElement>();

// Expose ref for parent components (like UDropdownMenu)
defineExpose({
  $el: buttonRef,
});
</script>

<template>
  <component
    :is="component"
    ref="buttonRef"
    :to="to"
    :href="href"
    :target="target"
    :disabled="disabled"
    :type="!to && !href ? 'button' : undefined"
    class="n-button n-button-background group relative inline-flex items-center justify-{{ align }} gap-2 text-nowrap text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      padding,
      classClass,
      colorClasses,
      {
        'n-button-active': active,
        'n-button-no-hover': !hover,
        'cursor-pointer': !disabled,
        'pointer-events-none': disabled,
      },
      $attrs.class,
    ]"
    @click="handleClick"
  >
    <!-- Leading Icon/Avatar/Slot -->
    <span
      v-if="avatar || icon || $slots.leading"
      class="flex items-center w-6 justify-center shrink-0 transition-transform duration-300"
      :class="iconSize"
    >
      <slot name="leading">
        <UAvatar v-if="avatar" v-bind="avatar" :size="'xs'" />
        <UIcon v-else-if="icon" :name="icon" :class="iconSize" />
      </slot>
    </span>

    <!-- Label -->
    <span
      v-if="label || $slots.default"
      :data-collapsible="collapsible"
      class="n-button-text transition-opacity duration-350"
      :class="{
        'group-data-[collapsed=true]/sidebar:opacity-0': collapsible,
      }"
    >
      <slot>{{ label }}</slot>
    </span>

    <!-- Trailing Icon -->
    <span
      v-if="trailingIcon || showExternalIcon || $slots.trailing"
      class="flex items-center justify-center shrink-0 transition-transform duration-300 ml-auto"
      :class="iconSize"
    >
      <slot name="trailing">
        <UIcon v-if="trailingIcon" :name="trailingIcon" :class="iconSize" />
        <UIcon
          v-else-if="showExternalIcon"
          name="i-lucide-external-link"
          :class="iconSize"
        />
      </slot>
    </span>

    <!-- Badge -->
    <UBadge
      v-if="badgeProps"
      :label="badgeProps.label"
      :color="badgeProps.color"
      :variant="badgeProps.variant"
      size="sm"
      class="shrink-0"
    />
  </component>
</template>

<style scoped>
.n-button {
  position: relative;
  border: 0;
  outline: none;
  background: none;
  -webkit-tap-highlight-color: transparent;
}

.n-button-background::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 0.375rem;
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.n-button-background:hover:not(.n-button-no-hover):not(:disabled)::before {
  opacity: 0.5;
}

.n-button-background:active:not(:disabled)::before {
  opacity: 0.7;
  transform: scale(0.98);
}

.n-button-active {
  color: #27272a;
  cursor: default;
}

.dark .n-button-active {
  color: #e4e4e7;
}

.n-button-active::before {
  opacity: 1 !important;
}

/* Collapsed sidebar handling */
[data-sidebar="collapsed"] [data-collapsible="true"] {
  opacity: 0;
}

[data-sidebar="collapsed"] .n-button-background:active::before {
  transform: scale(0.94);
}
</style>
