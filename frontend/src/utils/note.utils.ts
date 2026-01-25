import { BACKEND_URL } from "../config/backendConfig";

export function getFileURL(userId: string, fileType: 'audio' | 'image', fileName: string) {
    const url = new URL(`assets/${fileType === 'image' ? 'images' : 'audio'}/${userId}/${fileName}`, BACKEND_URL)
    return url.toString();
}