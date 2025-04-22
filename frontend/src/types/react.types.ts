import { UseMutationResult } from "@tanstack/react-query";

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type TMutation<T> = UseMutationResult<any, Error, { payload?: T | undefined; queryParams?: Record<string, string>; pathParams?: Record<string, string>; }, unknown>
export type TOptimisticMutation<T> = UseMutationResult<any, Error, { payload?: T | undefined; queryParams?: Record<string, string>; pathParams?: Record<string, string>; }, { previousData: unknown }>