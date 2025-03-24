import { FC, useContext, useState } from 'react'

import { useGetNotesQuery } from '../../hooks/network/note/useGetNotesQuery.ts';
import AuthContext from '../../contexts/AuthProvider.tsx';
import { Note } from '../../types/note.types.ts';

import { Card } from './Card/Card.tsx';
import { CreateNoteBar } from './CreateNoteBar/CreateNoteBar.tsx';

import "./CardContainer.css"

interface CardContainerProps {
    favoritesOnly: boolean;
    filterText: string;
}

// Special type just to add rawDate, to sort by date
interface MNote extends Note { rawDate: Date };

export const CardContainer: FC<CardContainerProps> = ({ favoritesOnly, filterText }) => {
    const [isCreateNoteBarVisible, setIsCreateNoteBarVisible] = useState(true);

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

    let filteredNotes = favoritesOnly ? notes.filter(note => note.isFavorite) : notes;
    filteredNotes = !!filterText.length ? filteredNotes.filter(note => {
        return (
            note.title.toLowerCase().includes(filterText.toLowerCase()) ||
            note.description.toLowerCase().includes(filterText.toLowerCase())
        )
    }) : filteredNotes;

    if (!auth) {
        return <div>Not logged in!</div>
    }

    if (error) {
        return <div>Error!</div>
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <CreateNoteBar isVisible={isCreateNoteBarVisible} />
            <div
                className="card-container"
                onScroll={
                    (e) => {
                        // @ts-ignore
                        setIsCreateNoteBarVisible(e.target?.scrollTop === 0)
                    }
                }
            >
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
        </>
    )
}
