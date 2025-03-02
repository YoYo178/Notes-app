import { FC, RefObject, useEffect, useState } from 'react'

import { useGetNotes } from '../../hooks/network/note/useGetNotes';
import { Note } from '../../types/NoteTypes';

import { Card } from './Card/Card';

import "./CardContainer.css"

interface CardContainerProps {
    innerRef?: RefObject<HTMLDivElement>;
    favoritesOnly: boolean;
}

// Special type just to add rawDate, to sort by date
interface MNote extends Note { rawDate: Date };

export const CardContainer: FC<CardContainerProps> = ({ innerRef, favoritesOnly }) => {
    const [notes, setNotes] = useState<MNote[]>([]);

    const useGetNotesMutation = useGetNotes();

    useEffect(() => {
        console.log(notes)
        if (!notes.length && useGetNotesMutation.isIdle) {
            useGetNotesMutation.mutate({});
        }

        if (!notes.length && useGetNotesMutation.isSuccess && useGetNotesMutation.data) {
            const { data: { notes: serverNotes } } = useGetNotesMutation; // 3-Layer destructured properties

            if (!serverNotes || !serverNotes.length)
                return;

            const notesArr: MNote[] = []

            for (const note of serverNotes) {
                const date = new Date(note.createdAt);

                const stringDate = `${date.toString().substring(4, 10)}, ${date.toString().substring(11, 15)}`;
                const stringTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                notesArr.push({
                    title: note.title,
                    description: note.description,
                    isText: note.isText,
                    duration: note.duration,
                    date: `${stringDate} · ${stringTime}`,
                    rawDate: date
                })
            }

            // Sort in descending order (Newest first)
            notesArr.sort((a, b) => b.rawDate.valueOf() - a.rawDate.valueOf())

            setNotes(notesArr);
        }
    }, [notes.length, useGetNotesMutation.isSuccess])

    return (
        <div ref={innerRef} className="card-container">
            {notes.map((note, i) => {
                return (
                    <Card
                        key={i}
                        title={note.title}
                        description={note.description}
                        date={note.date}
                        duration={note.duration}
                        isText={note.isText}
                    />
                )
            })}
        </div>
    )
}
