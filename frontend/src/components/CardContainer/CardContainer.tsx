import { FC, RefObject, useContext } from 'react'

import { useGetNotesQuery } from '../../hooks/network/note/useGetNotesQuery.ts';
import { Note } from '../../types/NoteTypes';

import { Card } from './Card/Card.tsx';

import "./CardContainer.css"
import AuthContext from '../../contexts/AuthProvider.tsx';

interface CardContainerProps {
    innerRef?: RefObject<HTMLDivElement>;
    favoritesOnly: boolean;
}

// Special type just to add rawDate, to sort by date
interface MNote extends Note { rawDate: Date };

export const CardContainer: FC<CardContainerProps> = ({ innerRef, favoritesOnly }) => {
    const { auth } = useContext(AuthContext);
    const { data, isLoading, error } = useGetNotesQuery();

    const notes: MNote[] = data?.notes?.map((note: any) => {
        const date = new Date(note.createdAt);
        const stringDate = `${date.toString().substring(4, 10)}, ${date.toString().substring(11, 15)}`;
        const stringTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        return {
            id: note._id,
            title: note.title,
            description: note.description,
            images: note.images,
            isFavorite: note.isFavorite,
            isText: note.isText,
            duration: note.duration,
            date: `${stringDate} · ${stringTime}`,
            rawDate: date
        };
    }).sort((a: MNote, b: MNote) => b.rawDate.valueOf() - a.rawDate.valueOf()) ?? [];

    const filteredNotes = favoritesOnly ? notes.filter(note => note.isFavorite) : notes;

    if(!auth) {
        return <div>Not logged in!</div>
    }

    if (error) {
        return <div>Error!</div>
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div ref={innerRef} className="card-container">
            {filteredNotes.map(note => (
                <Card
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    description={note.description}
                    date={note.date}
                    duration={note.duration}
                    isText={note.isText}
                    isFavorite={note.isFavorite}
                />
            ))}
        </div>
    )
}
