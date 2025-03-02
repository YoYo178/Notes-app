import { FC, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { ButtonHandler } from './LoginButton';
import { useLogin } from '../../../hooks/auth/useLogin';
import AuthContext from '../../../contexts/AuthProvider';

import './LoginButton.css';
import axios, { AxiosError } from 'axios';

interface LoginButtonProps {
    username: string;
    password: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const LoginButton: FC<LoginButtonProps> = ({ username, password, setErrorMessage }) => {
    const { setAuth } = useContext(AuthContext);
    const loginMutation = useLogin();

    useEffect(() => {
        if (loginMutation.isSuccess) {
            if (loginMutation.data) {
                const data = loginMutation.data;

                if (!setAuth) {
                    console.error("setAuth() is null!")
                    return;
                }

                setAuth({
                    username: username,
                    displayName: data.user.displayName,
                    id: data.user.id
                })
                console.log("Welcome " + username)
            }
        } else if (loginMutation.isError) {
            if (loginMutation.error?.message) {
                const { error: err } = loginMutation;

                if (err && axios.isAxiosError(err)) {
                    const error = err as AxiosError<{ message: unknown }>;

                    setErrorMessage(error.response?.data?.message as string);
                    return;
                }

                const errorMessage = loginMutation.error?.message;
                setErrorMessage(errorMessage);

                console.log("An error occured while trying to sign-in.")
                console.log(errorMessage);
            }
        }

    }, [loginMutation.isSuccess, loginMutation.isError])

    return (
        <button
            className="login-button"
            onClick={async () => { await ButtonHandler.loginButtonOnClick(username, password, loginMutation) }
            }>
            Login
            {loginMutation.isSuccess ? (
                <Navigate to="/" />
            ) : (
                null
            )}
        </button>
    )
}
