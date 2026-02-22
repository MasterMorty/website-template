import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { getProjectMediaAPI, deleteMediaAPI, updateMediaAPI, getProjectMediaByTagsAPI } from "../api/media"
import { useActiveProject } from "./useActiveProject"

export interface Media {
  id: string
  project_id: string
  name: string
  file_name: string
  mime_type: string
  file_size: number
  storage_path: string
  public_url: string
  width: number | null
  height: number | null
  tags: string[]
  alt_text: string
  uploaded_by_id: string
  created_at: number
}

export const useProjectMedia = () => {
  const { projectId } = useActiveProject()
  const queryClient = useQueryClient()

  const mediaQuery = useQuery({
    queryKey: ["project-media", projectId],
    queryFn: () => getProjectMediaAPI(projectId.value!),
    enabled: computed(() => !!projectId.value),
  })

  const deleteMediaMutation = useMutation({
    mutationFn: (mediaId: string) =>
      deleteMediaAPI(projectId.value!, mediaId),

    onMutate: async (mediaId) => {
      await queryClient.cancelQueries({ queryKey: ["project-media", projectId.value] })

      const previous = queryClient.getQueryData<Media[]>(["project-media", projectId.value])

      if (previous) {
        queryClient.setQueryData<Media[]>(
          ["project-media", projectId.value],
          previous.filter(m => m.id !== mediaId)
        )
      }

      return { previous }
    },

    onError: (_err, _mediaId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["project-media", projectId.value], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-media", projectId.value] })
    },
  })

  const updateMediaMutation = useMutation({
    mutationFn: ({ mediaId, data }: { mediaId: string, data: { tags?: string[], altText?: string, name?: string } }) =>
      updateMediaAPI(projectId.value!, mediaId, data),

    onMutate: async ({ mediaId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["project-media", projectId.value] })

      const previous = queryClient.getQueryData<Media[]>(["project-media", projectId.value])

      if (previous) {
        queryClient.setQueryData<Media[]>(
          ["project-media", projectId.value],
          previous.map(m => m.id === mediaId ? { ...m, ...data } : m)
        )
      }

      return { previous }
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["project-media", projectId.value], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-media", projectId.value] })
    },
  })

  return {
    mediaQuery,
    deleteMediaMutation,
    updateMediaMutation,
  }
}

export const useProjectMediaByTags = (tags: Ref<string[]>) => {
  const { projectId } = useActiveProject()

  const mediaByTagsQuery = useQuery({
    queryKey: ["project-media-by-tags", projectId, tags],
    queryFn: () => getProjectMediaByTagsAPI(projectId.value!, tags.value),
    enabled: computed(() => !!projectId.value && tags.value.length > 0),
  })

  return {
    mediaByTagsQuery,
  }
}
