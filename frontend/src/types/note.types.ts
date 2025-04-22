type DateString = string;

export interface ServerNote {
    _id: string, // Note ID
    user: string; // User ID,
    title: string;
    description: string;
    isText: boolean;
    images?: string[];
    audioKey?: string;
    isFavorite?: boolean;
    duration: string | null;
    createdAt: DateString;
    updatedAt: DateString;
}

export interface Note {
    id: string;
    title: string;
    description: string;
    images?: NoteFile[];
    audio?: NoteFile;
    date: string;
    isFavorite?: boolean;
    isText: boolean;
    duration: string | null;
    rawDate: Date;
}

export type NoteFile = {
    key: string;
    localURL: string;
}

export type NotePayload = Omit<ServerNote, '_id' | 'user' | 'date' | 'createdAt' | 'updatedAt'>;

export type NoteType = 'text' | 'audio';

export enum NoteSortMethods {
    SORT_BY_NAME_ASC,
    SORT_BY_NAME_DESC,
    SORT_BY_DATE_ASC,
    SORT_BY_DATE_DESC
}