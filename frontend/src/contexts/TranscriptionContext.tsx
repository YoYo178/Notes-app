import { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { TranscriptionState } from '../types/transcription.types';

interface TranscriptionProviderProps {
    children: ReactNode
}

export const TranscriptionContext = createContext<TranscriptionState | null>(null);

export const TranscriptionProvider: FC<TranscriptionProviderProps> = ({ children }) => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [hasSpeechRecognitionSupport, setHasSpeechRecognitionSupport] = useState(false);
    const [hasMicPermissions, setHasMicPermissions] = useState(true);
    const [transcript, setTranscript] = useState('');

    const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
    const transcriptPartsRef = useRef<string[]>([]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            setHasSpeechRecognitionSupport(true);

            try {
                speechRecognitionRef.current = new SpeechRecognition();
                speechRecognitionRef.current.continuous = true;
                speechRecognitionRef.current.interimResults = true;
                speechRecognitionRef.current.lang = 'en-US';

                speechRecognitionRef.current.onresult = (event) => {
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            transcriptPartsRef.current.push(transcript);
                            const fullText = transcriptPartsRef.current.join(' ');
                            setTranscript(fullText);
                        } else {
                            interimTranscript = transcript;
                        }
                    };

                    if (interimTranscript) {
                        const tempText = [...transcriptPartsRef.current, interimTranscript].join(' ');
                        setTranscript(tempText);
                    }
                };

                speechRecognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    if (event.error === 'not-allowed') {
                        setHasMicPermissions(false);
                    }
                };
            } catch (e) {
                console.error("Error initializing speech recognition:", e);
                setHasSpeechRecognitionSupport(false);
            }
        } else {
            console.warn("Speech recognition is not supported in this browser.");
            setHasSpeechRecognitionSupport(false);
        }

        return () => {
            if (speechRecognitionRef.current) {
                try {
                    speechRecognitionRef.current.stop();
                    setIsTranscribing(false);
                } catch (e) {
                    console.error("An error occured while stopping Speech Recognition.");
                };
            }
        };
    }, []);

    const startTranscribing = () => {
        // Start speech recognition if supported
        if (!isTranscribing && hasSpeechRecognitionSupport && speechRecognitionRef.current) {
            try {
                speechRecognitionRef.current.start();
                setIsTranscribing(true);
            } catch (e) {
                console.error("Error starting speech recognition:", e);
            }
        }
    };

    const stopTranscribing = () => {
        // Stop speech recognition if started
        if (hasSpeechRecognitionSupport && speechRecognitionRef.current && isTranscribing) {
            try {
                speechRecognitionRef.current.stop();
                setIsTranscribing(false);
            } catch (e) {
                console.error("Error stopping speech recognition:", e);
            };
        }
    };

    const deleteTranscription = () => {
        // Stop speech recognition if started
        stopTranscribing()
        setTranscript('');
        transcriptPartsRef.current = [];
    }

    return (
        <TranscriptionContext value={
            {
                isTranscribing, setIsTranscribing,
                hasSpeechRecognitionSupport, setHasSpeechRecognitionSupport,
                hasMicPermissions, setHasMicPermissions,
                transcript, setTranscript,

                startTranscribing,
                stopTranscribing,
                deleteTranscription
            }
        }>
            {children}
        </TranscriptionContext>
    );
}

export function useTranscriptionContext() {
    const context = useContext(TranscriptionContext);
    if (!context)
        throw new Error("[useTranscriptionContext] Context is NULL!");

    return context;
}