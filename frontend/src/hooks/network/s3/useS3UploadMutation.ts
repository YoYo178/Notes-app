import { useMutation } from "@tanstack/react-query";

import { API } from "../../../api/backendAPI";

export const useUploadToS3Mutation = () =>
    useMutation({
        mutationFn: async ({ url, file }: { url: string, file: File }) => {
            const { data } = await API.put(url, file, {
                headers: { 'Content-Type': file.type },
            });

            return data ?? null;
        }
    });