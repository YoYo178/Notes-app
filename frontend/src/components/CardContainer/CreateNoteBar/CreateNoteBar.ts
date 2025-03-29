import { ReactSetState } from "../../../types/react.types";
import { MAX_AUDIO_RECORD_DURATION } from "../../../types/recording.types";

type undefinedFunc = (() => void) | undefined

async function recordButtonOnClick(
    startRecording: (((duration: number) => void) | undefined), stopRecording: undefinedFunc,
    isRecording: boolean | undefined,
    hasMicPermissions: boolean | undefined,

    startTranscribing: undefinedFunc, stopTranscribing: undefinedFunc,
    isTranscribing: boolean | undefined,
    hasSpeechRecognitionSupport: boolean | undefined,

    isMicDeniedPopupVisible: boolean, setIsMicDeniedPopupVisible: ReactSetState<boolean>,

) {
    if (!startRecording || !stopRecording) {
        console.error("[CreateNoteBar] Audio context not initialized!")
        return;
    }

    if (!hasMicPermissions && !isMicDeniedPopupVisible)
        setIsMicDeniedPopupVisible(true);

    if (isRecording) {
        if (isTranscribing && !!stopTranscribing)
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