import { useNetworkBase } from "../useNetworkBase";
import APIEndpoints from "../../../config/APIEndpoints";
import { Note } from "../../../types/NoteTypes";

type NotePartial = Partial<Note>;

export const useUpdateNote = useNetworkBase<NotePartial>(APIEndpoints.UPDATE_NOTE, ['user-notes'], "Updating Notes", true);