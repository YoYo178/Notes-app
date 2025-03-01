import { FC } from 'react'

import { AiOutlineFileText } from "react-icons/ai";
import { IoPlayOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { FaRegCopy, FaRegStar } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

import "./Card.css"

interface CardProps {
    duration: string | null;
}

export const Card: FC<CardProps> = ({ duration }) => {
    return (
        <div className="card">
            <div className="card-top-container">
                <div className="card-date">Jan 30, 2025 &#183; 5:26 PM</div>
                {duration ? (
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
            <div className="card-title">Engineering Assignment Audio</div>
            <div className="card-description">I'm recording an audio to transcribe into text for the assignment of engineering in terms of actors.</div>
            <div className="card-image-attached">
                <CiImageOn className="card-image-attached-logo" />
                <span className='card-image-attached-text'>1 Image</span>
            </div>

            <div className="card-buttons-container">
                <div className='card-favorite-button'>
                    <FaRegStar />
                </div>

                <div className='card-copy-button'>
                    <FaRegCopy />
                </div>

                <div className='card-delete-button'>
                    <RiDeleteBin6Line />
                </div>

                <div className='card-edit-button'>
                    <TiEdit />
                </div>
            </div>
        </div >
    )
}
