import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react'

import { AuthProvider } from '../../contexts/AuthProvider';
import { RecordingProvider } from '../../contexts/RecordingProvider';

interface ProviderLayoutProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

export const ProviderLayout: FC<ProviderLayoutProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RecordingProvider>
                    {children}
                </RecordingProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}
