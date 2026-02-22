export const getProjectContentAPI = (projectId: string) => {
  return $fetch(`/api/projects/${projectId}/content`)
}

export const getProjectContentTypesAPI = (projectId: string) => {
  return $fetch(`/api/projects/${projectId}/content-types`)
}

export const createContentAPI = (projectId: string, data: any) => {
  return $fetch(`/api/projects/${projectId}/content`, {
    method: "POST",
    body: data,
  })
}

export const updateContentAPI = (
  projectId: string,
  contentId: string,
  data: any
) => {
  return $fetch(`/api/projects/${projectId}/${contentId}`, {
    method: "PUT",
    body: data,
  })
}

export const deleteContentAPI = (projectId: string, contentId: string) => {
  return $fetch(`/api/projects/${projectId}/${contentId}`, {
    method: "DELETE",
  })
}