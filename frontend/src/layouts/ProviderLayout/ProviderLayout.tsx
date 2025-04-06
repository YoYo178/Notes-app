import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react'

import { AuthProvider } from '../../contexts/AuthContext';
import { NotesProvider } from '../../contexts/NotesContext';
import { RecordingProvider } from '../../contexts/RecordingContext';
import { TranscriptionProvider } from '../../contexts/TranscriptionContext';

interface ProviderLayoutProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

export const ProviderLayout: FC<ProviderLayoutProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotesProvider>
                    <RecordingProvider>
                        <TranscriptionProvider>
                            {children}
                        </TranscriptionProvider>
                    </RecordingProvider>
                </NotesProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}
