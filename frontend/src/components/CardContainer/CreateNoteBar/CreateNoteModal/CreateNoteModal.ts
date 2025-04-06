import { UseMutationResult } from "@tanstack/react-query"
import { BaseNote } from "../../../../types/note.types";
import { BaseSyntheticEvent, RefObject } from "react";
import { ReactSetState } from "../../../../types/react.types";
import { GetFileUploadURLParameters, ImageFile } from "../../../../types/file.types";

async function addNoteOnClick(
    createNoteMutation: UseMutationResult<any, Error, BaseNote | undefined, unknown>,
    fields: BaseNote,
    setIsUploading: ReactSetState<boolean>,
    images: ImageFile[],
    getUploadUrlMutation: UseMutationResult<any, Error, GetFileUploadURLParameters | undefined, unknown>,
    uploadToS3Mutation: UseMutationResult<any, Error, { url: string, file: File }, unknown>,
    noteType: 'text' | 'audio',
    recordedAudio: string | undefined,
    recordingTime: number | undefined
) {
    const { title, description, isFavorite } = fields;

    if (!title || !description) {
        console.error("Title or description fields cannot be empty!")
        return;
    }

    setIsUploading(true);
    try {
        // Upload images first
        const imageUploadPromises = images.map(async (image) => {
            // Get pre-signed URL
            const { uploadUrl, key } = await getUploadUrlMutation.mutateAsync({
                fileName: image.name,
                fileType: 'image',
                contentType: image.type,
                fileSize: image.size,
            });

            // Upload to S3
            await uploadToS3Mutation.mutateAsync({
                url: uploadUrl,
                file: image,
            });

            return key;
        });

        const imageKeys = await Promise.all(imageUploadPromises);

        // Upload audio if present
        let audioKey: string | undefined;
        if (noteType === 'audio' && recordedAudio) {
            // Convert base64 to blob
            const response = await fetch(recordedAudio);
            const blob = await response.blob();
            const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });

            // Get pre-signed URL
            const { uploadUrl, key } = await getUploadUrlMutation.mutateAsync({
                fileName: file.name,
                fileType: 'audio',
                contentType: file.type,
                fileSize: file.size,
            });

            // Upload to S3
            await uploadToS3Mutation.mutateAsync({
                url: uploadUrl,
                file,
            });

            audioKey = key;
        }

        // Create the note with uploaded file keys
        createNoteMutation.mutate({
            title,
            description,
            isText: noteType === 'text',
            duration: `00:${String(recordingTime).padStart(2, '0')}`,
            audio: audioKey,
            images: imageKeys,
            isFavorite
        });

    } catch (error: any) {
        alert(error?.message || 'Failed to upload files');
        setIsUploading(false);
    }
}

function uploadImageOnClick(fileInputRef: RefObject<HTMLInputElement | null>, images: ImageFile[], setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>) {
    if (!fileInputRef.current)
        return;

    const inputButton = fileInputRef.current;

    inputButton.click();
    inputButton.onchange = () => {
        if (!inputButton.files || inputButton.files.length === 0) return;

        const remainingSlots = 5 - images.length;
        if (remainingSlots <= 0) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newImages = Array.from(inputButton.files).map(file => {
            // Eliminate duplicates
            const isDuplicate = images.some(image =>
                image.name === file.name &&
                image.size === file.size &&
                image.lastModified === file.lastModified
            );

            if (isDuplicate) return null;

            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} exceeds 2MB limit`);
                return null;
            }

            const retObj: ImageFile = Object.assign(file, { localUrl: URL.createObjectURL(file) });
            Object.setPrototypeOf(retObj, File.prototype);

            return retObj;
        }).filter(file => !!file);

        setImages(images.concat(newImages));
    }

    inputButton.value = '';
}

function deleteImageOnClick(e: React.MouseEvent<HTMLButtonElement>, images: ImageFile[], setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>) {
    const event = e as BaseSyntheticEvent;

    const ID = parseInt(event.target.closest(".cnm-image-delete-button").id.split("-button-")[1]);

    const image = images[ID - 1];
    if (image.localUrl)
        URL.revokeObjectURL(image.localUrl);

    const newArr = images.filter((_, i) => i != (ID - 1));
    setImages(newArr);
}

export const ButtonHandler = {
    addNoteOnClick,
    uploadImageOnClick,
    deleteImageOnClick
}