import { UseMutationResult } from "@tanstack/react-query"
import { BaseNote } from "../../../../hooks/network/note/useCreateNoteMutation";
import { BaseSyntheticEvent, RefObject } from "react";

function addNoteOnClick(
    createNoteMutation: UseMutationResult<any, Error, BaseNote | undefined, unknown>,
    fields: BaseNote
) {
    const { title, description, isText, isFavorite, images, duration } = fields;

    if (!title || !description) {
        console.error("Title or description fields cannot be empty!")
        return;
    }

    createNoteMutation.mutate({
        title,
        description,
        isText,
        duration,
        isFavorite,
        images
    })
}

function uploadImageOnClick(fileInputRef: RefObject<HTMLInputElement | null>, images: File[], setImages: React.Dispatch<React.SetStateAction<File[]>>) {
    if (!fileInputRef.current)
        return;

    const inputButton = fileInputRef.current;

    inputButton.click();
    inputButton.onchange = () => {
        if (inputButton.files)
            setImages(Array.from(inputButton.files).concat(images));
    }
}

function deleteImageOnClick(e: React.MouseEvent<HTMLButtonElement>, images: File[], setImages: React.Dispatch<React.SetStateAction<File[]>>) {
    const event = e as BaseSyntheticEvent;

    const ID = parseInt(event.target.closest(".cnm-image-delete-button").id.split("-button-")[1]);

    const newArr = images.filter((_, i) => i != (ID - 1));
    setImages(newArr);
}

export const ButtonHandler = {
    addNoteOnClick,
    uploadImageOnClick,
    deleteImageOnClick
}