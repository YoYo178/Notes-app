import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { AxiosError } from "axios";

import { useAuthQuery } from "../hooks/network/auth/useAuthQuery";

interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthFields {
    displayName: string | undefined;
    username: string | undefined;
    id: string | undefined;
}

interface AuthValues {
    auth: Partial<AuthFields> | null;
    setAuth: React.Dispatch<React.SetStateAction<Partial<AuthFields> | null>> | null;
}

const AuthContext = createContext<AuthValues>({ auth: null, setAuth: null })

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<Partial<AuthFields> | null>(null)
    const { data, isLoading, error } = useAuthQuery();

    useEffect(() => {
        if (!data)
            return;

        const { id, username, displayName } = data.user;
        setAuth({ id, username, displayName });
    }, [data])

    if (error) {
        if ((error as AxiosError).status !== 401)
            return <div>Error!</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;