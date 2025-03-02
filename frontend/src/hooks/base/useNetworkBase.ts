import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import API from '../../api/backendAPI'
import { HTTP_METHODS } from "../../types/APITypes";

export const useNetworkBase = <T>(endpoint: { URL: string, METHOD: HTTP_METHODS }, queryKeys: string[], actionName: string, sendCookies: boolean = false) => {

    const callbackFunc = async (payload?: T) => {
        let response = { data: null };

        if (["GET", "DELETE", "OPTIONS"].includes(endpoint.METHOD))
            // @ts-ignore
            response = await API[endpoint.METHOD.toLowerCase()](endpoint.URL, { withCredentials: sendCookies });

        if (["POST", "PUT", "PATCH"].includes(endpoint.METHOD))
            // @ts-ignore
            response = await API[endpoint.METHOD.toLowerCase()](endpoint.URL, payload, { withCredentials: sendCookies });

        const { data } = response;
        return data;
    };

    return () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: callbackFunc,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys });
            },
            onError: (err) => {
                if (axios.isAxiosError(err)) {
                    const error = err as AxiosError<{ message: unknown }>;
                    console.error(`${actionName} failed:`, error?.response?.data?.message);
                } else if (err instanceof Error) {
                    console.error(`${actionName} failed:`, err?.message)
                } else {
                    console.error("Unknown error occured", err)
                }
            }
        });
    };
}