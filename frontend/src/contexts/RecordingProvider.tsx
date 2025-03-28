import { createContext, FC, ReactNode, useEffect, useRef, useState } from 'react'
import { RecordingState } from '../types/recording.types'

interface AuthProviderProps {
    children: ReactNode;
}

const RecordingContext = createContext<Partial<RecordingState>>({})

export const RecordingProvider: FC<AuthProviderProps> = ({ children }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [hasMicPermissions, setHasMicPermissions] = useState(true);
    const [recordedAudio, setRecordedAudio] = useState('');

    const timerRef = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedAudioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (isRecording)
                stopRecording();

            if (recordedAudio)
                URL.revokeObjectURL(recordedAudio);
        };
    }, []);

    const startRecording = async (duration: number) => {
        try {
            if (recordedAudio) {
                URL.revokeObjectURL(recordedAudio);
                setRecordedAudio('');
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            recordedAudioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => recordedAudioChunksRef.current.push(event.data);

            mediaRecorderRef.current.onstop = () => {
                const recordedAudioBlob = new Blob(recordedAudioChunksRef.current, { type: 'audio/webm' });
                const audioURL = URL.createObjectURL(recordedAudioBlob);

                setRecordedAudio(audioURL);
                setIsRecording(false);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= duration - 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
            return true;
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setHasMicPermissions(false);
            return false;
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();

            mediaRecorderRef.current.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsRecording(false);

        return recordedAudio || null;
    }

    return (
        <RecordingContext value={
            {
                isRecording, setIsRecording,
                recordingTime, setRecordingTime,
                hasMicPermissions, setHasMicPermissions,
                recordedAudio, setRecordedAudio,

                startRecording, stopRecording
            }
        }>
            {children}
        </RecordingContext>
    )
}

export default RecordingContext;