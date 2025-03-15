import { FC, useState } from 'react'

import { RiImageAddLine } from 'react-icons/ri';
import { FiFilePlus } from 'react-icons/fi';
import { BsRecord2 } from 'react-icons/bs';

import CreateNoteModal from './CreateNoteModal/CreateNoteModal.tsx';

import './CreateNoteBar.css'

interface CreateNoteBarProps {
    isVisible: boolean;
}

export const CreateNoteBar: FC<CreateNoteBarProps> = ({ isVisible }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <CreateNoteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <div className={`create-note-bar ${isVisible ? 'visible' : 'hidden'}`}>
                <div className="add-note-buttons-container">
                    <button className='add-note-button' onClick={() => setModalOpen(true)}>
                        <FiFilePlus className='add-note-icon' />
                    </button>
                    <button className='add-note-image-button' >
                        <RiImageAddLine className='add-note-image-icon' />
                    </button>
                </div>
                <div className="record-note-button-container">
                    <BsRecord2 />
                    Start Recording
                </div>
            </div >
        </>
    )
}
