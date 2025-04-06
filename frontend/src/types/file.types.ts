export interface GetFileUploadURLParameters {
    fileName: string;
    fileType: 'image' | 'audio';
    contentType: string;
    fileSize: number;
}