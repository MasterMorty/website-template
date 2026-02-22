<script setup lang="ts">
const toast = useToast()

const {
  projectsQuery,
  createProjectMutation,
  deleteProjectMutation,
  updateProjectMutation,
} = useProjects()

// --- UI STATE ---
const confirmId = ref<string | null>(null)
const editingId = ref<string | null>(null)

// --- CREATE STATE ---
const showCreate = ref(false)

const form = ref({
  name: '',
  slug: '',
  description: '',
})

const editForm = ref({
  name: '',
  slug: '',
  description: '',
  status: 'active',
})

// Derived
const items = computed(() => projectsQuery.data ?? [])
const isLoading = computed(() => projectsQuery.isLoading.value)
const isEmpty = computed(() => !isLoading.value && items.value.value?.length === 0)

// --- ACTIONS ---

function createNow() {
  createProjectMutation.mutate(
    {
      name: form.value.name,
      slug: form.value.slug,
      description: form.value.description,
    },
    {
      onSuccess() {
        toast.add({
          title: 'Project Created',
          color: 'success',
        })

        form.value = { name: '', slug: '', description: '' }
        showCreate.value = false
      },
    },
  )
}

function openEdit(project: any) {
  editingId.value = project.id
  editForm.value = {
    name: project.name,
    slug: project.slug || '',
    description: project.description || '',
    status: project.status || 'active',
  }
}

function updateNow() {
  if (!editingId.value) return

  updateProjectMutation.mutate(
    {
      projectId: editingId.value,
      data: editForm.value,
    },
    {
      onSuccess() {
        toast.add({
          title: 'Project Updated',
          color: 'success',
        })

        editingId.value = null
      },
    },
  )
}

function requestDelete(id: string) {
  confirmId.value = id
}

function deleteNow(id: string) {
  const item = items.value.value?.find(i => i.id === id)
  if (!item) return

  deleteProjectMutation.mutate(id, {
    onSuccess() {
      toast.add({
        title: 'Project removed',
        description: item.name,
        color: 'error',
      })
    },
  })

  confirmId.value = null
}
</script>

<template>
  <div class="space-y-3 p-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">Projects</h2>
      <UButton
        icon="i-heroicons-plus"
        @click="showCreate = true"
      >
        Create
      </UButton>
    </div>

    <!-- Loading -->
    <template v-if="isLoading">
      <UCard v-for="i in 3" :key="i">
        <USkeleton class="h-4 w-40 mb-2" />
        <USkeleton class="h-3 w-24" />
      </UCard>
    </template>

    <!-- Empty -->
    <UCard v-else-if="isEmpty" class="text-center">
      <p class="opacity-70">No projects yet</p>
    </UCard>

    <!-- List -->
    <UCard
      v-for="item in items.value"
      :key="item.id"
      class="flex items-center justify-between"
    >
      <div>
        <div class="font-medium">
          {{ item.name }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Edit -->
        <UButton
          icon="i-heroicons-pencil"
          color="neutral"
          variant="ghost"
          @click="openEdit(item)"
        />

        <!-- Delete -->
        <UButton
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          :loading="deleteProjectMutation.isPending.value"
          @click="requestDelete(item.id)"
        />
      </div>
    </UCard>

    <!-- Create Modal -->
    <UModal v-model="showCreate">
      <UCard>
        <template #header>
          Create Project
        </template>

        <div class="space-y-4">
          <UFormGroup label="Name" required>
            <UInput
              v-model="form.name"
              placeholder="My Project"
            />
          </UFormGroup>

          <UFormGroup label="Slug" required>
            <UInput
              v-model="form.slug"
              placeholder="my-project"
            />
          </UFormGroup>

          <UFormGroup label="Description">
            <UTextarea
              v-model="form.description"
              placeholder="Project description..."
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              @click="showCreate = false"
            >
              Cancel
            </UButton>

            <UButton
              color="primary"
              :loading="createProjectMutation.isPending.value"
              :disabled="!form.name || !form.slug"
              @click="createNow"
            >
              Create
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Edit Modal -->
    <UModal :model-value="!!editingId" @update:model-value="editingId = null">
      <UCard>
        <template #header>
          Edit Project
        </template>

        <div class="space-y-4">
          <UFormGroup label="Name" required>
            <UInput
              v-model="editForm.name"
              placeholder="My Project"
            />
          </UFormGroup>

          <UFormGroup label="Slug" required>
            <UInput
              v-model="editForm.slug"
              placeholder="my-project"
            />
          </UFormGroup>

          <UFormGroup label="Description">
            <UTextarea
              v-model="editForm.description"
              placeholder="Project description..."
            />
          </UFormGroup>

          <UFormGroup label="Status">
            <USelect
              v-model="editForm.status"
              :options="[
                { label: 'Active', value: 'active' },
                { label: 'Archived', value: 'archived' },
              ]"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              @click="editingId = null"
            >
              Cancel
            </UButton>

            <UButton
              color="primary"
              :loading="updateProjectMutation.isPending.value"
              :disabled="!editForm.name || !editForm.slug"
              @click="updateNow"
            >
              Update
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete Modal -->
    <UModal :model-value="!!confirmId" @update:model-value="confirmId = null">
      <UCard>
        <template #header>
          Delete Project
        </template>

        <p class="mb-4">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              @click="confirmId = null"
            >
              Cancel
            </UButton>

            <UButton
              color="error"
              :loading="deleteProjectMutation.isPending.value"
              @click="deleteNow(confirmId!)"
            >
              Delete
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
