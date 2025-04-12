import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { IoKeyOutline, IoPersonOutline } from 'react-icons/io5';
import { MdOutlinePassword } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa6';

import { ResetAccountStages } from '../../types/modal.types.ts';

import { ButtonHandler, EventHandler } from './ResetPasswordModal.ts';

import './ResetPasswordModal.css';

export const ResetPasswordModal: FC = () => {
    const [currentStage, setCurrentStage] = useState<ResetAccountStages>(ResetAccountStages.FIND_ACCOUNT);

    const [input, setInput] = useState('');
    const [OTP, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [redirect, setRedirect] = useState<ReactNode | null>(null)
    const [buttonTitle, setButtonTitle] = useState('Find account');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        switch (currentStage) {
            case ResetAccountStages.FIND_ACCOUNT:
                break;
            case ResetAccountStages.VERIFY_ACCOUNT:
                setButtonTitle("Verify OTP");
                break;
            case ResetAccountStages.SET_PASSWORD:
                setButtonTitle("Set password");
                break;
            case ResetAccountStages.REDIRECT:
                setSuccessMessage(`Your password has been reset successfully\nRedirecting to sign in page...`)
                setTimeout(() => {
                    setRedirect(
                        <Navigate to='/login' />
                    )
                }, 1500)
                break;
            default:
                break;
        }
    }, [currentStage])

    if (redirect)
        return redirect;

    return (
        <form className="fpm" onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => {
            EventHandler.onKeyDown(e, buttonRef)
        }
        }>
            <h2 className="fpm-title">Reset Password</h2>

            {currentStage === ResetAccountStages.FIND_ACCOUNT && (
                // Display name field
                <div className="fpm-field-container">
                    <div className="fpm-field-icon-container">
                        <IoPersonOutline />
                    </div>

                    <input
                        type="email"
                        placeholder='Username / Email'
                        id="username-email-field"
                        className="fpm-field-username-email"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
            )}

            {currentStage === ResetAccountStages.VERIFY_ACCOUNT && (
                <>
                    <div className="fpm-verification-text">
                        <span>We have sent a verification code to</span>
                        <span className='fpm-email'><u>{input}</u></span>
                        <span>Enter the code below before it expires.</span>
                        <span>Please also make sure to check your spam inbox.</span>
                    </div>

                    {/* OTP Field */}
                    <div className="fpm-field-container">
                        <div className="fpm-field-icon-container">
                            <MdOutlinePassword />
                        </div>

                        <input
                            type="text"
                            placeholder='Enter verification code'
                            id="otp-field"
                            className="fpm-field-otp"
                            value={OTP}
                            onChange={(e) => setOTP(e.target.value)}
                            maxLength={6}
                        />
                    </div>
                </>
            )}

            {currentStage === ResetAccountStages.SET_PASSWORD && (
                <>
                    <div className="fpm-field-container">
                        <div className="fpm-field-icon-container">
                            <IoKeyOutline />
                        </div>

                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder='New password'
                            id="new-password-field"
                            className="fpm-field-new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <div className="rm-toggle-password-container">
                            <button className='rm-toggle-password-button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <FaRegEye />
                            </button>
                        </div>
                    </div>
                    <div className="fpm-field-container">
                        <div className="fpm-field-icon-container">
                            <IoKeyOutline />
                        </div>

                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder='Confirm new password'
                            id="confirm-new-password-field"
                            className="fpm-field-confirm-new-password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                </>
            )}

            <div className="fpm-error" style={{ display: errorMessage.length ? "block" : "none" }}>{errorMessage}</div>
            <div className="fpm-info" style={{ display: successMessage.length ? "block" : "none" }}>{successMessage}</div>

            {currentStage !== ResetAccountStages.REDIRECT && (
                <button
                    ref={buttonRef}
                    className="fpm-continue-button"
                    onClick={() => {
                        ButtonHandler.continueButtonOnClick(
                            successMessage, setSuccessMessage,
                            errorMessage, setErrorMessage,
                            currentStage, setCurrentStage,
                            input,
                            OTP,
                            newPassword,
                            confirmNewPassword,
                        )
                    }}
                >
                    {buttonTitle}
                </button>
            )
            }
        </form >
    );
};