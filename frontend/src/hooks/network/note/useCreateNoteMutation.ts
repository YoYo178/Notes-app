import APIEndpoints from "../../../config/APIEndpoints";
import { Note } from "../../../types/NoteTypes";
import { useMutationBase } from "../useMutationBase";

export type BaseNote = Omit<Omit<Note, 'id'>, 'date'>;

export const useCreateNoteMutation = useMutationBase<BaseNote>(APIEndpoints.CREATE_NOTE, ['notes'], "Creating note", true);