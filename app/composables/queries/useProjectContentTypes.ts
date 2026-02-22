import { useQuery } from "@tanstack/vue-query"
import { getProjectContentTypesAPI } from "../api/content"
import { useActiveProject } from "./useActiveProject"

export interface ContentType {
  id: string
  project_id: string
  name: string
  slug: string
  description: string | null
  schema: any
  created_at: number
}

export const useProjectContentTypes = () => {
  const { projectId } = useActiveProject()

  const contentTypesQuery = useQuery({
    queryKey: ["project-content-types", projectId],
    queryFn: () => getProjectContentTypesAPI(projectId.value!),
    enabled: computed(() => !!projectId.value),
  })

  return {
    contentTypesQuery,
    contentTypes: computed(() => contentTypesQuery.data.value ?? []),
  }
}
