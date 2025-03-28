import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react'

import { AuthProvider } from '../../contexts/AuthProvider';
import { RecordingProvider } from '../../contexts/RecordingProvider';
import { TranscriptionProvider } from '../../contexts/TranscriptionProvider';

interface ProviderLayoutProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

export const ProviderLayout: FC<ProviderLayoutProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RecordingProvider>
                    <TranscriptionProvider>
                        {children}
                    </TranscriptionProvider>
                </RecordingProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}
