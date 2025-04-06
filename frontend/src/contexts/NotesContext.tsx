import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

import { useGetNotesQuery } from "../hooks/network/note/useGetNotesQuery";

import { ReactSetState } from "../types/react.types";
import { Note, NoteSortMethods, ServerNote } from "../types/note.types";

interface NotesProviderProps {
    children: ReactNode;
}

interface NotesValues {
    notes: Note[]; setNotes: ReactSetState<Note[]> | null;
    favoritesOnly: boolean; setFavoritesOnly: ReactSetState<boolean>;
    filter: string; setFilter: ReactSetState<string>;
    sortOrder: NoteSortMethods; setSortOrder: ReactSetState<NoteSortMethods>
}

export const NotesContext = createContext<NotesValues | null>(null)

export const NotesProvider: FC<NotesProviderProps> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([])
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<NoteSortMethods>(NoteSortMethods.SORT_BY_DATE_ASC)

    const { data, isLoading, error } = useGetNotesQuery({ queryKey: ['notes'] });

    useEffect(() => {
        let fetchedNotes: ServerNote[] | undefined = data?.notes;

        if (!fetchedNotes)
            return;

        // Convert ServerNote to Note and add Dates
        const alteredNotes: Note[] = fetchedNotes.map(note => {
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
        })

        // Handle favorite notes
        let filteredNotes = favoritesOnly ? alteredNotes.filter(note => note.isFavorite) : alteredNotes;

        // Handle filter text
        filteredNotes = filter.length ? filteredNotes.filter(note => {
            return (
                note.title.toLowerCase().includes(filter.toLowerCase()) ||
                note.description.toLowerCase().includes(filter.toLowerCase())
            )
        }) : filteredNotes;

        switch (sortOrder) {
            case NoteSortMethods.SORT_BY_NAME_ASC:
                filteredNotes = [...filteredNotes].sort((a, b) => a.title.localeCompare(b.title));
                break;
            case NoteSortMethods.SORT_BY_NAME_DESC:
                filteredNotes = [...filteredNotes].sort((a, b) => b.title.localeCompare(a.title));
                break;
            case NoteSortMethods.SORT_BY_DATE_ASC:
                filteredNotes = [...filteredNotes].sort((a, b) => b.rawDate.valueOf() - a.rawDate.valueOf());
                break;
            case NoteSortMethods.SORT_BY_DATE_DESC:
                filteredNotes = [...filteredNotes].sort((a, b) => a.rawDate.valueOf() - b.rawDate.valueOf());
                break;
            default:
                break;
        }

        setNotes(filteredNotes);
    }, [data, favoritesOnly, filter, sortOrder])

    if (error) {
        return <div>Error!</div>
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <NotesContext value={{
            notes, setNotes,
            favoritesOnly, setFavoritesOnly,
            filter, setFilter,
            sortOrder, setSortOrder
        }}>
            {children}
        </NotesContext>
    )
}

export function useNotesContext() {
    const context = useContext(NotesContext);
    if (!context)
        throw new Error("[useNotesContext] Context is NULL!");

    return context;
}