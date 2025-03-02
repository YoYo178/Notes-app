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