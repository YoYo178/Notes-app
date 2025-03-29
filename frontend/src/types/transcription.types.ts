import { ReactSetState } from "./react.types";

export interface TranscriptionState {
    /* React States */
    isTranscripting: boolean;
    setIsTranscripting: ReactSetState<boolean>;

    hasSpeechRecognitionSupport: boolean;
    setHasSpeechRecognitionSupport: ReactSetState<boolean>;
    
    hasMicPermissions: boolean;
    setHasMicPermissions: ReactSetState<boolean>;
    
    transcript: string;
    setTranscript: ReactSetState<string>;

    /* Miscellaneous */
    startTranscription: () => void;
    stopTranscription: () => void;

    deleteTranscription: () => void;
}