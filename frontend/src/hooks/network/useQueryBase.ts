import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import API from '../../api/backendAPI'
import { HTTP_METHODS } from "../../types/APITypes";

export function useQueryBase(endpoint: { URL: string, METHOD: HTTP_METHODS }, queryKey: string[], sendCookies: boolean = false, shouldRetry: boolean | ((failureCount: number, error: any) => boolean) = false, staleTime: number | undefined = undefined) {
    return () => useQuery({
        queryKey,
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