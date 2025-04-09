import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

import { useUpdateNoteMutation } from '../../../../hooks/network/note/useUpdateNoteMutation';

import { Note } from '../../../../types/note.types';

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

    const updateNoteMutation = useUpdateNoteMutation({ queryKey: ['notes', note.id] });

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
                        {note.images?.map((image, i) => {
                            return (
                                <div key={`enm-image-container-${i + 1}`} className="enm-image-container">
                                    <img id={`enm-image-${i + 1}`} className="enm-image" src={image.localURL} />
                                    <button
                                        id={`enm-image-delete-button-${i + 1}`}
                                        className="enm-image-delete-button"
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            )
                        })}
                        {(!note.images || note.images.length < 5) && (
                            <div className="enm-upload-image-button">
                                <input
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
                    <button className="enm-check-button" onClick={() => ButtonHandler.saveNoteOnClick(updateNoteMutation, { ...note, title, description })}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}