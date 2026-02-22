import { useQuery } from "@tanstack/vue-query";
import { getActiveProjectAPI, getProjectNamesAPI } from "../api/project";

export const useActiveProject = () => {
  const authStore = useAuthStore();
  const projectId = useCookie<string>("activeProject");

  const projectNamesQuery = useQuery({
    queryKey: ["project-names"],
    queryFn: getProjectNamesAPI,
    enabled: computed(() => authStore.isAuthenticated),
  });

watchEffect(() => {
  const projects = projectNamesQuery.data?.value;

  if (!projectId.value && projects?.length) {
    const firstId = projects[0];
    if (firstId) {
      projectId.value = firstId.id;
    }
  }
});

  const activeProjectQuery = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getActiveProjectAPI(projectId.value!),
    enabled: computed(
      () => !!projectId.value && authStore.isAuthenticated
    ),
  });

  return {
    projectNamesQuery,
    activeProjectQuery,
    projectId,
  };
};