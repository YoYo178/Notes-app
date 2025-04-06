import { ReactSetState } from "../../../types/react.types";
import { MAX_AUDIO_RECORD_DURATION } from "../../../types/recording.types";

async function recordButtonOnClick(
    startRecording: (((duration: number) => Promise<boolean>)), stopRecording: () => void,
    isRecording: boolean,
    hasMicPermissions: boolean,

    startTranscribing: () => void, stopTranscribing: () => void,
    isTranscribing: boolean,
    hasSpeechRecognitionSupport: boolean,

    isMicDeniedPopupVisible: boolean, setIsMicDeniedPopupVisible: ReactSetState<boolean>,

) {
    if (!hasMicPermissions && !isMicDeniedPopupVisible)
        setIsMicDeniedPopupVisible(true);

    if (isRecording) {
        if (isTranscribing)
            stopTranscribing();

        return stopRecording();
    }

    await startRecording(MAX_AUDIO_RECORD_DURATION);

    if (hasSpeechRecognitionSupport && !isTranscribing && !!startTranscribing)
        startTranscribing();
}

export const ButtonHandler = {
    recordButtonOnClick
}