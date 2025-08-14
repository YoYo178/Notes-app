import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

import { useAuthContext } from "./AuthContext";

import { useGetNotesQuery } from "../hooks/network/note/useGetNotesQuery";
import { ReactSetState } from "../types/react.types";
import { INote, NoteSortMethods } from "../types/note.types";

interface NotesProviderProps {
    children: ReactNode;
}

interface NotesValues {
    notes: INote[]; setNotes: ReactSetState<INote[]> | null;
    favoritesOnly: boolean; setFavoritesOnly: ReactSetState<boolean>;
    filter: string; setFilter: ReactSetState<string>;
    sortOrder: NoteSortMethods; setSortOrder: ReactSetState<NoteSortMethods>;
    isLoading: boolean; setIsLoading: ReactSetState<boolean>;
}

export const NotesContext = createContext<NotesValues | null>(null)

export const NotesProvider: FC<NotesProviderProps> = ({ children }) => {

    // Note objects from backend
    const [serverNotes, setServerNotes] = useState<INote[]>([]);

    // Final manipulated note objects (filter, sort, etc)
    const [notes, setNotes] = useState<INote[]>([]);

    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<NoteSortMethods>(NoteSortMethods.SORT_BY_DATE_ASC)
    const [isLoading, setIsLoading] = useState(false);

    const { auth } = useAuthContext();

    const { data, error } = useGetNotesQuery({ queryKey: ['notes'], enabled: !!auth });

    useEffect(() => {
        const fetchedNotes: INote[] | undefined = data?.notes;

        if (!fetchedNotes?.length) {
            setIsLoading(false);
            setServerNotes([]);
            setNotes([]);
            return;
        }

        setServerNotes(fetchedNotes);
    }, [data?.notes])

    useEffect(() => {
        // Handle favorite notes
        let filteredNotes = favoritesOnly ? serverNotes.filter(note => note.isFavorite) : serverNotes;

        // Handle filter text
        if (filter.length) {
            filteredNotes = filteredNotes.filter(note => {
                return (
                    note.title.toLowerCase().includes(filter.toLowerCase()) ||
                    note.description.toLowerCase().includes(filter.toLowerCase())
                )
            })
        }

        // Handle sorting
        switch (sortOrder) {
            case NoteSortMethods.SORT_BY_NAME_ASC:
                filteredNotes = [...filteredNotes].sort((a, b) => a.title.localeCompare(b.title));
                break;
            case NoteSortMethods.SORT_BY_NAME_DESC:
                filteredNotes = [...filteredNotes].sort((a, b) => b.title.localeCompare(a.title));
                break;
            case NoteSortMethods.SORT_BY_DATE_ASC:
                filteredNotes = [...filteredNotes].sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
                break;
            case NoteSortMethods.SORT_BY_DATE_DESC:
                filteredNotes = [...filteredNotes].sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
                break;
        }

        setNotes(filteredNotes);
    }, [serverNotes, favoritesOnly, filter, sortOrder])

    if (!auth)
        return (<>{children}</>);

    if (error) {
        return <div>Error!</div>
    }

    return (
        <NotesContext value={{
            notes, setNotes,
            favoritesOnly, setFavoritesOnly,
            filter, setFilter,
            sortOrder, setSortOrder,
            isLoading, setIsLoading
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