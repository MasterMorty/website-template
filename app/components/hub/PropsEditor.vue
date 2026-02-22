<script setup lang="ts">
interface Props {
  props: Record<string, any>;
  componentName?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  save: [props: Record<string, any>];
  close: [];
}>();

const editableProps = ref({ ...props.props });
const newPropKey = ref('');
const newPropValue = ref('');

function saveProp(key: string, value: any) {
  editableProps.value[key] = value;
}

function deleteProp(key: string) {
  const { [key]: _, ...rest } = editableProps.value;
  editableProps.value = rest;
}

function addNewProp() {
  if (newPropKey.value && newPropValue.value) {
    editableProps.value[newPropKey.value] = newPropValue.value;
    newPropKey.value = '';
    newPropValue.value = '';
  }
}

function handleSave() {
  emit('save', editableProps.value);
}

function formatValue(value: any): string {
  if (Array.isArray(value)) {
    return `Array (${value.length} items)`;
  }
  if (typeof value === 'object' && value !== null) {
    return 'Object';
  }
  return String(value);
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="emit('close')">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">Edit Component Props</h2>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="emit('close')"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-if="componentName" class="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Component:</span>
          <span class="ml-2 font-mono">{{ componentName }}</span>
        </div>

        <!-- Existing Props -->
        <div v-for="(value, key) in editableProps" :key="String(key)" class="space-y-2">
          <div class="flex items-start gap-2">
            <div class="flex-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                {{ key }}
              </label>
              
              <!-- Simple value input -->
              <input
                v-if="!Array.isArray(value) && (typeof value !== 'object')"
                :value="value"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                @input="saveProp(String(key), ($event.target as HTMLInputElement).value)"
              />
              
              <!-- Complex value (array/object) -->
              <div
                v-else
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400"
              >
                {{ formatValue(value) }}
                <span class="text-xs ml-2">(Edit in code mode)</span>
              </div>
            </div>
            
            <UButton
              icon="i-lucide-trash-2"
              color="warning"
              variant="ghost"
              size="sm"
              class="mt-6"
              @click="deleteProp(String(key))"
            />
          </div>
        </div>

        <!-- Add New Prop -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 class="text-sm font-medium mb-3">Add New Property</h3>
          <div class="flex gap-2">
            <input
              v-model="newPropKey"
              placeholder="Property name"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            <input
              v-model="newPropValue"
              placeholder="Value"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-950 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            <UButton
              icon="i-lucide-plus"
              color="primary"
              @click="addNewProp"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="soft"
          @click="emit('close')"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          @click="handleSave"
        >
          Save Changes
        </UButton>
      </div>
    </div>
  </div>
</template>
