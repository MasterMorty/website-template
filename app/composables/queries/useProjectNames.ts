import { useQuery } from "@tanstack/vue-query";
import { getProjectNamesAPI } from "../api/project";

export const useProjectNames = () => {
  const authStore = useAuthStore();

  return useQuery({
    queryKey: ["project-names"],
    queryFn: getProjectNamesAPI,
    enabled: computed(() => authStore.isAuthenticated),
  });
};