import axios, { AxiosError } from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactNode, useEffect, useState } from 'react';

import { RegisterFields } from '../../../types/auth.types';
import { ReactSetState, TMutation } from '../../../types/react.types';

import { ButtonHandler } from './RegisterButton';

import './RegisterButton.css';

interface RegisterButtonProps {
    registerData: RegisterFields;
    setErrorMessage: ReactSetState<string>;
    setSuccessMessage: ReactSetState<string>;
    registerMutation: TMutation<RegisterFields>
}

export const RegisterButton: FC<RegisterButtonProps> = ({ registerData, setErrorMessage, setSuccessMessage, registerMutation }) => {
    const [redirect, setRedirect] = useState<ReactNode | null>(null);

    const location = useLocation();

    useEffect(() => {
        if (registerMutation.isSuccess) {
            if (registerMutation.data) {
                setErrorMessage('');
                setSuccessMessage('You have been registered successfully! Redirecting to sign-in page...');

                const timeout = setTimeout(() => {
                    setRedirect(
                        <Navigate to="/login" state={{ from: location }} replace />
                    )
                }, 3000);

                return () => clearTimeout(timeout);
            }
        } else if (registerMutation.isError) {
            if (registerMutation.error?.message) {
                setSuccessMessage('');
                const { error: err } = registerMutation;

                if (err && axios.isAxiosError(err)) {
                    const error = err as AxiosError<{ message: unknown }>;

                    setErrorMessage(error.response?.data?.message as string);
                    return;
                }

                const errorMessage = registerMutation.error?.message;
                setErrorMessage(errorMessage);

                console.error("An error occured while trying to register.", errorMessage);
            }
        }

    }, [registerMutation.isSuccess, registerMutation.isError])

    return (
        <button
            className="register-button"
            onClick={async () => { await ButtonHandler.registerButtonOnClick(registerData, registerMutation) }
            }>
            Register
            {redirect}
        </button>
    )
}
