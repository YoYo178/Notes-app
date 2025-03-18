import { FC, useContext } from 'react'
import { createPortal } from 'react-dom';

import { IoMdClose } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';

import AuthContext from '../../contexts/AuthProvider';

import "./ProfileModal.css"

interface CreateNoteModelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal: FC<CreateNoteModelProps> = ({ isOpen, onClose }) => {
    const { auth, setAuth } = useContext(AuthContext);

    if (!isOpen) return null;

    return createPortal(
        <div className='pm-backdrop' onMouseDown={onClose}>
            <div className='pm' onMouseDown={(e) => e.stopPropagation()}>
                <div className="pm-header">
                    <h2 className='pm-title'>Profile details</h2>
                    <button className='pm-close-button' onClick={onClose}>
                        <IoMdClose className='pm-close-button-icon' />
                    </button>
                </div>
                <div className="pm-fields">

                </div>
                <div className="pm-footer">
                    <div className="pm-field-id-container">
                        <label htmlFor="id" className="pm-field-id-label">ID:</label>
                        <p className="pm-field-id">{auth?.id}</p>
                    </div>
                    <button className="pm-check-button" onClick={() => { }}>
                        <FaCheck />
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}