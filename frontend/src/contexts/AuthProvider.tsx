import { createContext, FC, ReactNode, useEffect, useState } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthObject {
    displayName: string | undefined;
    username: string | undefined;
    id: string | undefined;
}

interface AuthValues {
    auth: {} | null;
    setAuth: React.Dispatch<React.SetStateAction<AuthObject | null>> | null;
}

const AuthContext = createContext<AuthValues>({ auth: null, setAuth: null })

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthObject | null>(null)

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;