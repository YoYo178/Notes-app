import { createContext, FC, ReactNode, useState } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthFields {
    displayName: string | undefined;
    username: string | undefined;
    id: string | undefined;
}

interface AuthValues {
    auth: {} | null;
    setAuth: React.Dispatch<React.SetStateAction<AuthFields | null>> | null;
}

const AuthContext = createContext<AuthValues>({ auth: null, setAuth: null })

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthFields | null>(null)

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;