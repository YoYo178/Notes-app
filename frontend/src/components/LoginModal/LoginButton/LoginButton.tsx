import { UseMutationResult } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import { useAuthContext } from '../../../contexts/AuthContext';
import { LoginFields } from '../../../types/auth.types';

import { ButtonHandler } from './LoginButton';

import './LoginButton.css';

interface LoginButtonProps {
    username: string;
    password: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    loginMutation: UseMutationResult<any, Error, LoginFields | undefined, unknown>
}

export const LoginButton: FC<LoginButtonProps> = ({ username, password, setErrorMessage, loginMutation }) => {
    const { auth, setAuth } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loginMutation.isSuccess) {
            if (loginMutation.data) {
                const data = loginMutation.data;

                setAuth({
                    username: username,
                    displayName: data.user.displayName,
                    id: data.user.id
                })
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

                console.error("An error occured while trying to sign-in.", errorMessage)
            }
        }

    }, [loginMutation.isSuccess, loginMutation.isError]);

    useEffect(() => {
        if (auth?.id) {
            navigate('/dashboard', {
                state: { from: location },
                replace: true
            });
            console.log("Welcome " + auth?.username)
        }
    }, [auth?.id])

    return (
        <button
            className="login-button"
            onClick={() => ButtonHandler.loginButtonOnClick(username, password, loginMutation)}
        >
            Login
        </button>
    )
}
