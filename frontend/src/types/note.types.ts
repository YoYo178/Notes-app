type DateString = string;

export interface INote {
    _id: string,
    audio?: string;
    description: string;
    duration: null | number;
    images?: string[];
    isFavorite: boolean;
    isText: boolean;
    title: string;
    user: string;

    createdAt: DateString;
    updatedAt: DateString;
}

export type NoteFile = {
    key: string;
    localURL: string;
}

export type NoteType = 'text' | 'audio';

export enum NoteSortMethods {
    SORT_BY_NAME_ASC,
    SORT_BY_NAME_DESC,
    SORT_BY_DATE_ASC,
    SORT_BY_DATE_DESC
}