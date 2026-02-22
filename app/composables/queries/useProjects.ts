import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import {
  getProjectNamesAPI,
  createProjectAPI,
  updateProjectAPI,
  deleteProjectAPI,
} from "../api/project"
import { uuidv7 } from "uuidv7"
import type { Project } from "~~/lib/db/types"

export const useProjects = () => {
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    queryKey: ["project-names"],
    queryFn: getProjectNamesAPI,
  })

  const createProjectMutation = useMutation({
    mutationFn: (data: Partial<Project>) => createProjectAPI(data),

    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ["project-names"] })

      const previous = queryClient.getQueryData<{ id: string; name: string }[]>(["project-names"])

      queryClient.setQueryData<{ id: string; name: string }[]>(
        ["project-names"],
        previous ? [
          ...previous,
          {
            id: uuidv7(),
            name: newProject.name || "",
          }
        ] : []
      )

      return { previous }
    },

    onError: (_err, _newProject, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["project-names"], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-names"] })
    },
  })

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<Project> }) =>
      updateProjectAPI(projectId, data),

    onMutate: async ({ projectId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["project-names"] })

      const previous = queryClient.getQueryData<{ id: string; name: string }[]>(["project-names"])

      if (previous) {
        queryClient.setQueryData<{ id: string; name: string }[]>(
          ["project-names"],
          previous.map(p => p.id === projectId ? { ...p, name: data.name || p.name } : p)
        )
      }

      return { previous }
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["project-names"], context.previous)
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-names"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] })
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProjectAPI(projectId),

    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: ["project-names"] })

      const previous = queryClient.getQueryData<{ id: string; name: string }[]>(["project-names"])

      if (previous) {
        queryClient.setQueryData<{ id: string; name: string }[]>(
          ["project-names"],
          previous.filter(p => p.id !== projectId)
        )
      }

      return { previous }
    },

    onError: (_err, _projectId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["project-names"], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-names"] })
    },
  })

  return {
    projectsQuery,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  }
}
