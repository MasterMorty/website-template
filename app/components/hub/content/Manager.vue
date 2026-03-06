<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import ContentEditor from '~/components/editor/ContentEditor.vue'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const NDropdownMenu = resolveComponent('NDropdownMenu')

const route = useRoute()
const router = useRouter()

const {
  contentQuery,
  createContentMutation,
  deleteContentMutation,
  updateContentMutation,
} = useProjectContent();

const { contentTypes } = useProjectContentTypes();
const { projectId } = useActiveProject();
const { mediaQuery } = useProjectMedia();
const mediaItems = computed(() => (mediaQuery.data.value ?? []).filter((m: any) => m.mime_type.startsWith('image/')))

type ContentItem = {
  id: string
  project_id: string
  content_type_id: string
  title: string
  slug: string
  data: any
  status: string
  cover_image_id?: string | null
  created_by_id: string
  updated_by_id?: string | null
  published_at?: number | null
  created_at: number
  updated_at: number
  content_type?: {
    id: string
    name: string
    slug: string
    description: string | null
  } | null
  cover_image?: {
    id: string
    name: string
    public_url: string
    width: number | null
    height: number | null
    alt_text: string
  } | null
}

// --- UI STATE ---
const confirmId = ref<string | null>(null);
const undoStack = ref<any | null>(null);

const modalOpen = ref(false);

watch(confirmId, (val) => {
  modalOpen.value = val !== null;
});

watch(modalOpen, (val) => {
  if (!val) confirmId.value = null;
});

// --- CONTENT SELECTION ---
const selectedContentId = computed(() => route.query.edit as string | undefined)

const selectedContent = computed(() => {
  if (!selectedContentId.value) return null
  return items.value.value?.find((item: any) => item.id === selectedContentId.value)
})

// Placeholder content for preloading the editor
const placeholderContent = {
  id: '_placeholder',
  title: 'Loading...',
  slug: '',
  status: 'draft',
  data: { content: '' }
}

// Provide content or placeholder to keep editor mounted
const editorContent = computed(() => selectedContent.value || placeholderContent)

// --- CREATE STATE ---

// Derived
const items = computed(() => contentQuery.data ?? []);
const isLoading = computed(() => contentQuery.isLoading.value);
const isEmpty = computed(
  () => !isLoading.value && items.value.value?.length === 0,
);

// --- ACTIONS ---

function requestDelete(id: string) {
  confirmId.value = id;
}

function deleteNow(id: string) {
  const item = items.value.value?.find((i) => i.id === id);
  if (!item) return;

  undoStack.value = item;

  deleteContentMutation.mutate(id, {});

  confirmId.value = null;
}

function toggleStatus(item: any) {
  updateContentMutation.mutate({
    contentId: item.id,
    data: {
      status: item.status === "published" ? "draft" : "published",
    },
  });
}

function changeContentType(contentId: string, contentTypeId: string) {
  updateContentMutation.mutate({
    contentId,
    data: {
      content_type_id: contentTypeId,
    },
  });
}

function selectContent(id: string, navigateForward: (index: number) => void) {
  router.push({ query: { edit: id } })
  navigateForward(1)
}

function goBackToList(navigateBack: () => void) {
  router.push({ query: {} })
  navigateBack()
}

// --- CREATE STATE ---
const createModalOpen = ref(false)
const createForm = ref({ title: '', slug: '', content_type_id: '', coverImageId: null as string | null, coverImageUrl: null as string | null })
const creating = ref(false)

watch(() => createForm.value.title, (title) => {
  createForm.value.slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
})

function openCreateModal() {
  createForm.value = { title: '', slug: '', content_type_id: contentTypes.value[0]?.id ?? '', coverImageId: null, coverImageUrl: null }
  createModalOpen.value = true
}

async function createNow() {
  if (!createForm.value.title || !createForm.value.content_type_id) return
  creating.value = true
  try {
    await createContentMutation.mutateAsync({
      title: createForm.value.title,
      slug: createForm.value.slug || `content-${Date.now()}`,
      content_type_id: createForm.value.content_type_id,
      cover_image_id: createForm.value.coverImageId ?? undefined,
      data: { content: `# ${createForm.value.title}\n\n` },
    })
    createModalOpen.value = false
  } finally {
    creating.value = false
  }
}

// --- COVER IMAGE PICKER ---
const coverPickerOpen = ref(false)
const coverPickerTarget = ref<'create' | string>('create')
const coverPickerTab = ref<'library' | 'upload'>('library')
const coverUploading = ref(false)
const coverFileInputRef = ref<HTMLInputElement>()

function openCoverPicker(target: 'create' | string) {
  coverPickerTarget.value = target
  coverPickerTab.value = 'library'
  coverPickerOpen.value = true
}

function selectCoverFromLibrary(media: any) {
  if (coverPickerTarget.value === 'create') {
    createForm.value.coverImageId = media.id
    createForm.value.coverImageUrl = media.public_url
    coverPickerOpen.value = false
  } else {
    $fetch(`/api/contents/${coverPickerTarget.value}/cover-image`, {
      method: 'PATCH',
      body: { coverImageId: media.id }
    }).then(() => contentQuery.refetch())
    coverPickerOpen.value = false
  }
}

function triggerCoverFileInput() {
  coverFileInputRef.value?.click()
}

async function handleCoverFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !projectId.value) return
  coverUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectId', projectId.value)
    formData.append('altText', file.name)
    const res = await $fetch<{ id: string; public_url: string }>('/api/media/upload', { method: 'POST', body: formData })
    mediaQuery.refetch()
    if (coverPickerTarget.value === 'create') {
      createForm.value.coverImageId = res.id
      createForm.value.coverImageUrl = res.public_url
      coverPickerOpen.value = false
    } else {
      await $fetch(`/api/contents/${coverPickerTarget.value}/cover-image`, {
        method: 'PATCH',
        body: { coverImageId: res.id }
      })
      contentQuery.refetch()
      coverPickerOpen.value = false
    }
  } finally {
    coverUploading.value = false
    if (coverFileInputRef.value) coverFileInputRef.value.value = ''
  }
}

const switcherContext = inject('switcher', null) as any

watch(selectedContentId, (newId, oldId) => {
  if (!switcherContext) return
  
  if (newId && !oldId) {
    nextTick(() => {
      switcherContext.navigateForward(1)
    })
  } else if (!newId && oldId) {
    nextTick(() => {
      switcherContext.reset()
    })
  }
}, { immediate: false })

onMounted(() => {
  if (selectedContentId.value && switcherContext) {
    nextTick(() => {
      switcherContext.navigateForward(1)
    })
  }
})

const columns: TableColumn<ContentItem>[] = [
  {
    accessorKey: 'id',
    header: '#',
    meta: {
      class: {
        th: 'w-16',
        td: 'w-16'
      }
    },
    cell: ({ row }) => {
      const index = items.value.value?.findIndex((item) => item.id === row.original.id) ?? 0
      return `${index + 1}`
    }
  },
  {
    accessorKey: 'cover_image_id',
    header: 'Cover',
    meta: {
      class: {
        th: 'w-20',
        td: 'w-20'
      }
    },
    cell: ({ row }) => {
      const coverImage = row.original.cover_image
      return h(UAvatar, { 
        src: coverImage?.public_url,
        alt: coverImage?.alt_text || row.original.title,
        size: 'md',
        icon: 'i-lucide-image'
      })
    }
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'content_type_id',
    header: 'Type',
    meta: {
      class: {
        th: 'w-32',
        td: 'w-32'
      }
    },
    cell: ({ row }) => {
      const typeId = row.getValue('content_type_id') as string
      const currentType = row.original.content_type || contentTypes.value.find(t => t.id === typeId)
      const typeLabel = currentType?.name || 'content'
      
      return h(
        NDropdownMenu,
        {
          items: contentTypes.value.map(type => ({
            label: type.name,
            onClick: (e: Event) => {
              e.stopPropagation()
              changeContentType(row.original.id, type.id)
            }
          })),
        },
        () => h(UBadge, { 
          variant: 'subtle', 
          class: 'cursor-pointer',
          onClick: (e: Event) => e.stopPropagation()
        }, () => typeLabel)
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      class: {
        th: 'w-32 text-center',
        td: 'w-32 text-center'
      }
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const color = {
        published: 'success' as const,
        draft: 'neutral' as const,
        archived: 'error' as const
      }[status] || 'neutral' as const

      return h(UBadge, { 
        class: 'capitalize cursor-pointer', 
        variant: 'subtle', 
        color,
        onClick: (e: Event) => {
          e.stopPropagation()
          toggleStatus(row.original)
        }
      }, () => status)
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    meta: {
      class: {
        th: 'w-48 text-right',
        td: 'w-48 text-right'
      }
    },
    cell: ({ row }) => {
      const timestamp = row.getValue('updated_at') as number
      return new Date(timestamp).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-24 text-right',
        td: 'w-24 text-right'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center justify-end gap-1' }, [
        h(UButton, {
          icon: 'i-lucide-image',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm',
          'aria-label': 'Change cover image',
          onClick: (e: Event) => {
            e.stopPropagation()
            openCoverPicker(row.original.id)
          }
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          color: 'error',
          variant: 'ghost',
          size: 'sm',
          'aria-label': 'Delete content',
          onClick: (e: Event) => {
            e.stopPropagation()
            requestDelete(row.original.id)
          }
        })
      ])
    }
  }
]
</script>

<template>
  <div class="absolute inset-0">
    <NSwitcher class="h-full w-full">
      <!-- Slide 0 - Content List -->
      <template #0="{ navigateForward }">
        <div class="h-full overflow-auto">
          <div class="space-y-3 p-4">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Content</h2>
          <NButton color="success" icon="i-heroicons-plus" @click="openCreateModal">
            Create
          </NButton>
        </div>
        
        <!-- Loading -->
        <template v-if="isLoading">
          <UCard v-for="i in 3" :key="i">
            <USkeleton class="h-4 w-40 mb-2" />
            <USkeleton class="h-3 w-24" />
          </UCard>
        </template>

        <!-- Empty -->
        <div v-else-if="isEmpty" class="flex flex-col items-center justify-center py-20 gap-5 text-center">
          <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted text-muted-foreground">
            <UIcon name="i-lucide-file-text" class="w-8 h-8" />
          </div>
          <p class="text-sm text-muted-foreground max-w-xs">
            Create your first content item to get started
          </p>
          <NButton color="success" icon="i-heroicons-plus" @click="openCreateModal">
            Create content
          </NButton>
        </div>

        <!-- List -->
        <UTable 
          v-else 
          :data="items.value" 
          :columns="columns" 
          :ui="{
            tbody: '[&>tr]:data-[selectable=true]:hover:bg-zinc-500/20 [&>tr]:transition-colors [&>tr]:cursor-pointer',
          }"
          class="flex-1"
          @select="(_e: Event, row: any) => selectContent(row.original.id, navigateForward)"
        />

        <UModal
          v-model:open="createModalOpen"
          title="New Content"
        >
          <template #body>
            <div class="flex flex-col gap-4">
              <UFormField label="Title" required>
                <UInput v-model="createForm.title" placeholder="My Blog Post" class="w-full" autofocus />
              </UFormField>
              <UFormField label="Slug" required>
                <UInput v-model="createForm.slug" placeholder="my-blog-post" class="w-full" />
              </UFormField>
              <UFormField label="Content Type" required>
                <USelect
                  v-model="createForm.content_type_id"
                  :items="contentTypes.map(t => ({ label: t.name, value: t.id }))"
                  placeholder="Select a type…"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Cover Image">
                <div class="flex items-center gap-3">
                  <div class="w-16 h-16 rounded-lg border border-dashed border-muted flex items-center justify-center overflow-hidden shrink-0 bg-muted/30">
                    <img v-if="createForm.coverImageUrl" :src="createForm.coverImageUrl" class="w-full h-full object-cover" alt="Cover">
                    <UIcon v-else name="i-lucide-image" class="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <UButton
                      :label="createForm.coverImageId ? 'Change Image' : 'Choose Image'"
                      color="neutral"
                      variant="subtle"
                      icon="i-lucide-image"
                      size="sm"
                      @click="openCoverPicker('create')"
                    />
                    <UButton
                      v-if="createForm.coverImageId"
                      label="Remove"
                      color="error"
                      variant="ghost"
                      icon="i-lucide-x"
                      size="xs"
                      @click="createForm.coverImageId = null; createForm.coverImageUrl = null"
                    />
                  </div>
                </div>
              </UFormField>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton variant="ghost" color="neutral" label="Cancel" @click="createModalOpen = false" />
              <UButton
                label="Create"
                :loading="creating"
                :disabled="!createForm.title || !createForm.content_type_id"
                @click="createNow"
              />
            </div>
          </template>
        </UModal>

        <!-- Cover Image Picker Modal -->
        <UModal v-model:open="coverPickerOpen" title="Choose Cover Image" :ui="{ content: 'sm:max-w-2xl' }">
          <template #body>
            <input
              ref="coverFileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleCoverFileSelect"
            >
            <UTabs
              v-model="coverPickerTab"
              :items="[
                { value: 'library', label: 'Media Library', icon: 'i-lucide-folder-open' },
                { value: 'upload', label: 'Upload New', icon: 'i-lucide-upload' }
              ]"
              class="mb-4"
            />

            <!-- Library Tab -->
            <div v-if="coverPickerTab === 'library'">
              <div v-if="mediaQuery.isLoading.value" class="flex items-center justify-center py-12">
                <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
              </div>
              <div v-else-if="mediaItems.length === 0" class="text-center py-12">
                <UIcon name="i-lucide-image-off" class="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p class="text-sm text-muted-foreground mb-3">No images in library yet</p>
                <UButton label="Upload your first image" size="sm" @click="coverPickerTab = 'upload'" />
              </div>
              <div v-else class="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                <button
                  v-for="media in mediaItems"
                  :key="media.id"
                  class="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer group"
                  @click="selectCoverFromLibrary(media)"
                >
                  <img :src="media.public_url" :alt="media.alt_text || media.name" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-7 h-7 text-white" />
                  </div>
                </button>
              </div>
            </div>

            <!-- Upload Tab -->
            <div v-if="coverPickerTab === 'upload'">
              <div
                class="border-2 border-dashed border-muted rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                @click="triggerCoverFileInput"
              >
                <div v-if="coverUploading" class="flex flex-col items-center gap-3">
                  <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" />
                  <p class="text-sm text-muted-foreground">Uploading...</p>
                </div>
                <div v-else class="flex flex-col items-center gap-3">
                  <UIcon name="i-lucide-upload" class="w-10 h-10 text-muted-foreground" />
                  <p class="text-sm font-medium">Click to upload an image</p>
                </div>
              </div>
            </div>
          </template>
        </UModal>

        <UModal
          v-model:open="modalOpen"
          title="Do you want to delete this content?"
          description="This action cannot be undone."
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
          </div>
        </div>
      </template>

      <!-- Slide 1 - Editor -->
      <template #1="{ navigateBack }">
        <KeepAlive>
          <ContentEditor 
            :content="editorContent" 
            @exit="goBackToList(navigateBack)" 
          />
        </KeepAlive>
      </template>
    </NSwitcher>
  </div>
</template>
