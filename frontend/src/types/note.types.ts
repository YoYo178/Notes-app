export interface Note {
    id: string;
    title: string;
    description: string;
    images?: string[];
    audio?: string;
    date: string;
    isFavorite?: boolean;
    isText: boolean;
    duration: string | null;
    rawDate: Date;
}

export type NotePayload = Omit<Note, 'id' | 'date' | 'rawDate'>;

export type NoteType = 'text' | 'audio'; 

export enum NoteSortMethods {
    SORT_BY_NAME_ASC,
    SORT_BY_NAME_DESC,
    SORT_BY_DATE_ASC,
    SORT_BY_DATE_DESC
}