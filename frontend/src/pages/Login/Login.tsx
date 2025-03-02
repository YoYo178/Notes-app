import { FC } from 'react'

import { LoginModal } from '../../components/LoginModal/LoginModal.tsx'

import './Login.css'

export const Login: FC = () => {
    return (
        <div className="login-form-container">
            <LoginModal />
        </div>
    )
}