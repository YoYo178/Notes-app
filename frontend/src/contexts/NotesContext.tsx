import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { isEqualWith } from "lodash";

import { API } from "../api/backendAPI";
import APIEndpoints from "../config/APIEndpoints";

import { useAuthContext } from "./AuthContext";

import { useGetNotesQuery } from "../hooks/network/note/useGetNotesQuery";
import { MultipleFileQueryResponse, useGetMultipleFileURLMutation } from "../hooks/network/upload/useGetMultipleFileURLMutation";

import { ReactSetState } from "../types/react.types";
import { Note, NoteFile, NoteSortMethods, ServerNote } from "../types/note.types";

import { injectQueryParams } from "../util/api.utils";

interface NotesProviderProps {
    children: ReactNode;
}

interface NotesValues {
    notes: Note[]; setNotes: ReactSetState<Note[]> | null;
    favoritesOnly: boolean; setFavoritesOnly: ReactSetState<boolean>;
    filter: string; setFilter: ReactSetState<string>;
    sortOrder: NoteSortMethods; setSortOrder: ReactSetState<NoteSortMethods>;
    hasFinished: boolean; setHasFinished: ReactSetState<boolean>;
}

export const NotesContext = createContext<NotesValues | null>(null)

export const NotesProvider: FC<NotesProviderProps> = ({ children }) => {

    // Level 1: Notes from backend, no modifications done
    const [serverNotes, setServerNotes] = useState<ServerNote[]>([]);
    // Level 2: Derived from serverNotes, Added crucial frontend fields such as Dates, AWS S3 pre-signed URLs, etc
    const [processedNotes, setProcessedNotes] = useState<Note[]>([]);
    // Level 3 (Surface): Derived from rawNotes, is what the user sees, such as when there's an applied filter text, or sorting method
    const [notes, setNotes] = useState<Note[]>([]);

    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<NoteSortMethods>(NoteSortMethods.SORT_BY_DATE_ASC)
    const [hasFinished, setHasFinished] = useState(false);

    const { auth } = useAuthContext();

    const { data, error } = useGetNotesQuery({ queryKey: ['notes'], enabled: !!auth });

    const getMultipleFileURLMutation = useGetMultipleFileURLMutation({});

    useEffect(() => {
        async function fetchNotes() {

            let fetchedNotes: ServerNote[] | undefined = data?.notes;

            if (!fetchedNotes)
                return;

            if (isEqualWith(serverNotes, fetchedNotes))
                return;

            setServerNotes(fetchedNotes);

            // Convert ServerNote to Note and add Dates
            const alteredNotes: Note[] = await Promise.all(
                fetchedNotes.map(async (note) => {
                    const lastNote = notes.find(e => e.id === note._id);
                    const lastServerNote = serverNotes.find(e => e._id === note._id);

                    if (isEqualWith(note, lastServerNote) && lastNote)
                        return lastNote;

                    const date = new Date(note.createdAt);
                    const stringDate = `${date.toString().substring(4, 10)}, ${date.toString().substring(11, 15)}`;
                    const stringTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                    let fetchedImages: NoteFile[] = [];
                    let fetchedAudio: NoteFile | null = null;

                    if (!note.isText && note.audioKey) {
                        const { data }: { data: { url: string, expiresIn: number } } = await API.get(
                            injectQueryParams(APIEndpoints.GET_FILE_URL.URL, { fileKey: note.audioKey }),
                            { withCredentials: true }
                        );

                        const res = await fetch(data.url);
                        const blob = await res.blob();

                        fetchedAudio = {
                            key: note.audioKey,
                            localURL: URL.createObjectURL(blob)
                        }
                    }

                    if (note.images?.length) {
                        const S3Response: MultipleFileQueryResponse = await getMultipleFileURLMutation.mutateAsync({ payload: { fileKeys: note.images } });

                        fetchedImages = await Promise.all(
                            S3Response?.urlArray.map(async (url: string) => {
                                const key = note.images?.find(key => url.includes(key)) || 'MISSINGKEY';
                                const res = await fetch(url);
                                const blob = await res.blob();
                                return {
                                    key,
                                    localURL: URL.createObjectURL(blob)
                                };
                            })
                        )
                    }

                    return {
                        id: note._id,
                        title: note.title,
                        description: note.description,
                        images: fetchedImages,
                        isFavorite: note.isFavorite,
                        isText: note.isText,
                        duration: note.duration,
                        date: `${stringDate} · ${stringTime}`,
                        rawDate: date,
                        audio: fetchedAudio ?? undefined
                    };
                }))

            setProcessedNotes(alteredNotes)
            setHasFinished(true);
        }

        fetchNotes();
    }, [data?.notes])

    useEffect(() => {
        async function updateNotes() {
            // Handle favorite notes
            let filteredNotes = favoritesOnly ? processedNotes.filter(note => note.isFavorite) : processedNotes;

            // Handle filter text
            filteredNotes = filter.length ? filteredNotes.filter(note => {
                return (
                    note.title.toLowerCase().includes(filter.toLowerCase()) ||
                    note.description.toLowerCase().includes(filter.toLowerCase())
                )
            }) : filteredNotes;

            // Handle sorting
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
        }

        updateNotes();
    }, [processedNotes, favoritesOnly, filter, sortOrder])

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
            hasFinished, setHasFinished
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