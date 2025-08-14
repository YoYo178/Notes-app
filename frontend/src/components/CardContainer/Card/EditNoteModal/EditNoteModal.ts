import { RefObject, BaseSyntheticEvent } from "react";
import { UseMutationResult } from "@tanstack/react-query";

import { INote } from "../../../../types/note.types";
import { GetFileUploadURLParameters } from "../../../../types/file.types";
import { ReactSetState, TMutation, TOptimisticMutation } from "../../../../types/react.types";
import { deleteFileBlobURL } from "../../../../utils/note.utils";

async function saveNoteOnClick(
    updateNoteMutation: TOptimisticMutation<Partial<INote>>,
    oldNote: INote,
    newNote: Partial<INote>,
    images: { key: string, url: string }[],
    addedImages: File[],
    setAddedImages: ReactSetState<File[]>,
    deleteFileMutation: TMutation<unknown>,
    getUploadUrlMutation: TMutation<GetFileUploadURLParameters>,
    uploadToS3Mutation: UseMutationResult<any, Error, { url: string; file: File; }, unknown>,
    setIsUploading: ReactSetState<boolean>
) {
    const { title, description } = newNote;

    if (!title || !description) {
        console.error("Title or description fields cannot be empty!")
        return;
    }

    const mutatedNote: Partial<INote> = {};

    if (title !== oldNote.title)
        mutatedNote.title = title;

    if (description !== oldNote.description)
        mutatedNote.description = description;

    const removedImages = oldNote.images?.filter(imageKey => !newNote.images?.includes(imageKey)) || []

    if (removedImages.length) {
        setIsUploading(true);
        const imageDeletionPromises = removedImages.map(async removedImage => {
            await deleteFileMutation.mutateAsync({ pathParams: { fileKey: removedImage } });
            deleteFileBlobURL(removedImage);
        });

        await Promise.all(imageDeletionPromises);
        mutatedNote.images = images.map(el => el.key)
    }

    if (addedImages.length) {
        setIsUploading(true);
        const imageUploadPromises = addedImages.map(async (image) => {
            // Get pre-signed URL
            const { uploadUrl, key } = await getUploadUrlMutation.mutateAsync({
                payload: {
                    fileName: image.name,
                    fileType: 'image',
                    contentType: image.type,
                    fileSize: image.size,
                }
            });

            // Upload to S3
            await uploadToS3Mutation.mutateAsync({
                url: uploadUrl,
                file: image,
            });

            return key;
        });

        const imageKeys = await Promise.all(imageUploadPromises);
        mutatedNote.images = imageKeys.concat(oldNote.images) || []
    }

    const hasChanged = oldNote.title !== title || oldNote.description !== description || removedImages.length || addedImages.length;

    if (hasChanged) {
        setIsUploading(true);
        await updateNoteMutation.mutateAsync({
            pathParams: { noteId: oldNote._id },
            payload: mutatedNote
        });
        setAddedImages([])
    }
}

function uploadImageOnClick(fileInputRef: RefObject<HTMLInputElement | null>, currentImageCount: number, addedImages: File[], setAddedImages: ReactSetState<File[]>) {
    if (!fileInputRef.current)
        return;

    const inputButton = fileInputRef.current;

    inputButton.click();
    inputButton.onchange = () => {
        if (!inputButton.files || inputButton.files.length === 0) return;

        let remainingSlots = 5 - currentImageCount;
        if (remainingSlots <= 0) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newImages: File[] = [];

        for (const file of Array.from(inputButton.files)) {
            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} exceeds 2MB limit`);
                continue;
            }

            if (remainingSlots <= 0)
                break;

            remainingSlots--;
            newImages.push(file);
        };

        setAddedImages([...addedImages, ...newImages]);
    }

    inputButton.value = '';
}

function deleteImageOnClick(e: React.MouseEvent<HTMLButtonElement>, images: { key: string, url: string }[], setImages: ReactSetState<{ key: string, url: string }[]>) {
    const event = e as BaseSyntheticEvent;

    const ID = parseInt(event.target.closest(".enm-image-delete-button").id.split("-button-")[1]);

    const image = images[ID - 1];
    if (image)
        deleteFileBlobURL(image.url);

    const newArr = images.filter((_, i) => i != (ID - 1));
    setImages(newArr);
}

export const ButtonHandler = {
    saveNoteOnClick,
    uploadImageOnClick,
    deleteImageOnClick
}