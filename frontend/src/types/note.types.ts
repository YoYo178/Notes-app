export interface Note {
    id: string;
    title: string;
    description: string;
    images?: [],
    date: string;
    isFavorite?: boolean;
    isText: boolean;
    duration: string | null;
}

export type BaseNote = Omit<Omit<Note, 'id'>, 'date'>;

export type NoteType = 'text' | 'audio'; 

export enum NoteSortMethods {
    SORT_BY_NAME_ASC,
    SORT_BY_NAME_DESC,
    SORT_BY_DATE_ASC,
    SORT_BY_DATE_DESC
}