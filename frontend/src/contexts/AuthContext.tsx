import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";

import { useAuthQuery } from "../hooks/network/auth/useAuthQuery";
import { User } from "../types/user.types";
import { ReactSetState } from "../types/react.types";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthValues {
    auth: Partial<User> | null;
    setAuth: ReactSetState<Partial<User> | null>;
}

export const AuthContext = createContext<AuthValues | null>(null)

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<Partial<User> | null>(null)
    const { data, isLoading, error } = useAuthQuery({ queryKey: ['auth'] });

    useEffect(() => {
        if (!data)
            return;

        const { id, username, displayName, email } = data.user;
        setAuth({ id, username, displayName, email });
    }, [data])

    if (error) {
        if ((error as AxiosError).status !== 401)
            return <div>Error!</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext value={{ auth, setAuth }}>
            {children}
        </AuthContext>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("[useAuthContext] Context is NULL!");

    return context;
}