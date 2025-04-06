import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom';

import { FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

import { useUpdateNoteMutation } from '../../../../hooks/network/note/useUpdateNoteMutation';

import { ButtonHandler } from './EditNoteModal';

import './EditNoteModal.css'

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
    originalTitle: string;
    originalDescription: string;
    noteID: string;
}

export const EditNoteModal: FC<CreateNoteModelProps> = ({ isOpen, onClose, originalTitle, originalDescription, noteID }) => {
    const [title, setTitle] = useState(originalTitle);
    const [description, setDescription] = useState(originalDescription);

    const updateNoteMutation = useUpdateNoteMutation({ queryKey: ['notes'] });

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
                    <div className="enm-text-field-container">
                        <input type="text" className="enm-field-title" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="enm-text-field-container enm-description-field-container">
                        <textarea className="enm-field-description" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <div className="enm-footer">
                    <button className="enm-check-button" onClick={() => ButtonHandler.saveNoteOnClick(updateNoteMutation, { title, description, isText: true, duration: null, id: noteID })}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}