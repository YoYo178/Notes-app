import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import { IoKeyOutline, IoPersonOutline } from 'react-icons/io5';
import { MdOutlinePassword } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa6';

import { useRecoverAccountMutation } from '../../hooks/network/auth/useRecoverAccountMutation.ts';
import { useVerifyCodeMutation } from '../../hooks/network/auth/useVerifyCodeMutation.ts';
import { useResetPasswordMutation } from '../../hooks/network/auth/useResetPasswordMutation.ts';

import { ResetAccountStages } from '../../types/modal.types.ts';
import { TMutation, ReactSetState } from '../../types/react.types.ts';

import { ButtonHandler, EventHandler } from './ResetPasswordModal.ts';

import './ResetPasswordModal.css';
import { useResendCodeMutation } from '../../hooks/network/auth/useResendCodeMutation.ts';
import { startCodeTimer } from '../../util/code.utils.ts';

function mutationCallbackHandler(
    mutation: TMutation<any>,
    setCurrentStage: ReactSetState<ResetAccountStages>,
    setErrorMessage: ReactSetState<string>,
    setSuccessMessage: ReactSetState<string>
) {
    if (mutation.isSuccess && mutation.data) {
        setCurrentStage((prev) => {
            if (prev === ResetAccountStages.REDIRECT)
                return prev;

            return prev + 1;
        })
    } else if (mutation.isError) {
        if (mutation.error?.message) {
            setSuccessMessage('');
            const { error: err } = mutation;

            if (err && axios.isAxiosError(err)) {
                const error = err as AxiosError<{ message: unknown }>;

                setErrorMessage(error.response?.data?.message as string || error.message || '');
                return;
            }

            const errorMessage = mutation.error?.message;
            setErrorMessage(errorMessage || '');

            console.error("An error occured while trying to register.", errorMessage);
        }
    }
}

export const ResetPasswordModal: FC = () => {
    const [currentStage, setCurrentStage] = useState<ResetAccountStages>(ResetAccountStages.FIND_ACCOUNT);

    const [userID, setUserID] = useState('');

    const [input, setInput] = useState('');
    const [email, setEmail] = useState('');
    const [OTP, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [resendTime, setResendTime] = useState(60);

    const [redirect, setRedirect] = useState<ReactNode | null>(null)
    const [buttonTitle, setButtonTitle] = useState('Find account');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [isHovering, setIsHovering] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const timerRef = useRef<number>(null);

    const recoverAccountMutation = useRecoverAccountMutation({});
    const verifyCodeMutation = useVerifyCodeMutation({});
    const resetPasswordMutation = useResetPasswordMutation({});
    const resendCodeMutation = useResendCodeMutation({});

    useEffect(() => {
        mutationCallbackHandler(recoverAccountMutation, setCurrentStage, setErrorMessage, setSuccessMessage);

        if (recoverAccountMutation.isSuccess && !recoverAccountMutation.isError) {
            setUserID(recoverAccountMutation.data.id);
            setEmail(recoverAccountMutation.data.email);
        }
    }, [recoverAccountMutation.isSuccess, recoverAccountMutation.isError])

    useEffect(() => {
        mutationCallbackHandler(verifyCodeMutation, setCurrentStage, setErrorMessage, setSuccessMessage);
    }, [verifyCodeMutation.isSuccess, verifyCodeMutation.isError])

    useEffect(() => {
        mutationCallbackHandler(resetPasswordMutation, setCurrentStage, setErrorMessage, setSuccessMessage);
    }, [resetPasswordMutation.isSuccess, resetPasswordMutation.isError])

    useEffect(() => {
        switch (currentStage) {
            case ResetAccountStages.VERIFY_ACCOUNT:
                setButtonTitle("Verify OTP");
                startCodeTimer(timerRef, setResendTime);
                break;
            case ResetAccountStages.SET_PASSWORD:
                setButtonTitle("Set password");
                break;
            case ResetAccountStages.REDIRECT:
                setSuccessMessage(`Your password has been reset successfully.\nRedirecting to sign in page...`)
                setTimeout(() => {
                    setRedirect(
                        <Navigate to='/login' />
                    )
                }, 1500)
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
                // Username/Email field
                <div className="fpm-field-container">
                    <div className="fpm-field-icon-container">
                        <IoPersonOutline />
                    </div>

                    <input
                        type="text"
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
                        <span className='fpm-email'>{email}</span>
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
                    <div className="fpm-resend-code-container">
                        <button
                            className="fpm-resend-code-button"
                            onMouseOver={() => setIsHovering(true)}
                            onMouseOut={() => setIsHovering(false)}
                            style={
                                isHovering ? {
                                    cursor: resendTime > 0 ? 'not-allowed' : 'pointer',
                                } : {}
                            }
                            onClick={() => resendTime < 1 && ButtonHandler.resendCodeOnClick(timerRef, setResendTime, resendCodeMutation, userID)}
                            disabled={resendTime > 0}
                        >
                            Resend Code{resendTime > 0 ? ` (${resendTime})` : ''}
                        </button>
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
                    onClick={async () => {
                        await ButtonHandler.continueButtonOnClick(
                            recoverAccountMutation,
                            verifyCodeMutation,
                            resetPasswordMutation,
                            successMessage, setSuccessMessage,
                            errorMessage, setErrorMessage,
                            currentStage,
                            input,
                            OTP,
                            newPassword,
                            confirmNewPassword,
                            userID
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