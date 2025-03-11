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
        <div className='cnm-backdrop' onClick={onClose}>
            <div className='cnm' onClick={(e) => e.stopPropagation()}>
                <div className="cnm-header">
                    <h2 className='cnm-title'>Add new note</h2>
                    <button className='cnm-close-button' onClick={onClose}>
                        <IoIosCloseCircleOutline className='cnm-close-button-icon' />
                    </button>
                </div>
                <p>This is a modal.</p>
            </div>
        </div>

    )
}

export default CreateNoteModal