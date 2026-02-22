<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "reka-ui";
import type { DropdownMenuItem as DropdownMenuItemType } from "@nuxt/ui";
import { tv } from "tailwind-variants";
import theme from "#build/ui/dropdown-menu";
import { motion } from "motion-v";

type FlatItem = DropdownMenuItemType & Record<string, unknown>

function flatChildren(children: DropdownMenuItemType | DropdownMenuItemType[]): FlatItem[] {
  return (Array.isArray(children) ? children : [children]) as FlatItem[]
}

const dropdownMenu = tv(theme);

const selected = defineModel<any>("selected");
const internalSelected = ref<DropdownMenuItemType>({ ...selected.value });

interface Props {
  items?: DropdownMenuItemType[] | DropdownMenuItemType[][];
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ui?: any;
  content?: any;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const open = defineModel<boolean>("open", { default: false });

// Reset internalSelected to the actual selected value when dropdown closes
watch(open, (isOpen) => {
  if (!isOpen) {
    internalSelected.value = { ...selected.value };
  }
});

const styles = computed(() => dropdownMenu({ size: props.size }));

const avatarSize = computed(() => {
  return styles.value.itemLeadingAvatarSize({ size: props.size }) as
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "3xs"
    | "2xs"
    | "2xl"
    | "3xl"
    | undefined;
});

const groups = computed(() => {
  if (!props.items) return [];
  if (Array.isArray(props.items[0])) {
    return props.items as DropdownMenuItemType[][];
  }
  return [props.items as DropdownMenuItemType[]];
});

const hoveredChild = ref<string | null>(null)
</script>

<template>
  <DropdownMenuRoot v-model:open="open">
    <DropdownMenuTrigger as-child>
      <slot :open="open" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side="content?.side || 'bottom'"
        :side-offset="content?.sideOffset || 8"
        :align="content?.align || 'start'"
        :collision-padding="content?.collisionPadding || 8"
        :class="[styles.content(), ui?.content]"
        @mouseleave="internalSelected = { ...selected }"
      >
        <div :class="[styles.viewport(), ui?.viewport]">
          <template v-for="(group, groupIndex) in groups" :key="groupIndex">
            <DropdownMenuGroup :class="[styles.group(), ui?.group]">
              <template v-for="(item, itemIndex) in group" :key="itemIndex">

                <!-- Sub-menu item (hover → flies out to the right) -->
                <DropdownMenuSub v-if="item.children?.length">
                  <DropdownMenuSubTrigger
                    :disabled="item.disabled"
                    :class="[
                      styles.item({ size }),
                      ui?.item,
                      item.class,
                      'relative data-highlighted:before:bg-transparent! data-[state=open]:before:bg-transparent! cursor-default select-none',
                    ]"
                    @mouseover="internalSelected.label = item.label"
                  >
                    <UAvatar
                      v-if="item.avatar"
                      v-bind="item.avatar"
                      :size="avatarSize"
                      :class="[styles.itemLeadingAvatar(), ui?.itemLeadingAvatar]"
                    />
                    <UIcon
                      v-else-if="item.icon"
                      :name="item.icon"
                      :class="[
                        styles.itemLeadingIcon({ size: item.iconSize || size }),
                        ui?.itemLeadingIcon,
                      ]"
                    />
                    <span :class="[styles.itemWrapper(), ui?.itemWrapper]">
                      <span :class="[styles.itemLabel(), ui?.itemLabel]">
                        {{ item.label }}
                      </span>
                    </span>
                    <UIcon
                      name="i-lucide-chevron-right"
                      :class="[styles.itemLeadingIcon({ size }), 'ml-auto opacity-60']"
                    />
                    <motion.span
                      v-if="internalSelected.label === item.label"
                      :class="[
                        'absolute -z-1 inset-0 rounded-sm bg-black/10 dark:bg-white/15',
                        ui?.itemHighlight,
                      ]"
                      layout-id="dropwdown-menu-highlight"
                      :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
                    />
                  </DropdownMenuSubTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuSubContent
                      :side-offset="4"
                      :class="[styles.content(), ui?.content, 'min-w-40']"
                      @mouseleave="hoveredChild = null"
                    >
                      <div :class="[styles.viewport(), ui?.viewport]">
                        <DropdownMenuGroup :class="[styles.group(), ui?.group]">
                          <DropdownMenuItem
                            v-for="(child, childIndex) in flatChildren(item.children!)"
                            :key="childIndex"
                            :disabled="child.disabled"
                            :class="[
                              styles.item({ size }),
                              ui?.item,
                              child.class,
                              'relative data-highlighted:before:bg-transparent!',
                            ]"
                            @select="(e) => child.onSelect?.(e)"
                            @mouseover="hoveredChild = child.label ?? null"
                          >
                            <UAvatar
                              v-if="child.avatar"
                              v-bind="child.avatar"
                              :size="avatarSize"
                              :class="[styles.itemLeadingAvatar(), ui?.itemLeadingAvatar]"
                            />
                            <UIcon
                              v-else-if="child.icon"
                              :name="child.icon"
                              :class="[
                                styles.itemLeadingIcon({ size: child.iconSize || size }),
                                ui?.itemLeadingIcon,
                              ]"
                            />
                            <span
                              v-else
                              :class="[styles.itemLeadingIcon({ size: child.iconSize || size })]"
                            />
                            <span :class="[styles.itemWrapper(), ui?.itemWrapper]">
                              <span :class="[styles.itemLabel(), ui?.itemLabel]">
                                {{ child.label }}
                              </span>
                            </span>
                            <span
                              v-if="child.badge"
                              :class="[styles.itemTrailing(), ui?.itemTrailing]"
                            >
                              <UBadge
                                v-bind="
                                  typeof child.badge === 'object'
                                    ? child.badge
                                    : { label: child.badge }
                                "
                                size="sm"
                              />
                            </span>

                            <motion.span
                              v-if="hoveredChild === child.label"
                              :class="[
                                'absolute -z-1 inset-0 rounded-sm bg-black/10 dark:bg-white/15',
                                ui?.itemHighlight,
                              ]"
                              layout-id="dropdown-submenu-highlight"
                              :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
                            />
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <!-- Regular item -->
                <DropdownMenuItem
                  v-else
                  :disabled="item.disabled"
                  :class="[
                    styles.item({ size }),
                    ui?.item,
                    item.class,
                    'relative data-highlighted:before:bg-transparent! data-[state=open]:before:bg-transparent!',
                  ]"
                  @select="(e) => item.onSelect?.(e)"
                  @mouseover="internalSelected.label = item.label"
                >
                  <UAvatar
                    v-if="item.avatar"
                    v-bind="item.avatar"
                    :size="avatarSize"
                    :class="[styles.itemLeadingAvatar(), ui?.itemLeadingAvatar]"
                  />
                  <UIcon
                    v-else-if="item.icon"
                    :name="item.icon"
                    :class="[
                      styles.itemLeadingIcon({ size: item.iconSize || size }),
                      ui?.itemLeadingIcon,
                    ]"
                  />

                  <span :class="[styles.itemWrapper(), ui?.itemWrapper]">
                    <span :class="[styles.itemLabel(), ui?.itemLabel]">
                      {{ item.label }}
                    </span>
                  </span>

                  <span
                    v-if="item.badge"
                    :class="[styles.itemTrailing(), ui?.itemTrailing]"
                  >
                    <UBadge
                      v-bind="
                        typeof item.badge === 'object'
                          ? item.badge
                          : { label: item.badge }
                      "
                      size="sm"
                    />
                  </span>

                  <motion.span
                    v-if="internalSelected.label === item.label"
                    :class="[
                      'absolute -z-1 inset-0 rounded-sm bg-black/10 dark:bg-white/15',
                      ui?.itemHighlight,
                    ]"
                    layout-id="dropwdown-menu-highlight"
                    :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
                  />
                </DropdownMenuItem>

              </template>
            </DropdownMenuGroup>
          </template>
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
