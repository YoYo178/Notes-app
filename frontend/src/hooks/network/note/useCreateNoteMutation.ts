import APIEndpoints from "../../../config/APIEndpoints";
import { BaseNote } from "../../../types/note.types";
import { useMutationBase } from "../useMutationBase";

export const useCreateNoteMutation = useMutationBase<BaseNote>(APIEndpoints.CREATE_NOTE, "Creating note", true);