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

export enum NoteSortMethods {
    SORT_BY_NAME_ASC,
    SORT_BY_NAME_DESC,
    SORT_BY_DATE_ASC,
    SORT_BY_DATE_DESC
}