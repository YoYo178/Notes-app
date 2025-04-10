import { RefObject, BaseSyntheticEvent } from "react";
import { UseMutationResult } from "@tanstack/react-query";

import { Note, NoteFile, NotePayload } from "../../../../types/note.types";
import { GetFileUploadURLParameters, ImageFile } from "../../../../types/file.types";
import { ReactSetState, TMutation, TOptimisticMutation } from "../../../../types/react.types";

async function saveNoteOnClick(
    updateNoteMutation: TOptimisticMutation<Partial<NotePayload> & { id: string }>,
    oldNote: Note,
    newNote: Partial<Note>,
    oldImagesRef: RefObject<NoteFile[] | null>,
    images: (NoteFile | ImageFile)[],
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

    const mutatedNote: Partial<NotePayload> & { id: string } = { id: oldNote.id };

    if (title !== oldNote.title)
        mutatedNote.title = title;

    if (description !== oldNote.description)
        mutatedNote.description = description;

    const removedImages = oldImagesRef.current?.filter(image =>
        !images.some(img =>
            ('key' in img && !(img instanceof File)) && img.key === image.key
        )
    ) || [];

    const addedImages = images.filter(image => image instanceof File);

    if (removedImages.length) {
        setIsUploading(true);
        const imageDeletionPromises = removedImages.map(async removedImage => {
            await deleteFileMutation.mutateAsync({ pathParams: { fileKey: removedImage.key } });
            URL.revokeObjectURL(removedImage.localURL)
        });

        await Promise.all(imageDeletionPromises);

        const imagesArr = oldNote.images?.filter(image => !removedImages.some(img => img.key === image.key));
        mutatedNote.images = imagesArr?.map(image => image.key);
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
        mutatedNote.images = imageKeys.concat(oldNote.images?.map(image => image.key)) || []
    }

    const hasChanged = oldNote.title !== title || oldNote.description !== description || removedImages.length || addedImages.length;

    if (hasChanged) {
        setIsUploading(true);
        updateNoteMutation.mutate({
            payload: mutatedNote
        })
    }
}

function uploadImageOnClick(fileInputRef: RefObject<HTMLInputElement | null>, images: (NoteFile | ImageFile)[], setImages: ReactSetState<(NoteFile | ImageFile)[]>) {
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
            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} exceeds 2MB limit`);
                return null;
            }

            const retObj: ImageFile = Object.assign(file, { localURL: URL.createObjectURL(file) });
            Object.setPrototypeOf(retObj, File.prototype);

            return retObj;
        }).filter(file => !!file);

        setImages(images.concat(newImages));
    }

    inputButton.value = '';
}

function deleteImageOnClick(e: React.MouseEvent<HTMLButtonElement>, images: (NoteFile | ImageFile)[], setImages: ReactSetState<(NoteFile | ImageFile)[]>) {
    const event = e as BaseSyntheticEvent;

    const ID = parseInt(event.target.closest(".enm-image-delete-button").id.split("-button-")[1]);

    const image = images[ID - 1];
    if (image.localURL)
        URL.revokeObjectURL(image.localURL);

    const newArr = images.filter((_, i) => i != (ID - 1));
    setImages(newArr);
}

export const ButtonHandler = {
    saveNoteOnClick,
    uploadImageOnClick,
    deleteImageOnClick
}