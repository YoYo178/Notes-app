import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

import { API } from "../../api/backendAPI";
import { Endpoint } from "../../types/api.types";
import { injectPathParams, injectQueryParams } from "../../util/api.utils";

export const useMutationBase = <T>(
    endpoint: Endpoint,
    actionName: string,
    sendCookies: boolean = false,
    options?: {
        optimisticUpdate?: (variables: { payload: T }, oldData: any) => any;
    }
) => {
    return ({ queryKey = [] }: { queryKey?: string[]; }) => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async ({ payload, queryParams, pathParams }: { payload?: T, queryParams?: Record<string, string>, pathParams?: Record<string, string> }) => {
                // @ts-ignore
                const HTTPFunc = API[endpoint.METHOD.toLowerCase()];
                const URL =
                    pathParams
                        ? injectPathParams(endpoint.URL, pathParams)       // if pathParams
                        : queryParams
                            ? injectQueryParams(endpoint.URL, queryParams) // else if queryParams
                            : endpoint.URL;                                // else

                let response: AxiosResponse<any> | null = null;

                if (["POST", "PUT", "PATCH"].includes(endpoint.METHOD))
                    response = await HTTPFunc(URL, payload, { withCredentials: sendCookies });

                if (endpoint.METHOD === "DELETE")
                    response = await HTTPFunc(URL, { withCredentials: sendCookies, data: payload });

                if (endpoint.METHOD === "OPTIONS")
                    response = await HTTPFunc(URL, { withCredentials: sendCookies });

                return response?.data || null;
            },

            onMutate: async (variables) => {
                await queryClient.cancelQueries({ queryKey });

                const previousData = queryClient.getQueryData(queryKey);

                if (queryKey.length && options?.optimisticUpdate) {
                    const updated = options.optimisticUpdate(variables as { payload: T }, previousData);
                    queryClient.setQueryData(queryKey, updated);
                }

                return { previousData };
            },

            onError: (err, _variables, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData(queryKey, context.previousData);
                }

                if (axios.isAxiosError(err)) {
                    const error = err as AxiosError<{ message: unknown }>;
                    console.error(`${actionName} failed:`, error?.response?.data?.message);
                } else if (err instanceof Error) {
                    console.error(`${actionName} failed:`, err?.message);
                } else {
                    console.error("Unknown error occurred", err);
                }
            },

            onSettled: (_data, _error, _variables, _context) => {
                if (!options?.optimisticUpdate) {
                    queryClient.invalidateQueries({ queryKey });
                }
            },
        });
    };
};