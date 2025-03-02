import { FC, ReactNode, useEffect, useState } from 'react';

import { RegisterFields } from '../../../types/AuthTypes';
import { useRegister } from '../../../hooks/auth/useRegister';
import { ButtonHandler } from './RegisterButton';

import './RegisterButton.css';
import axios, { AxiosError } from 'axios';
import { Navigate, useLocation } from 'react-router-dom';

interface RegisterButtonProps {
    registerData: RegisterFields;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const RegisterButton: FC<RegisterButtonProps> = ({ registerData, setErrorMessage, setSuccessMessage }) => {
    const [redirect, setRedirect] = useState<ReactNode | null>(null);

    const registerMutation = useRegister();
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

                console.log("An error occured while trying to register.")
                console.log(errorMessage);
            }
        }

    }, [registerMutation.isSuccess, registerMutation.isError])

    return (
        <button
            className="login-button"
            onClick={async () => { await ButtonHandler.registerButtonOnClick(registerData, registerMutation) }
            }>
            Register
            {redirect}
        </button>
    )
}
