import { QueryClient } from "@tanstack/react-query";

export function clearCachedData(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    queryClient.invalidateQueries({ queryKey: ['auth'] });
}