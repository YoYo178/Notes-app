import { API } from "../api/backendAPI";
import APIEndpoints from "../config/APIEndpoints";
import { injectQueryParams } from "./api.utils";

const filesCache = new Map();

export async function getFileBlobURL(key?: string) {
    if (!key)
        return null;

    let fileBlobURL = filesCache.get(key);

    if (!fileBlobURL) {
        const { data }: { data: { url: string, expiresIn: number } } = await API.get(
            injectQueryParams(APIEndpoints.GET_FILE_URL.URL, { fileKey: key }),
            { withCredentials: true }
        );

        const res = await fetch(data.url);
        const blob = await res.blob();

        fileBlobURL = URL.createObjectURL(blob);
        filesCache.set(key, fileBlobURL);
    }

    return fileBlobURL;
}

export function deleteFileBlobURL(key: string) {
    URL.revokeObjectURL(filesCache.get(key))
    filesCache.delete(key);
}