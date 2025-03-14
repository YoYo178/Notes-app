import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom';

import { IoMdClose } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';

import { useCreateNoteMutation } from '../../../hooks/network/note/useCreateNoteMutation';

import { ButtonHandler } from './CreateNoteModal';

import "./CreateNoteModal.css"

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateNoteModal: FC<CreateNoteModelProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const createNoteMutation = useCreateNoteMutation();

    useEffect(() => {
        if (!createNoteMutation.error) {
            onClose();
            setTitle('');
            setDescription('');
        }
    }, [createNoteMutation.isSuccess])

    if (!isOpen) return null;

    return createPortal(
        <div className='cnm-backdrop' onMouseDown={onClose}>
            <div className='cnm' onMouseDown={(e) => e.stopPropagation()}>
                <div className="cnm-header">
                    <h2 className='cnm-title'>Add new note</h2>
                    <button className='cnm-close-button' onClick={onClose}>
                        <IoMdClose className='cnm-close-button-icon' />
                    </button>
                </div>
                <div className="cnm-fields">
                    <div className="cnm-text-field-container">
                        <input type="text" className="cnm-field-title" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="cnm-text-field-container cnm-description-field-container">
                        <textarea className="cnm-field-description" placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <div className="cnm-footer">
                    <button className="cnm-check-button" onClick={() => ButtonHandler.addNoteOnClick(createNoteMutation, { title, description, isText: true, duration: null })}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}

export default CreateNoteModal