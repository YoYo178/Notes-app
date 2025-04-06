import { FC } from 'react'

import { GiHamburgerMenu } from 'react-icons/gi'
import { IoIosWarning } from 'react-icons/io'

import { useAuthContext } from '../../contexts/AuthProvider.tsx'
import { useRecordingContext } from '../../contexts/RecordingProvider.tsx'
import { useTranscriptionContext } from '../../contexts/TranscriptionProvider.tsx'

import { MAX_AUDIO_RECORD_DURATION } from '../../types/recording.types.ts'

import { SidebarBranding } from './SidebarBranding/SidebarBranding'
import { SidebarLinks } from './SidebarLinks/SidebarLinks'
import { SidebarLogin } from './SidebarLogin/SidebarLogin'
import { SidebarUser } from './SidebarUser/SidebarUser.tsx'

import './Sidebar.css'

interface SidebarProps {
  isSearchBoxOpen: boolean;
  isMediaQueryActive: boolean;
}

export const Sidebar: FC<SidebarProps> = ({ isSearchBoxOpen, isMediaQueryActive }) => {
  const { transcript, hasSpeechRecognitionSupport } = useTranscriptionContext();
  const { isRecording, recordingTime } = useRecordingContext();
  const { auth } = useAuthContext();

  return (
    <>
      <nav className="sidebar">
        <SidebarBranding />
        <div className="separator" />
        <SidebarLinks />

        {/* Recording Note Indicator */}
        {isRecording && (
          <div className="sidebar-recording-container">
            <div className="sidebar-recording-indicator">
              <div className="sidebar-recording-pulse"></div>
              <span className="sidebar-recording-text">Recording... ({MAX_AUDIO_RECORD_DURATION - (recordingTime || 0)}s)</span>
            </div>
            {!hasSpeechRecognitionSupport ? (
              <div className="sidebar-live-transcript-not-supported-container">
                <IoIosWarning className='sidebar-live-transcript-not-supported-icon' />
                <span className="sidebar-live-transcript-not-supported">Your browser does not support Speech Recognition.</span>
              </div>
            ) : (
              transcript && (
                <div className="sidebar-live-transcript-text">{transcript}</div>
              )
            )}
          </div>
        )}

        {!!auth ? (
          <SidebarUser displayName={auth?.displayName} />
        ) : (
          <SidebarLogin />
        )}
      </nav>
      {((isMediaQueryActive && !isSearchBoxOpen) || !isMediaQueryActive) &&
        <button className="sidebar-hamburger-button">
          <GiHamburgerMenu />
        </button>
      }
    </>
  )
} 