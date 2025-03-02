import { FC, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { RegisterFields } from '../../../types/AuthTypes';
import { useRegister } from '../../../hooks/auth/useRegister';
import { ButtonHandler } from './RegisterButton';

import './RegisterButton.css';

interface RegisterButtonProps {
    registerData: RegisterFields
}

export const RegisterButton: FC<RegisterButtonProps> = ({ registerData }) => {
    const registerMutation = useRegister();

    useEffect(() => {
        if (registerMutation.isSuccess) {
            console.log("REGISTRATION SUCCESS");
            if (registerMutation.data) {
                const data = registerMutation.data;
                console.log("DATA RECEIVED AFTER REGISTERING");
                console.log(data);
            }
        } else if (registerMutation.isError) {
            console.log("AN ERROR OCCURED WHILE REGISTERING")
            if (registerMutation.error?.message) {
                const errorMessage = registerMutation.error?.message;
                console.log("REGISTRATION ERROR MESSAGE")
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
        </button>
    )
}
