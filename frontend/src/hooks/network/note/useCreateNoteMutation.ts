import APIEndpoints from "../../../config/APIEndpoints";
import { NotePayload } from "../../../types/note.types";
import { useMutationBase } from "../useMutationBase";

export const useCreateNoteMutation = useMutationBase<NotePayload>(APIEndpoints.CREATE_NOTE, "Creating note", true);