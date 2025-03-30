import { FC, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';

import { IoMdClose } from 'react-icons/io';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

import TranscriptionContext from '../../../../contexts/TranscriptionProvider';
import RecordingContext from '../../../../contexts/RecordingProvider';
import { useCreateNoteMutation } from '../../../../hooks/network/note/useCreateNoteMutation';

import { NoteType } from '../../../../types/note.types';

import { ButtonHandler } from './CreateNoteModal';

import "./CreateNoteModal.css"

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
    noteType: NoteType
}

export const CreateNoteModal: FC<CreateNoteModelProps> = ({ isOpen, onClose, noteType }) => {
    const { recordingTime, recordedAudio } = useContext(RecordingContext);
    const { transcript } = useContext(TranscriptionContext);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(transcript || '');
    const [images, setImages] = useState<File[]>([])

    const createNoteMutation = useCreateNoteMutation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!isOpen)
            return

        if (!createNoteMutation.error) {
            onClose();
            setTitle('');
            setDescription('');
        }
    }, [createNoteMutation.isSuccess])

    useEffect(() => {
        if (transcript?.length)
            setDescription(transcript);
    }, [transcript]);

    const handleClose = () => {
        if (!isOpen)
            return

        onClose();
        setTitle('');
        setDescription('');
        setImages([]);
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
                        {images.map((image, i) => {
                            const imageURL = URL.createObjectURL(image)
                            return (
                                <div key={`cnm-image-container-${i + 1}`} className="cnm-image-container">
                                    <img id={`cnm-image-${i + 1}`} className="cnm-image" src={imageURL || undefined}></img>
                                    <button id={`cnm-image-delete-button-${i + 1}`} className="cnm-image-delete-button" onClick={(e) => ButtonHandler.deleteImageOnClick(e, images, setImages)}>
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            )
                        }
                        )}
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
                    </div>
                </div>
                <div className="cnm-footer">
                    <button className="cnm-check-button" onClick={() => {
                        ButtonHandler.addNoteOnClick(
                            createNoteMutation,
                            {
                                title,
                                description,
                                isText: noteType === 'text',
                                duration: `00:${String(recordingTime).padStart(2, '0')}`,
                            }
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