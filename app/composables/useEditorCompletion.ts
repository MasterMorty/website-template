import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { Completion } from '../components/editor/CompletionExtension'

export function useEditorCompletion(_editorRef: Ref<any>) {
  const isLoading = ref(false)

  // Create extension instance once (not reactive)
  const extension = Completion.configure({
    autoTrigger: false,
    debounce: 250,
  })

  const handlers = {
    aiContinue: {
      canExecute: (_editor: Editor) => true,
      execute: async (editor: Editor) => {
        isLoading.value = true
        try {
          // Simulate AI completion - replace with actual AI API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          const text = ' and here is some AI-generated continuation text.'
          editor.commands.insertContent(text)
        } finally {
          isLoading.value = false
        }
      },
      isActive: () => false,
      isDisabled: () => isLoading.value
    },
    aiFix: {
      canExecute: (editor: Editor) => !editor.state.selection.empty,
      execute: async (editor: Editor) => {
        isLoading.value = true
        try {
          const { from, to } = editor.state.selection
          const text = editor.state.doc.textBetween(from, to)
          // Simulate AI fix - replace with actual AI API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          editor.commands.insertContentAt({ from, to }, text + ' [fixed]')
        } finally {
          isLoading.value = false
        }
      },
      isActive: () => false,
      isDisabled: () => isLoading.value
    },
    aiExtend: {
      canExecute: (editor: Editor) => !editor.state.selection.empty,
      execute: async (editor: Editor) => {
        isLoading.value = true
        try {
          const { to } = editor.state.selection
          await new Promise(resolve => setTimeout(resolve, 1000))
          editor.commands.insertContentAt(to, ' [extended content]')
        } finally {
          isLoading.value = false
        }
      },
      isActive: () => false,
      isDisabled: () => isLoading.value
    },
    aiReduce: {
      canExecute: (editor: Editor) => !editor.state.selection.empty,
      execute: async (editor: Editor) => {
        isLoading.value = true
        try {
          const { from, to } = editor.state.selection
          const text = editor.state.doc.textBetween(from, to)
          await new Promise(resolve => setTimeout(resolve, 1000))
          const reduced = text.substring(0, Math.floor(text.length / 2))
          editor.commands.insertContentAt({ from, to }, reduced)
        } finally {
          isLoading.value = false
        }
      },
      isActive: () => false,
      isDisabled: () => isLoading.value
    },
    aiSimplify: {
      canExecute: (editor: Editor) => !editor.state.selection.empty,
      execute: async (editor: Editor) => {
        isLoading.value = true
        try {
          const { from, to } = editor.state.selection
          const text = editor.state.doc.textBetween(from, to)
          await new Promise(resolve => setTimeout(resolve, 1000))
          editor.commands.insertContentAt({ from, to }, text + ' [simplified]')
        } finally {
          isLoading.value = false
        }
      },
      isActive: () => false,
      isDisabled: () => isLoading.value
    },
    aiSummarize: {
      canExecute: (editor: Editor) => !editor.state.selection.empty,
      execute: async (editor: Editor) => {
        isLoading.value = true
        try {
          const { from, to } = editor.state.selection
          await new Promise(resolve => setTimeout(resolve, 1000))
          editor.commands.insertContentAt({ from, to }, 'Summary: ...')
        } finally {
          isLoading.value = false
        }
      },
      isActive: () => false,
      isDisabled: () => isLoading.value
    },
    aiTranslate: {
      canExecute: (editor: Editor) => !editor.state.selection.empty,
      execute: async (editor: Editor, { language }: { language: string }) => {
        isLoading.value = true
        try {
          const { from, to } = editor.state.selection
          const text = editor.state.doc.textBetween(from, to)
          await new Promise(resolve => setTimeout(resolve, 1000))
          editor.commands.insertContentAt({ from, to }, `${text} [translated to ${language}]`)
        } finally {
          isLoading.value = false
        }
      },
      isActive: () => false,
      isDisabled: () => isLoading.value
    }
  }

  return {
    extension,
    handlers,
    isLoading
  }
}
