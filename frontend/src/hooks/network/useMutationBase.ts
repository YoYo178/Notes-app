import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

import { API } from "../../api/backendAPI";

import { Endpoint } from "../../types/api.types";
import { injectPathParams } from "../../util/api.utils";

export const useMutationBase = <T>(endpoint: Endpoint, actionName: string, sendCookies: boolean = false) => {
    return ({ queryKey = [], pathParams = {} }: { queryKey?: string[]; pathParams?: Record<string, string>; }) => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (data?: T) => {
                // @ts-ignore
                const HTTPFunc = API[endpoint.METHOD.toLowerCase()];
                const URL = injectPathParams(endpoint.URL, pathParams);

                let response: AxiosResponse<any> | null = null;

                if (["POST", "PUT", "PATCH"].includes(endpoint.METHOD))
                    response = await HTTPFunc(URL, data, { withCredentials: sendCookies });

                if (endpoint.METHOD === "DELETE")
                    response = await HTTPFunc(URL, { withCredentials: sendCookies, data });

                if (endpoint.METHOD === "OPTIONS")
                    response = await HTTPFunc(URL, { withCredentials: sendCookies });

                return response?.data || null;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey });
            },
            onError: (err) => {
                if (axios.isAxiosError(err)) {
                    const error = err as AxiosError<{ message: unknown }>;
                    console.error(`${actionName} failed:`, error?.response?.data?.message);
                } else if (err instanceof Error) {
                    console.error(`${actionName} failed:`, err?.message);
                } else {
                    console.error("Unknown error occurred", err);
                }
            },
        });
    };
};