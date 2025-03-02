import { FC } from 'react'

import { AiOutlineFileText } from "react-icons/ai";
import { FaRegCopy, FaRegStar, FaStar } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoPlayOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { TiEdit } from 'react-icons/ti';

import { Note } from '../../../types/NoteTypes';

import "./Card.css"
import { ButtonHandler } from './Card';
import { useUpdateNote } from '../../../hooks/network/note/useUpdateNote';

type CardProps = Note;

export const Card: FC<CardProps> = ({ date, duration, isText, title, description, isFavorite, id }) => {
    const useUpdateNoteMutation = useUpdateNote();

    return (
        <div className="card">
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
            <div className="card-image-attached">
                <CiImageOn className="card-image-attached-logo" />
                <span className='card-image-attached-text'>1 Image</span>
            </div>

            <div className="card-buttons-container">
                <button className='card-favorite-button' onClick={() => ButtonHandler.favoriteOnClick(useUpdateNoteMutation, id, isFavorite)}>
                    {isFavorite ? (
                        <FaStar />
                    ) : (
                        <FaRegStar />
                    )}
                </button>

                <button className='card-copy-button'>
                    <FaRegCopy />
                </button>

                <button className='card-delete-button'>
                    <RiDeleteBin6Line />
                </button>

                <button className='card-edit-button'>
                    <TiEdit />
                </button>
            </div>
        </div >
    )
}
