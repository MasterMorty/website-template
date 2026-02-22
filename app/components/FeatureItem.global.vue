<template>
  <div
    class="bg-white/10 p-6 rounded-lg shadow-sm hover:shadow-md transition"
  >
    <div v-if="$slots.icon" class="flex items-center justify-center mb-4">
      <slot name="icon" />
    </div>
    <div v-if="$slots.title" class="text-xl font-semibold mb-2 text-center">
      <slot name="title" />
    </div>
    <div v-if="$slots.description" class="opacity-70 text-center">
      <slot name="description" />
    </div>
  </div>
</template>
