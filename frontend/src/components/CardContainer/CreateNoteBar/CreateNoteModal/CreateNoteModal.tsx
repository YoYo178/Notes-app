import { FC, useRef, useState } from 'react'
import { createPortal } from 'react-dom';

import { IoMdClose } from 'react-icons/io';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { useTranscriptionContext } from '../../../../contexts/TranscriptionContext';
import { useRecordingContext } from '../../../../contexts/RecordingContext';

import { useCreateNoteMutation } from '../../../../hooks/network/note/useCreateNoteMutation';
import { useUploadImagesMutation } from '../../../../hooks/network/files/useUploadImagesMutation';

import { NoteType } from '../../../../types/note.types';

import "./CreateNoteModal.css"
import { useUploadAudioMutation } from '../../../../hooks/network/files/useUploadAudioMutation';

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
    noteType: NoteType
}

export const CreateNoteModal: FC<CreateNoteModelProps> = ({ isOpen, onClose, noteType }) => {
    const { recordingTime, recordedAudio } = useRecordingContext();
    const { transcript } = useTranscriptionContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(transcript || '');
    const [images, setImages] = useState<File[]>([]);
    const imageURLs = images.map(image => URL.createObjectURL(image));

    const [isUploading, setIsUploading] = useState(false);

    const createNoteMutation = useCreateNoteMutation({ queryKey: ['notes'] });
    const uploadImagesMutation = useUploadImagesMutation({});
    const uploadAudioMutation = useUploadAudioMutation({});
    const inputButtonRef = useRef<HTMLInputElement | null>(null);

    const handleClose = () => {
        if (!isOpen)
            return

        onClose();
        setTitle('');
        setDescription('');
        setImages([]);
        setIsUploading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const remainingSlots = 5 - images.length;
        if (remainingSlots <= 0) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newImages: File[] = [...images];

        for (const file of Array.from(e.target.files)) {
            // Eliminate duplicates
            const isDuplicate = images.some(image =>
                image.name === file.name &&
                image.size === file.size &&
                image.lastModified === file.lastModified
            );

            if (isDuplicate)
                break;

            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} exceeds 2MB limit`);
                break;
            }

            newImages.push(file);
        }

        setImages(newImages);
        e.target.value = '';
    }

    const handleDeleteImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    }

    const handleCreateNote = async () => {
        if (!title || !description) {
            console.error("Title or description fields cannot be empty!")
            return;
        }

        setIsUploading(true);

        let uploadedImages: string[] | null = null;
        let uploadedAudio: string | null = null;

        if (images.length > 0) {
            const fd = new FormData();
            images.forEach((image) => fd.append('images[]', image));

            const response = await uploadImagesMutation.mutateAsync({ payload: fd });
            uploadedImages = response.filenames;
        }

        if (recordedAudio) {
            const fd = new FormData();

            const audioBlob = await fetch(recordedAudio).then(res => res.blob());
            fd.append('audio', audioBlob, 'recording.webm');

            const response = await uploadAudioMutation.mutateAsync({ payload: fd })
            uploadedAudio = response.filename;
        }

        // Create the note with uploaded file keys
        await createNoteMutation.mutateAsync({
            payload: {
                title,
                description,
                isText: noteType === 'text',
                duration: recordingTime,
                audio: uploadedAudio ?? undefined,
                images: uploadedImages ?? undefined,
                isFavorite: false,
            }
        });

        handleClose();
    }

    if (!isOpen) return null;

    return createPortal(
        <div className='cnm-backdrop' onMouseDown={handleClose}>
            <div className='cnm' onMouseDown={(e) => e.stopPropagation()}>
                <div className="cnm-header">
                    <h2 className='cnm-title'>Add new note</h2>
                    <button className='cnm-close-button' onClick={handleClose}>
                        <IoMdClose className='cnm-close-button-icon' />
                    </button>
                </div>
                <div className="cnm-fields">
                    {noteType === 'audio' && (<audio controls src={recordedAudio || undefined} className="cnm-audio-player" />)}
                    <div className="cnm-text-field-container">
                        <input type="text" className="cnm-field-title" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="cnm-text-field-container cnm-description-field-container">
                        <textarea className="cnm-field-description" placeholder='Description' value={description || transcript} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="cnm-images-container">
                        {imageURLs.map((url, i) => (
                            <div key={`cnm-image-container-${i + 1}`} className="cnm-image-container">
                                <img className="cnm-image" src={url} />
                                <button
                                    className="cnm-image-delete-button"
                                    onClick={() => handleDeleteImage(i)}
                                    disabled={isUploading}
                                >
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        ))}
                        {images.length < 5 && (
                            <div className="cnm-upload-image-button" onClick={() => inputButtonRef.current?.click()}>
                                <input
                                    ref={inputButtonRef}
                                    name="Upload Image"
                                    type="file"
                                    accept='image/*'
                                    hidden
                                    multiple
                                    onChange={handleInputChange}
                                />
                                <FaPlus />
                            </div>
                        )}
                    </div>
                </div>
                <div className="cnm-footer">
                    <button className="cnm-check-button" disabled={isUploading} onClick={handleCreateNote}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}