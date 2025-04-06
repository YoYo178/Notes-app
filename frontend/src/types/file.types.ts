export interface GetFileUploadURLParameters {
    fileName: string;
    fileType: 'image' | 'audio';
    contentType: string;
    fileSize: number;
    audioDuration?: number
}

export interface ImageFile extends File {
    localUrl: string;
}