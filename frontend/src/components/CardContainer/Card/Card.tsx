import { FC, useRef, useState } from 'react'

import { AiOutlineFileText } from "react-icons/ai";
import { FaRegCopy, FaRegStar, FaStar } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoPlayOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { TiEdit } from 'react-icons/ti';

import { useUpdateNoteMutation } from '../../../hooks/network/note/useUpdateNoteMutation';
import { useDeleteNoteMutation } from '../../../hooks/network/note/useDeleteNoteMutation';
import { useDeleteFileMutation } from '../../../hooks/network/files/useDeleteFileMutation.ts';
import { INote } from '../../../types/note.types.ts';

import { EditNoteModal } from './EditNoteModal/EditNoteModal.tsx'

import "./Card.css"

interface CardProps {
    note: INote
};

export const Card: FC<CardProps> = ({ note }) => {
    const [hasCopied, setHasCopied] = useState(false);
    const timeoutRef = useRef<number>(0);

    const updateNoteMutation = useUpdateNoteMutation({ queryKey: ['notes'] });
    const deleteNoteMutation = useDeleteNoteMutation({ queryKey: ['notes'] });
    const deleteFileMutation = useDeleteFileMutation({});

    const [isModalOpen, setIsModalOpen] = useState(false);

    const dateCreated = new Date(note.createdAt)
    const dateCreatedString = dateCreated.toString();

    const dateString =
        `${dateCreated.toLocaleString(
            'en-US',
            {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }
        )} · ${dateCreatedString.substring(4, 10)}, ${dateCreatedString.substring(11, 15)}`

    const handleToggleFavorite = async () => {
        await updateNoteMutation.mutateAsync({
            pathParams: { noteId: note._id },
            payload: { isFavorite: !note.isFavorite }
        });
    }

    const handleDeleteNote = async () => {
        await deleteNoteMutation.mutateAsync({
            pathParams: { noteId: note._id }
        });

        await deleteFileMutation.mutateAsync({
            payload: {
                files: [note.audio ?? '', ...(note.images ?? [])]
            }
        });

    }

    const handleCopyNote = async () => {
        if (hasCopied)
            return;

        await navigator.clipboard.writeText(`${note.title}\n${note.description}`);

        setHasCopied(true);

        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }

    return (
        <div className="card">
            <EditNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} note={note} />
            <div className="card-top-container">
                <div className="card-date">{dateString}</div>
                {!note.isText ? (
                    <div className="card-type">
                        <IoPlayOutline className="card-type-logo" />
                        <div className="card-type-text">{note.duration}</div>
                    </div>
                ) : (
                    <div className="card-type">
                        <AiOutlineFileText className="card-type-logo" />
                        <div className="card-type-text">Text</div>
                    </div>
                )}
            </div>
            <div className="card-title">{note.title}</div>
            <div className="card-description">{note.description}</div>
            {!!note.images?.length && (
                <div className="card-image-attached">
                    <CiImageOn className="card-image-attached-logo" />
                    <span className='card-image-attached-text'>{note.images.length > 1 ? `${note.images.length} Images` : `${note.images.length} Image`}</span>
                </div>
            )}

            <div className="card-buttons-container">
                <button className='card-favorite-button' onClick={handleToggleFavorite}>
                    {
                        note.isFavorite ? (
                            <FaStar />
                        ) : (
                            <FaRegStar />
                        )
                    }
                </button>

                <button className='card-copy-button' onClick={handleCopyNote}>
                    {hasCopied && (<div className="card-copied-tooltip">Copied to clipboard!</div>)}
                    <FaRegCopy />
                </button>

                <button className='card-delete-button' onClick={handleDeleteNote}>
                    <RiDeleteBin6Line />
                </button>

                <button className='card-edit-button' onClick={() => setIsModalOpen(true)}>
                    <TiEdit />
                </button>
            </div>
        </div >
    )
}
