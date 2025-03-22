import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";
import { Note } from "../../../types/note.types";

type NotePartial = Partial<Note>;

export const useUpdateNoteMutation = useMutationBase<NotePartial>(APIEndpoints.UPDATE_NOTE, ['notes'], "Updating Notes", true);