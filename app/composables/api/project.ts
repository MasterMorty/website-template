import type { ProjectWithContents, Project } from "~~/lib/db/types";
import { fetcher } from "./fetcher";

export function getActiveProjectAPI(id: string) {
  return fetcher<ProjectWithContents>(`/api/projects/${id}`, { credentials: 'include' });
}

export function getProjectNamesAPI() {
  return fetcher<{ id: string; name: string }[]>(
    "/api/projects/names",
    { credentials: 'include' }
  );
}

export function createProjectAPI(data: Partial<Project>) {
  return fetcher<Project>("/api/projects", {
    method: "POST",
    body: data,
    credentials: 'include',
  });
}

export function updateProjectAPI(projectId: string, data: Partial<Project>) {
  return fetcher<Project>(`/api/projects/${projectId}`, {
    method: "PUT",
    body: data,
    credentials: 'include',
  });
}

export function deleteProjectAPI(projectId: string) {
  return fetcher<{ success: boolean }>(`/api/projects/${projectId}`, {
    method: "DELETE",
    credentials: 'include',
  });
}