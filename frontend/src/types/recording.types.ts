export const MAX_AUDIO_RECORD_DURATION = 60; // In seconds

type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface RecordingState {
    /* React States */
    isRecording: boolean;
    setIsRecording: ReactSetState<boolean>;

    recordingTime: number;
    setRecordingTime: ReactSetState<number>;

    hasMicPermissions: boolean;
    setHasMicPermissions: ReactSetState<boolean>;

    recordedAudio: string;
    setRecordedAudio: ReactSetState<string>;

    /* Miscellaneous */
    startRecording: (duration: number) => Promise<boolean>;
    stopRecording: () => string | null;
}