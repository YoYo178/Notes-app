import { useMutationBase } from "../useMutationBase";
import APIEndpoints from "../../../config/APIEndpoints";

import { NotePayload } from "../../../types/note.types";

export const useCreateNoteMutation = useMutationBase<NotePayload>(APIEndpoints.CREATE_NOTE, "Creating note", true);