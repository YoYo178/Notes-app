import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

import { API } from "../../api/backendAPI";
import { Endpoint } from "../../types/api.types";
import { injectPathParams, injectQueryParams } from "../../utils/api.utils";

type MutationOptions<T> = {
    payload?: T,
    queryParams?: Record<string, string>,
    pathParams?: Record<string, string>
}

export const useMutationBase = <T>(
    endpoint: Endpoint,
    actionName: string,
    sendAndAcceptCookies: boolean = false,
    optimistic?: {
        onMutate?: (variables: MutationOptions<T>, data: any, queryClient: QueryClient) => any;
        onError?: (error: Error | null, variables: MutationOptions<T>, context: { previousData: any } | undefined, queryClient: QueryClient) => any;
        onSettled?: (data: any, error: Error | null, variables: MutationOptions<T>, context: { previousData: any } | undefined, queryClient: QueryClient) => any;
    }
) => {
    return ({ queryKey = [] }: { queryKey?: string[]; }) => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async ({ payload, queryParams, pathParams }: MutationOptions<T>) => {
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
                    response = await HTTPFunc(URL, payload, { withCredentials: sendAndAcceptCookies });

                if (endpoint.METHOD === "DELETE")
                    response = await HTTPFunc(URL, { withCredentials: sendAndAcceptCookies, data: payload });

                if (endpoint.METHOD === "OPTIONS")
                    response = await HTTPFunc(URL, { withCredentials: sendAndAcceptCookies });

                return response?.data || null;
            },

            onMutate: async (variables) => {
                await queryClient.cancelQueries({ queryKey });

                const previousData = queryClient.getQueryData(queryKey);
                
                if (queryKey.length && !!optimistic?.onMutate) {
                    const updated = optimistic.onMutate(variables, previousData, queryClient);
                    queryClient.setQueryData(queryKey, updated);
                }

                return { previousData };
            },

            onError: (err, variables, context) => {
                if (context?.previousData) {
                    queryClient.setQueryData(queryKey, context.previousData);
                }

                if (!!optimistic?.onError)
                    optimistic.onError(err, variables, context, queryClient);

                if (axios.isAxiosError(err)) {
                    const error = err as AxiosError<{ message: unknown }>;
                    console.error(`${actionName} failed:`, error?.response?.data?.message);
                } else if (err instanceof Error) {
                    console.error(`${actionName} failed:`, err?.message);
                } else {
                    console.error("Unknown error occurred", err);
                }
            },

            onSettled: (data, error, variables, context) => {
                if (!!optimistic?.onSettled) {
                    const finalData = optimistic.onSettled(data, error, variables, context, queryClient);
                    queryClient.setQueryData(queryKey, finalData);
                }
            },
        });
    };
};