import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { API } from '../../api/backendAPI'
import { Endpoint } from "../../types/api.types";

export function useQueryBase(endpoint: Endpoint, sendCookies: boolean = false, shouldRetry: boolean | ((failureCount: number, error: any) => boolean) = false, staleTime: number | undefined = undefined) {
    return ({ queryKey }: { queryKey?: string[] }) => useQuery({
        queryKey: queryKey || [],
        queryFn: async () => {
            const { data } = await API.get(endpoint.URL, { withCredentials: sendCookies })
            return data;
        },
        retry: (failureCount: number, error: AxiosError) => {
            if (typeof shouldRetry === 'function')
                return shouldRetry(failureCount, error);

            if (error.status === 401)
                return false;

            return shouldRetry;
        },
        staleTime
    })
}