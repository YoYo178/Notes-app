import { createContext, FC, ReactNode, useEffect, useRef, useState } from 'react'
import { TranscriptionState } from '../types/transcription.types';

interface TranscriptionProviderProps {
    children: ReactNode
}

const TranscriptionContext = createContext<Partial<TranscriptionState>>({});

export const TranscriptionProvider: FC<TranscriptionProviderProps> = ({ children }) => {
    const [isTranscripting, setIsTranscripting] = useState(false);
    const [hasSpeechRecognitionSupport, setHasSpeechRecognitionSupport] = useState(false);
    const [hasMicPermissions, setHasMicPermissions] = useState(true);
    const [transcript, setTranscript] = useState('');

    const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            setHasSpeechRecognitionSupport(true);

            try {
                speechRecognitionRef.current = new SpeechRecognition();
                speechRecognitionRef.current.continuous = true;
                speechRecognitionRef.current.interimResults = true;
                speechRecognitionRef.current.lang = 'en-US';

                const transcriptParts: string[] = [];

                speechRecognitionRef.current.onresult = (event) => {
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            transcriptParts.push(transcript);
                            const fullText = transcriptParts.join(' ');
                            setTranscript(fullText);
                        } else {
                            interimTranscript = transcript;
                        }
                    };

                    if (interimTranscript) {
                        const tempText = [...transcriptParts, interimTranscript].join(' ');
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
                    setIsTranscripting(false);
                } catch (e) {
                    console.error("An error occured while stopping Speech Recognition.");
                };
            }
        };
    }, []);

    const startTranscription = () => {
        // Start speech recognition if supported
        if (!isTranscripting && hasSpeechRecognitionSupport && speechRecognitionRef.current) {
            try {
                speechRecognitionRef.current.start();
                setIsTranscripting(true);
            } catch (e) {
                console.error("Error starting speech recognition:", e);
            }
        }
    };

    const stopTranscription = () => {
        // Stop speech recognition if started
        if (isTranscripting && hasSpeechRecognitionSupport && speechRecognitionRef.current) {
            try {
                speechRecognitionRef.current.stop();
                setIsTranscripting(false);
            } catch (e) {
                console.error("Error stopping speech recognition:", e);
            };
        }
    };

    return (
        <TranscriptionContext value={
            {
                isTranscripting, setIsTranscripting,
                hasSpeechRecognitionSupport, setHasSpeechRecognitionSupport,
                hasMicPermissions, setHasMicPermissions,
                transcript, setTranscript,

                startTranscription,
                stopTranscription
            }
        }>
            {children}
        </TranscriptionContext>
    );
}

export default TranscriptionContext;