<script setup lang="ts">
import type { EditorCustomHandlers, EditorToolbarItem, EditorSuggestionMenuItem, EditorEmojiMenuItem, DropdownMenuItem } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { upperFirst } from 'scule'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { TextAlign } from '@tiptap/extension-text-align'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { ImageUpload } from '~/components/editor/ImageUploadExtension'
import { CustomImage } from '~/components/editor/ImageExtension'
import { useEditorCompletion } from '~/composables/useEditorCompletion'
import EditorLinkPopover from '~/components/editor/LinkPopover.vue'

const props = defineProps<{
  content: any
}>()

const emit = defineEmits<{
  exit: []
}>()

const { updateContentMutation } = useProjectContent()
const toast = useToast()

const editorRef = useTemplateRef('editorRef')
const value = ref('')

const coverImageId = ref<string | null>(props.content?.cover_image_id ?? null)

provide('coverImageId', coverImageId)

watch(() => props.content, (newContent) => {
  coverImageId.value = newContent?.cover_image_id ?? null
  if (newContent?.data && (newContent.data as any).content) {
    value.value = (newContent.data as any).content
  } else if (newContent) {
    value.value = `# ${newContent.title}\n\nStart editing...`
  }
}, { immediate: true })

// Extract the first H1 from the markdown and use it as the content title
const extractedTitle = computed(() => {
  const match = value.value.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() ?? null
})

// Save handlers
const handleSave = async () => {
  await updateContentMutation.mutateAsync({
    contentId: props.content.id,
    data: {
      status: 'draft',
      ...(extractedTitle.value ? { title: extractedTitle.value } : {}),
      data: { ...props.content.data, content: value.value }
    }
  })
}

const handlePublish = async () => {
  await updateContentMutation.mutateAsync({
    contentId: props.content.id,
    data: {
      status: 'published',
      ...(extractedTitle.value ? { title: extractedTitle.value } : {}),
      data: { ...props.content.data, content: value.value },
      published_at: Date.now()
    }
  })
  emit('exit')
}

const { extension: completionExtension } = useEditorCompletion(editorRef)

// Editor extensions
const editorExtensions = [
  Emoji,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  CustomImage,
  ImageUpload,
  CodeBlockShiki.configure({
    defaultTheme: 'material-theme',
    themes: {
      light: 'material-theme-lighter',
      dark: 'material-theme-palenight'
    }
  }),
  completionExtension
]

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  },
} satisfies EditorCustomHandlers

const bubbleToolbarItems = computed(() => [[{
  label: 'Turn into',
  trailingIcon: 'i-lucide-chevron-down',
  activeColor: 'neutral',
  activeVariant: 'ghost',
  tooltip: { text: 'Turn into' },
  content: {
    align: 'start'
  },
  ui: {
    label: 'text-xs'
  },
  items: [{
    type: 'label',
    label: 'Turn into'
  }, {
    kind: 'paragraph',
    label: 'Paragraph',
    icon: 'i-lucide-type'
  }, {
    kind: 'heading',
    level: 1,
    icon: 'i-lucide-heading-1',
    label: 'Heading 1'
  }, {
    kind: 'heading',
    level: 2,
    icon: 'i-lucide-heading-2',
    label: 'Heading 2'
  }, {
    kind: 'heading',
    level: 3,
    icon: 'i-lucide-heading-3',
    label: 'Heading 3'
  }, {
    kind: 'heading',
    level: 4,
    icon: 'i-lucide-heading-4',
    label: 'Heading 4'
  }, {
    kind: 'bulletList',
    icon: 'i-lucide-list',
    label: 'Bullet List'
  }, {
    kind: 'orderedList',
    icon: 'i-lucide-list-ordered',
    label: 'Ordered List'
  }, {
    kind: 'blockquote',
    icon: 'i-lucide-text-quote',
    label: 'Blockquote'
  }]
}], [{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold',
  tooltip: { text: 'Bold' }
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic',
  tooltip: { text: 'Italic' }
}, {
  kind: 'mark',
  mark: 'underline',
  icon: 'i-lucide-underline',
  tooltip: { text: 'Underline' }
}, {
  kind: 'mark',
  mark: 'strike',
  icon: 'i-lucide-strikethrough',
  tooltip: { text: 'Strikethrough' }
}], [{
  slot: 'link' as const,
  icon: 'i-lucide-link'
}, {
  kind: 'imageUpload',
  icon: 'i-lucide-image',
  tooltip: { text: 'Image' }
}], [{
  icon: 'i-lucide-align-justify',
  tooltip: { text: 'Text Align' },
  content: {
    align: 'end'
  },
  items: [{
    kind: 'textAlign',
    align: 'left',
    icon: 'i-lucide-align-left',
    label: 'Align Left'
  }, {
    kind: 'textAlign',
    align: 'center',
    icon: 'i-lucide-align-center',
    label: 'Align Center'
  }, {
    kind: 'textAlign',
    align: 'right',
    icon: 'i-lucide-align-right',
    label: 'Align Right'
  }, {
    kind: 'textAlign',
    align: 'justify',
    icon: 'i-lucide-align-justify',
    label: 'Align Justify'
  }]
}]] satisfies EditorToolbarItem<typeof customHandlers>[][])

const imageToolbarItems = (editor: Editor): EditorToolbarItem[][] => {
  const node = editor.state.doc.nodeAt(editor.state.selection.from)

  return [[{
    icon: 'i-lucide-image',
    tooltip: { text: 'Set as Cover' },
    onClick: async () => {
      const { state } = editor
      const { selection } = state
      const pos = selection.from
      const node = state.doc.nodeAt(pos)

      if (node && node.type.name === 'image' && node.attrs.mediaId) {
        try {
          await $fetch(`/api/contents/${props.content.id}/cover-image`, {
            method: 'PATCH',
            body: { coverImageId: node.attrs.mediaId }
          })
          
          // Update local content to reflect the change
          coverImageId.value = node.attrs.mediaId
          
          // Save content immediately
          await handleSave()
          
          toast.add({
            title: 'Cover image set',
            color: 'success',
          })
        } catch (error) {
          toast.add({
            title: 'Failed to set cover image' + (error instanceof Error ? `: ${error.message}` : ''),
            color: 'error',
          })
        }
      }
    }
  }], [{
    icon: node?.attrs?.title === 'hidden' ? 'i-lucide-eye' : 'i-lucide-eye-off',
    tooltip: { text: node?.attrs?.title === 'hidden' ? 'Show in content' : 'Hide from content' },
    onClick: () => {
      const { state } = editor
      const pos = state.selection.from
      const n = state.doc.nodeAt(pos)
      if (n) {
        const newTitle = n.attrs.title === 'hidden' ? null : 'hidden'
        editor.chain().focus().updateAttributes('image', { title: newTitle }).run()
      }
    }
  }], [{
    icon: 'i-lucide-download',
    to: node?.attrs?.src,
    download: true,
    tooltip: { text: 'Download' }
  }, {
    icon: 'i-lucide-refresh-cw',
    tooltip: { text: 'Replace' },
    onClick: () => {
      const { state } = editor
      const { selection } = state
      const pos = selection.from
      const node = state.doc.nodeAt(pos)

      if (node && node.type.name === 'image') {
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).insertContentAt(pos, { type: 'imageUpload' }).run()
      }
    }
  }], [{
    icon: 'i-lucide-trash',
    tooltip: { text: 'Delete' },
    onClick: () => {
      const { state } = editor
      const { selection } = state
      const pos = selection.from
      const node = state.doc.nodeAt(pos)

      if (node && node.type.name === 'image') {
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
      }
    }
  }]]
}

const selectedNode = ref<{ node: JSONContent, pos: number }>()

const handleItems = (editor: Editor): DropdownMenuItem[][] => {
  if (!selectedNode.value?.node?.type) {
    return []
  }

  return mapEditorItems(editor, [[
    {
      type: 'label',
      label: upperFirst(selectedNode.value.node.type)
    },
    {
      label: 'Turn into',
      icon: 'i-lucide-repeat-2',
      children: [
        { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
        { kind: 'heading', level: 1, label: 'Heading 1', icon: 'i-lucide-heading-1' },
        { kind: 'heading', level: 2, label: 'Heading 2', icon: 'i-lucide-heading-2' },
        { kind: 'heading', level: 3, label: 'Heading 3', icon: 'i-lucide-heading-3' },
        { kind: 'heading', level: 4, label: 'Heading 4', icon: 'i-lucide-heading-4' },
        { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
        { kind: 'orderedList', label: 'Ordered List', icon: 'i-lucide-list-ordered' },
        { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
      ]
    },
    {
      kind: 'clearFormatting',
      pos: selectedNode.value?.pos,
      label: 'Reset formatting',
      icon: 'i-lucide-rotate-ccw'
    }
  ], [
    {
      kind: 'duplicate',
      pos: selectedNode.value?.pos,
      label: 'Duplicate',
      icon: 'i-lucide-copy'
    },
    {
      label: 'Copy to clipboard',
      icon: 'i-lucide-clipboard',
      onSelect: async () => {
        if (!selectedNode.value) return
        const pos = selectedNode.value.pos
        const node = editor.state.doc.nodeAt(pos)
        if (node) {
          await navigator.clipboard.writeText(node.textContent)
        }
      }
    }
  ], [
    {
      kind: 'moveUp',
      pos: selectedNode.value?.pos,
      label: 'Move up',
      icon: 'i-lucide-arrow-up'
    },
    {
      kind: 'moveDown',
      pos: selectedNode.value?.pos,
      label: 'Move down',
      icon: 'i-lucide-arrow-down'
    }
  ], [
    {
      kind: 'delete',
      pos: selectedNode.value?.pos,
      label: 'Delete',
      icon: 'i-lucide-trash'
    }
  ]], customHandlers) as DropdownMenuItem[][]
}

const suggestionItems = [[{
  type: 'label',
  label: 'Style'
}, {
  kind: 'paragraph',
  label: 'Paragraph',
  icon: 'i-lucide-type'
}, {
  kind: 'heading',
  level: 1,
  label: 'Heading 1',
  icon: 'i-lucide-heading-1'
}, {
  kind: 'heading',
  level: 2,
  label: 'Heading 2',
  icon: 'i-lucide-heading-2'
}, {
  kind: 'heading',
  level: 3,
  label: 'Heading 3',
  icon: 'i-lucide-heading-3'
}, {
  kind: 'bulletList',
  label: 'Bullet List',
  icon: 'i-lucide-list'
}, {
  kind: 'orderedList',
  label: 'Numbered List',
  icon: 'i-lucide-list-ordered'
}, {
  kind: 'blockquote',
  label: 'Blockquote',
  icon: 'i-lucide-text-quote'
}], [{
  type: 'label',
  label: 'Insert'
}, {
  kind: 'imageUpload',
  label: 'Image',
  icon: 'i-lucide-image'
}, {
  kind: 'horizontalRule',
  label: 'Horizontal Rule',
  icon: 'i-lucide-separator-horizontal'
}]] satisfies EditorSuggestionMenuItem<typeof customHandlers>[][]

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))

// Toolbar state
const activeFormat = computed(() => {
  if (!editorRef.value?.editor) return 'Format'
  const editor = editorRef.value.editor
  
  if (editor.isActive('heading', { level: 1 })) return 'H1'
  if (editor.isActive('heading', { level: 2 })) return 'H2'
  if (editor.isActive('heading', { level: 3 })) return 'H3'
  if (editor.isActive('heading', { level: 4 })) return 'H4'
  if (editor.isActive('paragraph')) return 'Paragraph'
  
  return 'Format'
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Editor -->
    <div class="flex-1 overflow-auto">
      <UEditor
        ref="editorRef"
        v-slot="{ editor, handlers }"
        v-model="value"
        content-type="markdown"
        :starter-kit="{ codeBlock: false }"
        :extensions="editorExtensions"
        :handlers="customHandlers"
        placeholder="Write, type '/' for commands..."
        :ui="{ base: 'p-8 sm:px-16 py-13.5' }"
        class="w-full"
      >
        <!-- Custom Toolbar -->
        <div class="border-b border-muted sticky top-0 inset-x-0 px-2 py-2 z-50 bg-white dark:bg-zinc-800">
          <div class="flex items-center justify-between gap-4">
            <!-- Left: Back button and status -->
            <div class="flex items-center gap-3">
              <NButton
                icon="i-lucide-arrow-left"
                size="sm"
                @click="emit('exit')"
              />
              <UBadge
                :color="content.status === 'published' ? 'success' : 'neutral'"
                variant="subtle"
                class="capitalize"
              >
                {{ content.status }}
              </UBadge>

              <!-- Undo/Redo -->
              <div class="flex items-center gap-1">
                <NButton
                  icon="i-lucide-undo"
                  size="sm"
                  :disabled="!editor.can().undo()"
                  @click="editor.chain().focus().undo().run()"
                />
                <NButton
                  icon="i-lucide-redo"
                  size="sm"
                  :disabled="!editor.can().redo()"
                  @click="editor.chain().focus().redo().run()"
                />
              </div>
            </div>

            <!-- Center: Format controls -->
            <div class="flex items-center gap-2 text-muted-foreground">
              <!-- Format Dropdown -->
              <UDropdownMenu
                :items="[[
                  { label: 'H1', click: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
                  { label: 'H2', click: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
                  { label: 'H3', click: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
                  { label: 'H4', click: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
                  { label: 'Paragraph', click: () => editor.chain().focus().setParagraph().run() }
                ]]"
              >
                <NButton
                  color="neutral"
                  size="sm"
                  trailing-icon="i-lucide-chevron-down"
                  class="w-29"
                >
                  <span class="min-w-16">{{ activeFormat }}</span>
                </NButton>
              </UDropdownMenu>

              <!-- Link -->
              <EditorLinkPopover :editor="editor" auto-open />

              <!-- Add Image -->
              <NButton
                color="neutral"
                size="sm"
                @click="editor.chain().focus().insertContent({ type: 'imageUpload' }).run()"
              >
                Add Image
              </NButton>

              <!-- Text Align -->
              <UDropdownMenu
                :items="[[
                  { label: 'Align Left', icon: 'i-lucide-align-left', click: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
                  { label: 'Align Center', icon: 'i-lucide-align-center', click: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
                  { label: 'Align Right', icon: 'i-lucide-align-right', click: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
                  { label: 'Align Justify', icon: 'i-lucide-align-justify', click: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) }
                ]]"
              >
                <UButton
                  icon="i-lucide-align-justify"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                />
              </UDropdownMenu>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center gap-2">
              <NButton
                color="neutral"
                size="sm"
                @click="handleSave"
              >
                Save
              </NButton>
              <NButton
                color="custom"
                size="sm"
                icon="i-lucide-arrow-up"
                class="before:bg-violet-500 pr-4 font-semibold"
                @click="handlePublish"
              >
                Publish
              </NButton>
            </div>
          </div>
        </div>

        <UEditorToolbar
          :editor="editor"
          :items="bubbleToolbarItems"
          layout="bubble"
          :should-show="({ editor, view, state }) => {
            if (editor.isActive('imageUpload') || editor.isActive('image')) {
              return false
            }
            const { selection } = state
            return view.hasFocus() && !selection.empty
          }"
        >
          <template #link>
            <EditorLinkPopover :editor="editor" />
          </template>
        </UEditorToolbar>

        <UEditorToolbar
          :editor="editor"
          :items="imageToolbarItems(editor)"
          layout="bubble"
          :should-show="({ editor, view }) => {
            return editor.isActive('image') && view.hasFocus()
          }"
        />

        <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="selectedNode = $event">
          <UButton
            icon="i-lucide-plus"
            color="neutral"
            variant="ghost"
            size="sm"
            :class="ui.handle()"
            @click="(e) => {
              e.stopPropagation()
              const selected = onClick()
              handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
            }"
          />

          <UDropdownMenu
            v-slot="{ open }"
            :modal="false"
            :items="handleItems(editor)"
            :content="{ side: 'left' }"
            :ui="{ content: 'w-48', label: 'text-xs' }"
            @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
          >
            <UButton
              color="neutral"
              variant="ghost"
              active-variant="soft"
              size="sm"
              icon="i-lucide-grip-vertical"
              :active="open"
              :class="ui.handle()"
            />
          </UDropdownMenu>
        </UEditorDragHandle>

        <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
        <UEditorEmojiMenu :editor="editor" :items="emojiItems" />
      </UEditor>
    </div>
  </div>
</template>

<style>
html.dark .tiptap .shiki,
html.dark .tiptap .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--ui-bg-muted) !important;
}
</style>