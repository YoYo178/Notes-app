import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';

import { IoMdClose } from 'react-icons/io';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { useTranscriptionContext } from '../../../../contexts/TranscriptionContext';
import { useRecordingContext } from '../../../../contexts/RecordingContext';

import { useCreateNoteMutation } from '../../../../hooks/network/note/useCreateNoteMutation';
import { useGetFileUploadURLMutation } from '../../../../hooks/network/upload/useGetFileUploadURLMutation';
import { useUploadToS3Mutation } from '../../../../hooks/network/s3/useS3UploadMutation';

import { NoteType } from '../../../../types/note.types';
import { ImageFile } from '../../../../types/file.types';

import { ButtonHandler } from './CreateNoteModal';

import "./CreateNoteModal.css"

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
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const createNoteMutation = useCreateNoteMutation({ queryKey: ['notes'] });
    const getUploadUrlMutation = useGetFileUploadURLMutation({});
    const uploadToS3Mutation = useUploadToS3Mutation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function cleanupImages() {
        images.forEach(image => {
            if (image.localURL) {
                URL.revokeObjectURL(image.localURL);
            }
        });
    }

    useEffect(() => {
        if (!isOpen)
            return

        if (!createNoteMutation.error) {
            onClose();
            setTitle('');
            setDescription('');
            setImages([]);
            setIsUploading(false);
        }
    }, [createNoteMutation.isSuccess])

    useEffect(() => {
        if (transcript?.length)
            setDescription(transcript);
    }, [transcript]);

    // Cleanup local URLs when component unmounts
    useEffect(() => cleanupImages, [images]);

    const handleClose = () => {
        if (!isOpen)
            return

        cleanupImages();

        onClose();
        setTitle('');
        setDescription('');
        setImages([]);
        setIsUploading(false);
    };

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
                        {images.map((image, i) => (
                            <div key={`cnm-image-container-${i + 1}`} className="cnm-image-container">
                                <img id={`cnm-image-${i + 1}`} className="cnm-image" src={image.localURL} />
                                <button
                                    id={`cnm-image-delete-button-${i + 1}`}
                                    className="cnm-image-delete-button"
                                    onClick={(e) => ButtonHandler.deleteImageOnClick(e, images, setImages)}
                                    disabled={isUploading}
                                >
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        ))}
                        {images.length < 5 && (
                            <div className="cnm-upload-image-button" onClick={() => ButtonHandler.uploadImageOnClick(fileInputRef, images, setImages)}>
                                <input
                                    ref={fileInputRef}
                                    name="Upload Image"
                                    type="file"
                                    accept='image/*'
                                    hidden
                                    multiple
                                />
                                <FaPlus />
                            </div>
                        )}
                    </div>
                </div>
                <div className="cnm-footer">
                    <button className="cnm-check-button" disabled={isUploading} onClick={async () => {
                        await ButtonHandler.addNoteOnClick(
                            createNoteMutation,
                            {
                                title,
                                description,
                                isText: noteType === 'text',
                                duration: noteType === 'audio' ? `00:${String(recordingTime).padStart(2, '0')}` : null,
                            },
                            setIsUploading,
                            images,
                            getUploadUrlMutation,
                            uploadToS3Mutation,
                            noteType,
                            recordedAudio,
                            recordingTime
                        )
                    }}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}