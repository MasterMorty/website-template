export const getProjectMediaAPI = (projectId: string) => {
  return $fetch(`/api/projects/${projectId}/media`)
}

export const getProjectMediaByTagsAPI = (projectId: string, tags: string[]) => {
  const params = new URLSearchParams()
  tags.forEach(tag => params.append('tags', tag))
  return $fetch(`/api/projects/${projectId}/media/by-tags?${params.toString()}`)
}

export const updateMediaAPI = (projectId: string, mediaId: string, data: { tags?: string[], altText?: string, name?: string }) => {
  return $fetch(`/api/media/${mediaId}`, {
    method: "PATCH",
    body: { projectId, ...data },
  })
}

export const deleteMediaAPI = (projectId: string, mediaId: string) => {
  return $fetch(`/api/media/${mediaId}`, {
    method: "DELETE",
    body: { projectId },
  })
}
