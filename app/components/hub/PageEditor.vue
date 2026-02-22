<script setup lang="ts">
import type { MDCParserResult } from "@nuxtjs/mdc";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import { motion } from "motion-v";
import { enrichAst, updateByPath } from "~/composables/enrichAst";

// Fetch the content
const { data: rawAst } = await useFetch("/api/content", {
  transform(data) {
    if (data?.success && data?.content) {
      return parseMarkdown(data.content);
    }
    return null as unknown as MDCParserResult;
  },
});

const ast = computed(() => {
  if (!rawAst.value) return null;
  return enrichAst(rawAst.value);
});

const hoveredNodeId = ref<string | null>(null);
const hoveredNode = ref<any>(null);
const selectedNodeId = ref<string | null>(null);
const selectedNode = ref<any>(null);
const isEditing = ref(false);
const editableElement = ref<HTMLElement | null>(null);

function handleMouseMove(e: MouseEvent) {
  const target = e.target as HTMLElement;
  
  // Check if mouse is over the action bar - if so, don't clear hover state
  const isOverActionBar = target.closest('.hover-action-bar');
  if (isOverActionBar) {
    return;
  }
  
  const el = target.closest("[data-node-id]") as HTMLElement;
  
  if (!el) {
    hoveredNode.value = null;
    hoveredNodeId.value = null;
    return;
  }

  const nodeId = el.getAttribute("data-node-id");
  const nodePath = el.getAttribute("data-node-path");
  
  if (nodeId && nodePath) {
    hoveredNode.value = {
      element: el,
      astNode: getNodeByPath(ast.value, nodePath),
      getAttribute: (attr: string) => el.getAttribute(attr),
    };
    updateHoverBox(el);

    if (nodeId !== selectedNodeId.value) {
      hoveredNodeId.value = nodeId;
    }
  } else {
    hoveredNode.value = null;
    hoveredNodeId.value = null;
  }
}

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const nodeId = target.getAttribute("data-node-id");
  const nodePath = target.getAttribute("data-node-path");
  const nodeType = target.getAttribute("data-node-type");
  const nodeTag = target.getAttribute("data-node-tag");

  if (nodeId && nodePath) {
    e.stopPropagation();

    // If clicking the same node, make it editable
    if (selectedNodeId.value === nodeId && !isEditing.value) {
      makeEditable(target);
    } else {
      // New node selected
      if (isEditing.value) {
        stopEditing();
      }

      selectedNodeId.value = nodeId;
      selectedNode.value = {
        id: nodeId,
        path: nodePath,
        type: nodeType,
        tag: nodeTag,
        element: target,
        astNode: getNodeByPath(ast.value, nodePath),
      };
      console.log("Selected node:", selectedNode.value);
    }
  }
}

function makeEditable(element: HTMLElement) {
  isEditing.value = true;
  editableElement.value = element;
  element.contentEditable = "true";
  element.focus();

  // Select all text
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function stopEditing() {
  if (editableElement.value) {
    editableElement.value.contentEditable = "false";
    updateNodeContent(editableElement.value.innerText);
    editableElement.value = null;
  }
  isEditing.value = false;
}

function updateNodeContent(newContent: string) {
  if (!selectedNode.value || !rawAst.value) return;

  const path = selectedNode.value.path;

  // Update the text content in the AST
  // We need to find the text node child and update it
  const textPath = `${path}.children[0].value`;

  try {
    rawAst.value = updateByPath(rawAst.value, textPath, newContent);
    console.log("Updated AST with new content:", newContent);
  } catch (error) {
    console.error("Failed to update AST:", error);
  }
}

function getNodeByPath(ast: any, path: string): any {
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current = ast;
  for (const part of parts) {
    if (current && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return current;
}

const hoveredNodeProps = computed(() => {
  if (!hoveredNode.value?.astNode?.props) return null;

  const props = Object.entries(hoveredNode.value.astNode.props)
    .filter(([key]) => !key.startsWith("data-node-") && key !== "id")
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, any>
    );

  return Object.keys(props).length > 0 ? props : null;
});

function coerceValue(value: string, originalValue: any): any {
  // If original value was a number, convert to number
  if (typeof originalValue === "number") {
    const num = Number(value);
    return isNaN(num) ? originalValue : num;
  }

  // If original value was a boolean, convert to boolean
  if (typeof originalValue === "boolean") {
    if (value === "true") return true;
    if (value === "false") return false;
    return originalValue;
  }

  // If empty string and original was number, return undefined to use default
  if (value === "" && typeof originalValue === "number") {
    return undefined;
  }

  // Otherwise return as string
  return value;
}

function updateProp(propName: string, value: any) {
  if (!hoveredNode.value || !rawAst.value) return;

  const nodePath = hoveredNode.value.getAttribute("data-node-path");
  if (!nodePath) return;

  const propPath = `${nodePath}.props.${propName}`;

  // Get the original value to determine the type
  const originalValue = hoveredNode.value.astNode.props[propName];
  const coercedValue = coerceValue(value, originalValue);

  try {
    rawAst.value = updateByPath(rawAst.value, propPath, coercedValue);
    console.log(`Updated prop ${propName}:`, coercedValue);
    
    // Update the hoveredNode's astNode to reflect the change
    const updatedNode = getNodeByPath(rawAst.value, nodePath);
    hoveredNode.value.astNode = updatedNode;
  } catch (error) {
    console.error("Failed to update prop:", error);
  }
}

const showPropsEditor = ref(false);

function openPropsEditor() {
  showPropsEditor.value = true;
}

function deleteNode() {
  if (!hoveredNode.value?.astNode || !rawAst.value) return;
  
  const nodePath = hoveredNode.value.getAttribute?.("data-node-path");
  if (!nodePath) return;

  // Get parent path and child index
  const pathParts = nodePath.split('.');
  const lastPart = pathParts.pop();
  
  if (!lastPart) return;

  // Extract index from pattern like "children[0]"
  const match = lastPart.match(/\[(\d+)\]/);
  if (!match) return;
  
  const childIndex = parseInt(match[1]);
  const parentPath = pathParts.join('.');

  try {
    // Get parent node
    const parent = getNodeByPath(rawAst.value, parentPath);
    if (parent && Array.isArray(parent)) {
      // Remove the child at the specified index
      parent.splice(childIndex, 1);
      console.log('Deleted node at:', nodePath);
      
      // Clear hover state
      hoveredNodeId.value = null;
      hoveredNode.value = null;
    }
  } catch (error) {
    console.error("Failed to delete node:", error);
  }
}

// Handle click outside to stop editing
function handleClickOutside(e: MouseEvent) {
  if (
    isEditing.value &&
    editableElement.value &&
    !editableElement.value.contains(e.target as Node)
  ) {
    stopEditing();
  }
}

const hoverBox = ref({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
});

function updateHoverBox(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

  hoverBox.value = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function handleViewportChange() {
  if (hoveredNode.value?.element) {
    updateHoverBox(hoveredNode.value.element);
  }
}

onMounted(() => {
  const dashboardGroup = document.getElementById("dashboard-group");
  if (dashboardGroup) {
    dashboardGroup.addEventListener("scroll", handleViewportChange, { passive: true });
    dashboardGroup.addEventListener("resize", handleViewportChange);
  }
});

onUnmounted(() => {
  const dashboardGroup = document.getElementById("dashboard-group");
  if (dashboardGroup) {
    dashboardGroup.removeEventListener("scroll", handleViewportChange);
    dashboardGroup.removeEventListener("resize", handleViewportChange);
  }
});
</script>

<template>
  <div class="h-full overflow-auto">
    <div
      class="h-full relative"
      @mousemove="handleMouseMove"
      @click="handleClick"
      @mousedown="handleClickOutside"
    >
      <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data"/>

      <motion.div
        class="pointer-events-none border-2 border-blue-500 rounded fixed z-50 overflow-hidden"
        :animate="{
          top: hoverBox.top + 'px',
          left: hoverBox.left + 'px',
          width: hoverBox.width + 'px',
          height: hoverBox.height + 'px',
        }"
      >
        <motion.div
          v-if="hoveredNodeProps"
          class="hover-action-bar absolute pointer-events-auto top-0 left-0 right-0 z-60 bg-black/20 border-b border-black/50 shadow-lg"
          :transition="{duration: 0.1}"
          @click.stop
        >
          <div class="flex items-center justify-between gap-2 p-2">
            <!-- Action Icons -->
            <div class="flex items-center gap-2">
              <button
                class="p-1.5 hover:bg-white/10 rounded transition-colors"
                title="Edit Props"
                @click="openPropsEditor"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                class="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                title="Delete Node"
                @click="deleteNode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Props Editor (collapsed by default) -->
            <div v-if="showPropsEditor" class="flex gap-4 flex-1">
              <div
                v-for="(value, key) in hoveredNodeProps"
                :key="key"
                class="flex gap-2 items-center"
              >
                <label class="text-xs text-gray-300">{{
                  key.charAt(1).toUpperCase() + key.slice(2)
                }}</label>
                <input
                  :value="value"
                  :type="typeof value === 'number' ? 'number' : 'text'"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="
                    updateProp(
                      key as string,
                      ($event.target as HTMLInputElement).value
                    )
                  "
                >
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>
</template>
