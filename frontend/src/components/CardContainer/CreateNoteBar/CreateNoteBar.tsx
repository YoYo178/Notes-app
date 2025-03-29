import { FC, useContext, useEffect, useRef, useState } from 'react'

import { FiFilePlus } from 'react-icons/fi';
import { BsRecord2, BsStopFill } from 'react-icons/bs';

import RecordingContext from '../../../contexts/RecordingProvider.tsx';
import TranscriptionContext from '../../../contexts/TranscriptionProvider.tsx';
import { useLostFocus } from '../../../hooks/ui/useLostFocus.ts';

import { MAX_AUDIO_RECORD_DURATION } from '../../../types/recording.types.ts';
import { NoteType } from '../../../types/note.types.ts';

import { CreateNoteModal } from './CreateNoteModal/CreateNoteModal.tsx';

import { ButtonHandler } from './CreateNoteBar.ts';

import './CreateNoteBar.css'

interface CreateNoteBarProps {
    isVisible: boolean;
}

export const CreateNoteBar: FC<CreateNoteBarProps> = ({ isVisible }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isMicDeniedPopupVisible, setIsMicDeniedPopupVisible] = useState(false);
    const [isEditingTranscript, setIsEditingTranscript] = useState(false);
    const [noteType, setNoteType] = useState<NoteType>('text');

    const {
        hasSpeechRecognitionSupport,
        isTranscribing,

        startTranscribing,
        stopTranscribing,
        deleteTranscription
    } = useContext(TranscriptionContext);

    const {
        isRecording,
        hasMicPermissions,
        recordedAudio,
        recordingTime,

        startRecording,
        stopRecording,
        deleteRecording
    } = useContext(RecordingContext);

    useEffect(() => {
        if (recordedAudio) {
            setNoteType('audio');
            setModalOpen(true);
        }
    }, [recordedAudio])

    const transcriptionBoxRef = useRef<HTMLDivElement | null>(null);
    useLostFocus(transcriptionBoxRef, isEditingTranscript, () => setIsEditingTranscript(false))

    const handleModalClose = () => {
        setModalOpen(false);

        if (!!deleteRecording)
            deleteRecording();

        if (!!deleteTranscription)
            deleteTranscription();
    }

    return (
        <>
            <CreateNoteModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                noteType={noteType}
            />

            {/* Permission Denied Popup */}
            {isMicDeniedPopupVisible && (
                <div className="mic-permission-denied-popup-backdrop">
                    <div className="mic-permission-denied-popup">
                        <h3 className='mic-permission-denied-title'>Microphone Access Denied</h3>
                        <p className='mic-permission-denied-description'>Please allow microphone access to record audio notes.</p>
                        <button className='mic-permission-denied-dismiss-btn' onClick={() => setIsMicDeniedPopupVisible(false)}>Dismiss</button>
                    </div>
                </div>
            )}

            <div className={`create-note-bar ${isVisible ? 'visible' : 'hidden'}`}>
                <button className='add-note-button' onClick={() => { setNoteType('text'); setModalOpen(true) }}>
                    <FiFilePlus />
                </button>
                <div className="record-note-button-container" onClick={
                    async () => {
                        ButtonHandler.recordButtonOnClick(
                            startRecording, stopRecording,
                            isRecording,
                            hasMicPermissions,

                            startTranscribing, stopTranscribing,
                            isTranscribing,
                            hasSpeechRecognitionSupport,

                            isMicDeniedPopupVisible, setIsMicDeniedPopupVisible
                        )
                    }}>
                    {isRecording ? (
                        <>
                            <BsStopFill />
                            <span className="record-note-button-text">
                                Stop Recording ({MAX_AUDIO_RECORD_DURATION - (recordingTime || 0)}s)
                            </span>
                        </>
                    ) : (
                        <>
                            <BsRecord2 />
                            <span className="record-note-button-text">
                                {hasSpeechRecognitionSupport ? "Start Recording" : "Record Audio"}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
