import { FC } from 'react'

import { IoIosCloseCircleOutline } from 'react-icons/io';

import "./CreateNoteModal.css"

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateNoteModal: FC<CreateNoteModelProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className='create-note-modal-backdrop' onClick={onClose}>
            <div className='create-note-modal' onClick={(e) => e.stopPropagation()}>
                <div className="create-note-modal-header">
                    <h2 className='create-note-modal-title'>Add new note</h2>
                    <button className='create-note-modal-close-button' onClick={onClose}>
                        <IoIosCloseCircleOutline className='create-note-modal-close-button-icon' />
                    </button>
                </div>
                <p>This is a modal.</p>
            </div>
        </div>

    )
}

export default CreateNoteModal