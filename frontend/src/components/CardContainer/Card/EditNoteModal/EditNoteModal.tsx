import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

import { useUpdateNoteMutation } from '../../../../hooks/network/note/useUpdateNoteMutation';
import { useDeleteFileMutation } from '../../../../hooks/network/upload/useDeleteFileMutation';
import { useUploadToS3Mutation } from '../../../../hooks/network/s3/useS3UploadMutation';
import { useGetFileUploadURLMutation } from '../../../../hooks/network/upload/useGetFileUploadURLMutation';

import { Note, NoteFile } from '../../../../types/note.types';
import { ImageFile } from '../../../../types/file.types';

import { ButtonHandler } from './EditNoteModal';

import './EditNoteModal.css'

interface EditNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note
}

export const EditNoteModal: FC<EditNoteModalProps> = ({ isOpen, onClose, note }) => {
    const [title, setTitle] = useState(note.title);
    const [description, setDescription] = useState(note.description);
    const [images, setImages] = useState<(NoteFile | ImageFile)[]>(note.images || []);

    const [isUploading, setIsUploading] = useState(false);

    const noteImagesRef = useRef<NoteFile[]>(note.images || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateNoteMutation = useUpdateNoteMutation({ queryKey: ['notes'] });

    const getUploadUrlMutation = useGetFileUploadURLMutation({});
    const uploadToS3Mutation = useUploadToS3Mutation();
    const deleteFileMutation = useDeleteFileMutation({});

    useEffect(() => {
        if (isOpen && !updateNoteMutation.error) {
            onClose();
        }
    }, [updateNoteMutation.isSuccess])

    if (!isOpen) return null;

    return createPortal(
        <div className='enm-backdrop' onMouseDown={onClose}>
            <div className='enm' onMouseDown={(e) => e.stopPropagation()}>
                <div className="enm-header">
                    <h2 className='enm-title'>Edit Note</h2>
                    <button className='enm-close-button' onClick={onClose}>
                        <IoMdClose className='enm-close-button-icon' />
                    </button>
                </div>
                <div className="enm-fields">
                    {!note.isText && (<audio controls src={note.audio?.localURL} className="enm-audio-player" />)}
                    <div className="enm-text-field-container">
                        <input type="text" className="enm-field-title" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="enm-text-field-container enm-description-field-container">
                        <textarea className="enm-field-description" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="enm-images-container">
                        {images.map((image, i) => {
                            return (
                                <div key={`enm-image-container-${i + 1}`} className="enm-image-container">
                                    <img id={`enm-image-${i + 1}`} className="enm-image" src={image.localURL} />
                                    <button
                                        id={`enm-image-delete-button-${i + 1}`}
                                        className="enm-image-delete-button"
                                        onClick={(e) => ButtonHandler.deleteImageOnClick(e, images, setImages)}
                                        disabled={isUploading}
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            )
                        })}
                        {(!images || images.length < 5) && (
                            <div className="enm-upload-image-button" onClick={() => ButtonHandler.uploadImageOnClick(fileInputRef, images, setImages)}>
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
                <div className="enm-footer">
                    <button className="cnm-check-button" disabled={isUploading} onClick={async () => {
                        await ButtonHandler.saveNoteOnClick(
                            updateNoteMutation,
                            note,
                            { title, description },
                            noteImagesRef,
                            images,
                            deleteFileMutation,
                            getUploadUrlMutation,
                            uploadToS3Mutation,
                            setIsUploading
                        )

                        setIsUploading(false);
                    }}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}