<script setup lang="ts">
const { activeProjectQuery, projectNamesQuery } = useActiveProject();
</script>

<template>
  <div v-for="(project, index) in activeProjectQuery.data.value" :key="index">
    {{ project }}
  </div>

  <div v-for="(project, index) in projectNamesQuery.data.value" :key="index">
    {{ project }}
  </div>

  test

  <!-- <UEditor v-model="value" class="w-full min-h-21" /> -->
</template>
