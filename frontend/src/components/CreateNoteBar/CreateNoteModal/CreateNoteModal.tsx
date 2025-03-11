import { FC } from 'react'

import { IoMdClose } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';

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
                <div className="cnm-fields">
                    <div className="cnm-text-field-container">
                        <input type="text" className="cnm-field-title" placeholder='Title' />
                    </div>
                    <div className="cnm-text-field-container cnm-description-field-container">
                        <textarea className="cnm-field-description" placeholder='Description' />
                    </div>
                </div>
                <div className="cnm-footer">
                    <button className="cnm-check-button">
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateNoteModal