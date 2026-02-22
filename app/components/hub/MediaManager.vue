<script setup lang="ts">
import type { Media } from '~/composables/queries/useProjectMedia'

const { mediaQuery, deleteMediaMutation, updateMediaMutation } = useProjectMedia()
const { projectId } = useActiveProject()
const toast = useToast()

const AVAILABLE_TAGS = ['bikes', 'zubehör', 'hero']

const items = computed(() => mediaQuery.data.value ?? [])
const isLoading = computed(() => mediaQuery.isLoading.value)
const isEmpty = computed(() => !isLoading.value && items.value.length === 0)

// UI State
const confirmId = ref<string | null>(null)
const modalOpen = ref(false)
const uploadModalOpen = ref(false)
const selectedMedia = ref<Media | null>(null)
const viewModalOpen = ref(false)
const editedTags = ref<string[]>([])
const editedName = ref('')
const editedAltText = ref('')

watch(confirmId, (val) => {
  modalOpen.value = val !== null
})

watch(modalOpen, (val) => {
  if (!val) confirmId.value = null
})

// Upload state
const uploadFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement>()
const uploading = ref(false)

// Actions
function requestDelete(id: string) {
  confirmId.value = id
}

function deleteNow(id: string) {
  deleteMediaMutation.mutate(id, {
    onSuccess: () => {
      toast.add({
        title: 'Media deleted',
        color: 'success',
      })
    },
    onError: () => {
      toast.add({
        title: 'Failed to delete media',
        color: 'error',
      })
    }
  })
  confirmId.value = null
}

function viewMedia(media: Media) {
  editedTags.value = [...(media.tags || [])]
  editedName.value = media.name
  editedAltText.value = media.alt_text
  selectedMedia.value = media
  viewModalOpen.value = true
}

function openUploadModal() {
  uploadModalOpen.value = true
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  uploadFile.value = input.files?.[0] || null
}

async function uploadMedia() {
  if (!uploadFile.value || !projectId.value) return

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', uploadFile.value)
    formData.append('projectId', projectId.value)
    formData.append('altText', uploadFile.value.name)

    await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    toast.add({
      title: 'Media uploaded',
      color: 'success',
    })

    uploadModalOpen.value = false
    uploadFile.value = null
    mediaQuery.refetch()
  } catch (error) {
    toast.add({
      title: 'Failed to upload media' + (error instanceof Error ? `: ${error.message}` : ''),
      color: 'error',
    })
  } finally {
    uploading.value = false
  }
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url)
  toast.add({
    title: 'URL copied',
    color: 'success',
  })
}

function toggleTag(tag: string) {
  const index = editedTags.value.indexOf(tag)
  if (index > -1) {
    editedTags.value.splice(index, 1)
  } else {
    editedTags.value.push(tag)
  }
}

function saveChanges() {
  if (!selectedMedia.value) return

  const updates: any = {}
  
  if (hasTagChanges.value) {
    updates.tags = editedTags.value
  }
  
  if (editedName.value !== selectedMedia.value.name) {
    updates.name = editedName.value
  }
  
  if (editedAltText.value !== selectedMedia.value.alt_text) {
    updates.altText = editedAltText.value
  }

  updateMediaMutation.mutate({
    mediaId: selectedMedia.value.id,
    data: updates
  }, {
    onSuccess: () => {
      toast.add({
        title: 'Media updated',
        color: 'success',
      })
      if (selectedMedia.value) {
        selectedMedia.value.tags = [...editedTags.value]
        selectedMedia.value.name = editedName.value
        selectedMedia.value.alt_text = editedAltText.value
      }
    },
    onError: () => {
      toast.add({
        title: 'Failed to update media',
        color: 'error',
      })
    }
  })
}

const hasTagChanges = computed(() => {
  if (!selectedMedia.value) return false
  const original = (selectedMedia.value.tags || []).slice().sort()
  const edited = editedTags.value.slice().sort()
  return JSON.stringify(original) !== JSON.stringify(edited)
})

const hasChanges = computed(() => {
  if (!selectedMedia.value) return false
  return hasTagChanges.value || 
    editedName.value !== selectedMedia.value.name || 
    editedAltText.value !== selectedMedia.value.alt_text
})
</script>

<template>
  <div class="h-full overflow-auto">
    <div class="space-y-3 p-4">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Media Library</h2>
        <NButton color="success" icon="i-lucide-upload" @click="openUploadModal">
          Upload
        </NButton>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <UCard v-for="i in 8" :key="i" class="aspect-square">
          <USkeleton class="w-full h-full" />
        </UCard>
      </div>

      <!-- Empty -->
      <UCard v-else-if="isEmpty" class="text-center py-12">
        <div class="flex flex-col items-center gap-3">
          <UIcon name="i-lucide-image-off" class="w-12 h-12 text-muted-foreground" />
          <p class="text-muted-foreground">No media files yet</p>
          <NButton color="success" icon="i-lucide-upload" @click="openUploadModal">
            Upload your first file
          </NButton>
        </div>
      </UCard>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <UCard
          v-for="media in items"
          :key="media.id"
          class="group relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          :ui="{ body: 'p-0!' }"
          @click="viewMedia(media)"
        >
          <div class="aspect-square relative">
            <img
              v-if="media.mime_type.startsWith('image/')"
              :src="media.public_url"
              :alt="media.alt_text"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center bg-muted">
              <UIcon name="i-lucide-file" class="w-12 h-12 text-muted-foreground" />
            </div>

            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <UButton
                icon="i-lucide-eye"
                color="neutral"
                variant="soft"
                size="sm"
                @click.stop="viewMedia(media)"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="soft"
                size="sm"
                @click.stop="requestDelete(media.id)"
              />
            </div>

            <!-- Tags badge -->
            <div v-if="media.tags && media.tags.length > 0" class="absolute top-2 right-2 flex gap-1">
              <UBadge
                v-for="tag in media.tags.slice(0, 2)"
                :key="tag"
                :label="tag"
                color="primary"
                variant="solid"
                size="xs"
              />
              <UBadge
                v-if="media.tags.length > 2"
                :label="`+${media.tags.length - 2}`"
                color="neutral"
                variant="solid"
                size="xs"
              />
            </div>
          </div>
          
          <template #footer>
            <div class="text-xs truncate" :title="media.name">
              {{ media.name }}
            </div>
            <div class="text-xs text-muted-foreground">
              {{ formatBytes(media.file_size) }}
            </div>
          </template>
        </UCard>
      </div>

      <!-- Delete Confirmation Modal -->
      <UModal
        v-model:open="modalOpen"
        title="Delete media file?"
        description="This action cannot be undone. Content using this media will lose the reference."
        close-icon="i-heroicons-x-mark"
      >
        <template #body>
          <div class="flex justify-end gap-3">
            <UButton
              label="Cancel"
              color="neutral"
              variant="subtle"
              @click="confirmId = null"
            />
            <UButton
              label="Delete"
              color="error"
              @click="deleteNow(confirmId!)"
            />
          </div>
        </template>
      </UModal>

      <!-- Upload Modal -->
      <UModal
        v-model:open="uploadModalOpen"
        title="Upload Media"
        close-icon="i-heroicons-x-mark"
      >
        <template #body>
          <div class="space-y-4">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            >

            <div
              v-if="!uploadFile"
              class="border-2 border-dashed border-muted rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              @click="triggerFileInput"
            >
              <UIcon name="i-lucide-upload" class="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p class="text-sm text-muted-foreground">Click to select a file</p>
            </div>

            <div v-else class="space-y-3">
              <UCard>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-file" class="w-8 h-8 text-muted-foreground" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ uploadFile.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ formatBytes(uploadFile.size) }}</p>
                  </div>
                  <UButton
                    icon="i-lucide-x"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="uploadFile = null"
                  />
                </div>
              </UCard>

              <div class="flex justify-end gap-3">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="subtle"
                  @click="uploadModalOpen = false"
                />
                <UButton
                  label="Upload"
                  color="success"
                  :loading="uploading"
                  @click="uploadMedia"
                />
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- View Media Modal -->
      <UModal
        v-model:open="viewModalOpen"
        :title="selectedMedia?.name"
        close-icon="i-heroicons-x-mark"
        :ui="{ content: 'max-w-3xl' }"
      >
        <template #body>
          <div v-if="selectedMedia" class="space-y-4">
            <!-- Preview -->
            <div class="aspect-video relative bg-muted rounded-lg overflow-hidden">
              <img
                v-if="selectedMedia.mime_type.startsWith('image/')"
                :src="selectedMedia.public_url"
                :alt="selectedMedia.alt_text"
                class="w-full h-full object-contain"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-lucide-file" class="w-24 h-24 text-muted-foreground" />
              </div>
            </div>

            <!-- Details -->
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="text-xs text-muted-foreground mb-1 block">Display Name</label>
                <input
                  v-model="editedName"
                  type="text"
                  class="w-full px-3 py-2 text-sm border border-muted rounded-md bg-background"
                  placeholder="Enter display name"
                >
              </div>
              <div class="col-span-2">
                <label class="text-xs text-muted-foreground mb-1 block">Alt Text</label>
                <input
                  v-model="editedAltText"
                  type="text"
                  class="w-full px-3 py-2 text-sm border border-muted rounded-md bg-background"
                  placeholder="Enter alt text for accessibility"
                >
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-1">File Name</p>
                <p class="text-sm font-medium">{{ selectedMedia.file_name }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-1">Size</p>
                <p class="text-sm font-medium">{{ formatBytes(selectedMedia.file_size) }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-1">Dimensions</p>
                <p class="text-sm font-medium">
                  {{ selectedMedia.width && selectedMedia.height ? `${selectedMedia.width} × ${selectedMedia.height}` : 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground mb-1">Uploaded</p>
                <p class="text-sm font-medium">{{ formatDate(selectedMedia.created_at) }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs text-muted-foreground mb-1">URL</p>
                <div class="flex gap-2">
                  <input
                    type="text"
                    :value="selectedMedia.public_url"
                    readonly
                    class="flex-1 px-3 py-2 text-sm border border-muted rounded-md bg-muted/50"
                  >
                  <UButton
                    icon="i-lucide-copy"
                    color="neutral"
                    variant="soft"
                    @click="copyUrl(selectedMedia.public_url)"
                  />
                </div>
              </div>
              <div class="col-span-2">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs text-muted-foreground">Tags</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-for="tag in AVAILABLE_TAGS"
                    :key="tag"
                    :label="tag"
                    :color="editedTags.includes(tag) ? 'primary' : 'neutral'"
                    :variant="editedTags.includes(tag) ? 'solid' : 'outline'"
                    size="sm"
                    @click="toggleTag(tag)"
                  />
                  <div v-if="editedTags.length === 0" class="text-xs text-muted-foreground italic py-1">
                    No tags selected
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between items-center pt-4 border-t border-muted">
              <UButton
                label="Delete"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                @click="() => { viewModalOpen = false; requestDelete(selectedMedia!.id) }"
              />
              <UButton
                v-if="hasChanges"
                label="Save Changes"
                color="primary"
                :loading="updateMediaMutation.isPending.value"
                @click="saveChanges"
              />
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
