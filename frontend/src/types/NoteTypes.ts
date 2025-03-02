export interface Note {
    title: string;
    description: string;
    images?: [],
    date: string;
    isFavorite?: boolean;
    isText: boolean;
    duration: string | null;
}