import { FC, useRef, useState } from 'react'

import { AiOutlineFileText } from "react-icons/ai";
import { FaRegCopy, FaRegStar, FaStar } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoPlayOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { TiEdit } from 'react-icons/ti';

import { useUpdateNoteMutation } from '../../../hooks/network/note/useUpdateNoteMutation';
import { useDeleteNoteMutation } from '../../../hooks/network/note/useDeleteNoteMutation';
import { Note } from '../../../types/note.types.ts';

import { EditNoteModal } from './EditNoteModal/EditNoteModal.tsx'
import { ButtonHandler } from './Card';

import "./Card.css"

type CardProps = Note;

export const Card: FC<CardProps> = ({ date, duration, isText, title, description, isFavorite, id, images }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);

    const updateNoteMutation = useUpdateNoteMutation();
    const deleteNoteMutation = useDeleteNoteMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="card">
            <EditNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} originalTitle={title} originalDescription={description} noteID={id} />
            <div className="card-top-container">
                <div className="card-date">{date}</div>
                {!isText ? (
                    <div className="card-type">
                        <IoPlayOutline className="card-type-logo" />
                        <div className="card-type-text">{duration}</div>
                    </div>
                ) : (
                    <div className="card-type">
                        <AiOutlineFileText className="card-type-logo" />
                        <div className="card-type-text">Text</div>
                    </div>
                )}
            </div>
            <div className="card-title">{title}</div>
            <div className="card-description">{description}</div>
            {images?.length && <div className="card-image-attached">
                <CiImageOn className="card-image-attached-logo" />
                <span className='card-image-attached-text'>{images.length > 1 ? `${images.length} Images` : `${images.length} Image`}</span>
            </div>}

            <div className="card-buttons-container">
                <button className='card-favorite-button' onClick={() => ButtonHandler.favoriteOnClick(updateNoteMutation, id, isFavorite)}>
                    {isFavorite ? (
                        <FaStar />
                    ) : (
                        <FaRegStar />
                    )}
                </button>

                <button className='card-copy-button' onClick={() => ButtonHandler.copyOnClick(title, description, setIsCopied, timeoutRef)}>
                    {isCopied && (<div className="card-copied-tooltip">Copied to clipboard!</div>)}
                    <FaRegCopy />
                </button>

                <button className='card-delete-button' onClick={() => ButtonHandler.deleteOnClick(deleteNoteMutation, id)}>
                    <RiDeleteBin6Line />
                </button>

                <button className='card-edit-button' onClick={() => setIsModalOpen(true)}>
                    <TiEdit />
                </button>
            </div>
        </div >
    )
}
