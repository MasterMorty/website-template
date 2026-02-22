import { createAuthClient } from "better-auth/vue";
import { adminClient, organizationClient, apiKeyClient } from "better-auth/client/plugins";
import { ac, superadmin, admin, user, viewer } from "~~/lib/permissions";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: {
                superadmin,
                admin,
                user,
                viewer,
            }
        }),
        organizationClient(),
        apiKeyClient(),
    ]
});

export const useAuthStore = defineStore("useAuthStore", () => {
    const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
    async function init() {
        const data = await authClient.useSession(useFetch);
        session.value = data;
    }

    const user = computed(() => session.value?.data?.user);
    const loading = computed(() => session.value?.isPending);
    const isAuthenticated = computed(() => !!user.value);

    async function signIn(email: string, password: string) {
        await authClient.signIn.email({
            email: email,
            password: password,
            callbackURL: "/hub",
        });
    }

    async function signOut() {
        await authClient.signOut();
        navigateTo("/");
    }

    return {
        init,
        session,
        user,
        loading,
        isAuthenticated,
        signIn,
        signOut,
    };
});
