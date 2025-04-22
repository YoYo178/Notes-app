import { ReactSetState } from "./react.types";

export interface TranscriptionState {
    /* React States */
    isTranscribing: boolean;
    setIsTranscribing: ReactSetState<boolean>;

    hasSpeechRecognitionSupport: boolean;
    setHasSpeechRecognitionSupport: ReactSetState<boolean>;

    hasMicPermissions: boolean;
    setHasMicPermissions: ReactSetState<boolean>;

    transcript: string;
    setTranscript: ReactSetState<string>;

    /* Miscellaneous */
    startTranscribing: () => void;
    stopTranscribing: () => void;

    deleteTranscription: () => void;
}