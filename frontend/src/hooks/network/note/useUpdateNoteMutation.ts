import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";
import { Note } from "../../../types/NoteTypes";

type NotePartial = Partial<Note>;

export const useUpdateNoteMutation = useMutationBase<NotePartial>(APIEndpoints.UPDATE_NOTE, ['notes'], "Updating Notes", true);