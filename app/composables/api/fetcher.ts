export async function fetcher<T>(
  endpoint: string,
  options?: Parameters<typeof $fetch>[1]
): Promise<T> {
  try {
    const fetchOptions: Parameters<typeof $fetch>[1] = {
      credentials: 'include',
      ...options,
    };

    return await $fetch<T>(endpoint, fetchOptions) as T;
  } catch (err: any) {
    throw new Error(
      err?.data?.error ||
      err?.message ||
      'An error occurred during data fetching.'
    );
  }
}