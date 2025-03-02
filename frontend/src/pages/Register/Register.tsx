import { FC } from 'react'

import { RegisterModal } from '../../components/RegisterModal/RegisterModal.tsx'

import './Register.css'

export const Register: FC = () => {
    return (
        <div className="register-form-container">
            <RegisterModal />
        </div>
    )
}