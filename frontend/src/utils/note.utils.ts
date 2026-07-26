import { BACKEND_URL } from '../config/backendConfig';

const isProduction = import.meta.env.PROD;
const ASSETS_PATH = isProduction ? 'notes-app/assets' : 'assets';

export function getFileURL(userId: string, fileType: 'audio' | 'image', fileName: string) {
  const url = new URL(
    `${ASSETS_PATH}/${fileType === 'image' ? 'images' : 'audio'}/${userId}/${fileName}`,
    BACKEND_URL,
  );
  return url.toString();
}
