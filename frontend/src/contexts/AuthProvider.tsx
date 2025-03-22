import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { AxiosError } from "axios";

import { useAuthQuery } from "../hooks/network/auth/useAuthQuery";
import { User } from "../types/user.types";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthValues {
    auth: Partial<User> | null;
    setAuth: React.Dispatch<React.SetStateAction<Partial<User> | null>> | null;
}

const AuthContext = createContext<AuthValues>({ auth: null, setAuth: null })

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<Partial<User> | null>(null)
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
        <AuthContext value={{ auth, setAuth }}>
            {children}
        </AuthContext>
    )
}

export default AuthContext;