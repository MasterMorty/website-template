<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import { ref } from 'vue'

const props = defineProps<NodeViewProps>()

const { projectId } = useActiveProject()
const { mediaQuery } = useProjectMedia()
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement>()
const modalOpen = ref(false)
const selectedTab = ref<'upload' | 'library'>('library')

const mediaItems = computed(() => mediaQuery.data.value ?? [])
const isLoadingMedia = computed(() => mediaQuery.isLoading.value)

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file || !projectId.value) return

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectId', projectId.value)
    formData.append('altText', file.name)

    const response = await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    if (!response?.public_url || !response?.id) {
      throw new Error('Invalid upload response')
    }
    insertImage(response?.public_url, response?.id)
  } catch (error) {
    console.error('Upload failed:', error)
    props.deleteNode()
  } finally {
    uploading.value = false
  }
}

const insertImage = (src: string, mediaId: string) => {
  const pos = props.getPos()
  if (typeof pos !== 'number') return
  props.editor
    .chain()
    .focus()
    .deleteRange({ from: pos, to: pos + 1 })
    .insertContentAt(pos, {
      type: 'image',
      attrs: { 
        src,
        mediaId
      }
    })
    .run()
  modalOpen.value = false
}

const selectFromLibrary = (media: any) => {
  insertImage(media.public_url, media.id)
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// Auto-open modal on mount
onMounted(() => {
  modalOpen.value = true
})

// Clean up if modal is closed without selecting
watch(modalOpen, (isOpen) => {
  if (!isOpen && !uploading.value) {
    props.deleteNode()
  }
})
</script>

<template>
  <NodeViewWrapper class="image-upload-wrapper">
    <!-- Placeholder in editor -->
    <div 
      class="border-2 border-dashed border-primary rounded-lg p-4 text-center cursor-pointer bg-primary/5"
      @click="modalOpen = true"
    >
      <div class="flex items-center justify-center gap-2 text-sm text-primary">
        <UIcon name="i-lucide-image-plus" class="w-5 h-5" />
        <span>Click to add image</span>
      </div>
    </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add Image</h3>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="modalOpen = false"
            />
          </div>
        </template>

        <!-- Tabs -->
        <UTabs
          v-model="selectedTab"
          :items="[
            { value: 'library', label: 'Media Library', icon: 'i-lucide-folder-open' },
            { value: 'upload', label: 'Upload New', icon: 'i-lucide-upload' }
          ]"
          class="mb-4"
        />

        <!-- Media Library Tab -->
        <div v-if="selectedTab === 'library'" class="space-y-4">
          <div v-if="isLoadingMedia" class="flex items-center justify-center py-12">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
          </div>

          <div v-else-if="mediaItems.length === 0" class="text-center py-12">
            <UIcon name="i-lucide-image-off" class="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p class="text-sm text-muted-foreground">No images in library</p>
            <UButton
              label="Upload your first image"
              color="primary"
              size="sm"
              class="mt-4"
              @click="selectedTab = 'upload'"
            />
          </div>

          <div v-else class="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            <button
              v-for="media in mediaItems.filter(m => m.mime_type.startsWith('image/'))"
              :key="media.id"
              class="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer group"
              @click="selectFromLibrary(media)"
            >
              <img
                :src="media.public_url"
                :alt="media.alt_text || media.name"
                class="w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UIcon name="i-lucide-check" class="w-8 h-8 text-white" />
              </div>
            </button>
          </div>
        </div>

        <!-- Upload Tab -->
        <div v-if="selectedTab === 'upload'" class="space-y-4">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          >

          <div
            class="border-2 border-dashed border-muted rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
            @click="triggerFileInput"
          >
            <div v-if="uploading" class="flex flex-col items-center gap-3">
              <UIcon name="i-lucide-loader-2" class="w-12 h-12 animate-spin text-primary" />
              <p class="text-sm text-muted-foreground">Uploading...</p>
            </div>
            
            <div v-else class="flex flex-col items-center gap-3">
              <UIcon name="i-lucide-upload" class="w-12 h-12 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Click to upload an image</p>
                <p class="text-xs text-muted-foreground mt-1">or drag and drop</p>
              </div>
            </div>
          </div>
        </div>
      </UCard>
  </NodeViewWrapper>
</template>

<style>
.image-upload-wrapper {
  margin: 1rem 0;
}
</style>
