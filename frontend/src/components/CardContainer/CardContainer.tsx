import { FC, useState } from 'react'

import { useNotesContext } from '../../contexts/NotesContext.tsx';

import { Card } from './Card/Card.tsx';
import { CreateNoteBar } from './CreateNoteBar/CreateNoteBar.tsx';

import "./CardContainer.css"

export const CardContainer: FC = () => {
    const [isCreateNoteBarVisible, setIsCreateNoteBarVisible] = useState(true);
    const { notes, isLoading } = useNotesContext();

    if (isLoading) {
        return (<h1>Loading Notes...</h1>)
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
                {notes.map((note, i) => (
                    <Card key={i} note={note} />
                ))}
            </div>
        </>
    )
}
