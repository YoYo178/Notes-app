import { FC } from 'react'

import { IoMdClose } from 'react-icons/io';

import "./CreateNoteModal.css"

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateNoteModal: FC<CreateNoteModelProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className='cnm-backdrop' onMouseDown={onClose}>
            <div className='cnm' onMouseDown={(e) => e.stopPropagation()}>
                <div className="cnm-header">
                    <h2 className='cnm-title'>Add new note</h2>
                    <button className='cnm-close-button' onClick={onClose}>
                        <IoMdClose className='cnm-close-button-icon' />
                    </button>
                </div>
                <p>This is a modal.</p>
            </div>
        </div>

    )
}

export default CreateNoteModal