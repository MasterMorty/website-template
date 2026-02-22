import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import {
  getProjectContentAPI,
  createContentAPI,
  updateContentAPI,
  deleteContentAPI,
} from "../api/content"
import { useActiveProject } from "./useActiveProject"
import { uuidv7 } from "uuidv7"

export interface Content {
  id: string
  project_id: string
  content_type_id: string
  title: string
  slug: string
  data: any
  status: "draft" | "published" | "archived"
  cover_image_id?: string | null
  created_by_id: string
  updated_by_id?: string
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

export const useProjectContent = () => {
  const { projectId } = useActiveProject()
  const queryClient = useQueryClient()

  const contentQuery = useQuery({
    queryKey: ["project-content", projectId],
    queryFn: () => getProjectContentAPI(projectId.value!),
    enabled: computed(() => !!projectId.value),
  })

  const createContentMutation = useMutation({
    mutationFn: (data: Partial<Content>) =>
      createContentAPI(projectId.value!, data),

    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["project-content", projectId.value] })

      const previous = queryClient.getQueryData<Content[]>(["project-content", projectId.value])

      queryClient.setQueryData<Content[]>(
        ["project-content", projectId.value],
        previous ? [
          ...previous,
          {
            id: uuidv7(),
            project_id: projectId.value!,
            content_type_id: newContent.content_type_id || "",
            title: newContent.title || "",
            slug: newContent.slug || "",
            data: newContent.data || {},
            status: newContent.status || "draft",
            cover_image_id: newContent.cover_image_id ?? null,
            created_by_id: newContent.created_by_id || "",
            updated_by_id: newContent.updated_by_id,
            published_at: newContent.published_at ?? null,
            created_at: Date.now(),
            updated_at: Date.now(),
            cover_image: newContent.cover_image ?? null,
            content_type: newContent.content_type ?? null,
          }
        ] : []
      )

      return { previous }
    },

    onError: (_err, _newContent, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["project-content", projectId.value], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-content", projectId.value] })
    },
  })

  const updateContentMutation = useMutation({
    mutationFn: ({ contentId, data }: { contentId: string; data: Partial<Content> }) =>
      updateContentAPI(projectId.value!, contentId, data),

    onMutate: async ({ contentId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["project-content", projectId.value] })

      const previous = queryClient.getQueryData<Content[]>(["project-content", projectId.value])

      if (previous) {
        queryClient.setQueryData<Content[]>(["project-content", projectId.value],
          previous.map(c => c.id === contentId ? { ...c, ...data } : c)
        )
      }

      return { previous }
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["project-content", projectId.value], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-content", projectId.value] })
    },
  })

  const deleteContentMutation = useMutation({
    mutationFn: (contentId: string) =>
      deleteContentAPI(projectId.value!, contentId),

    onMutate: async (contentId) => {
      await queryClient.cancelQueries({
        queryKey: ["project-content", projectId.value],
      })

      const previous =
        queryClient.getQueryData<Content[]>([
          "project-content",
          projectId.value,
        ])

      // optimistic remove
      if (previous) {
        queryClient.setQueryData<Content[]>(
          ["project-content", projectId.value],
          previous.filter((c) => c.id !== contentId)
        )
      }

      return { previous }
    },

    onError: (_err, _id, context) => {
      // rollback if API fails
      if (context?.previous) {
        queryClient.setQueryData(
          ["project-content", projectId.value],
          context.previous
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-content", projectId.value],
      })
    },
  })

  return {
    contentQuery,
    createContentMutation,
    updateContentMutation,
    deleteContentMutation,
  }
}