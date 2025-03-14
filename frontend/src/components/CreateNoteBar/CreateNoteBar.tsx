import { FC, RefObject, useEffect, useState } from 'react'

import { RiImageAddLine } from 'react-icons/ri';
import { FiFilePlus } from 'react-icons/fi';
import { BsRecord2 } from 'react-icons/bs';

import CreateNoteModal from './CreateNoteModal/CreateNoteModal.tsx';

import './CreateNoteBar.css'

interface CreateNoteBarProps {
    cardContainer: RefObject<HTMLDivElement | null>;
}

export const CreateNoteBar: FC<CreateNoteBarProps> = ({ cardContainer }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = (event: Event) => {
            // @ts-ignore
            const scrollTop = event.target?.scrollTop;
            if (scrollTop > 0) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        if (cardContainer.current) {
            cardContainer.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (cardContainer.current) {
                cardContainer.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <>
            <CreateNoteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <div className={`create-note-bar ${isVisible && !modalOpen ? 'visible' : 'hidden'}`}>
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
