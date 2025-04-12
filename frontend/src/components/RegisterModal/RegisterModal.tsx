import axios, { AxiosError } from 'axios';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import { HiOutlineUserCircle } from 'react-icons/hi2';
import { IoAt, IoKeyOutline, IoPersonOutline } from 'react-icons/io5';
import { FaRegEye } from 'react-icons/fa6';

import { useRegisterMutation } from '../../hooks/network/auth/useRegisterMutation.ts';

import { RegisterStages } from '../../types/modal.types.ts';

import { ButtonHandler, EventHandler } from './RegisterModal.ts';

import './RegisterModal.css';
import { MdOutlinePassword } from 'react-icons/md';

export const RegisterModal: FC = () => {
    const [currentStage, setCurrentStage] = useState<RegisterStages>(RegisterStages.INPUT_DETAILS);
    const [buttonTitle, setButtonTitle] = useState('Register');

    const [redirect, setRedirect] = useState<ReactNode>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const [OTP, setOTP] = useState('')

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const registerMutation = useRegisterMutation({});
    const location = useLocation();

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (registerMutation.isSuccess) {
            setCurrentStage(RegisterStages.VERIFY_ACCOUNT);
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

    useEffect(() => {
        switch (currentStage) {
            case RegisterStages.INPUT_DETAILS:
                break;
            case RegisterStages.VERIFY_ACCOUNT:
                setButtonTitle("Verify Code");
                break;
            case RegisterStages.REDIRECT:
                setSuccessMessage(`Your account has been verified successfully\nRedirecting to sign in page...`)
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
        <form className="rm" onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => EventHandler.onKeyDown(e, buttonRef)}>
            <h2 className="rm-title">Register</h2>

            {currentStage === RegisterStages.INPUT_DETAILS && (
                <>
                    { /* Display name field */}
                    < div className="rm-display-name-container">
                        <div className="rm-field-container">
                            <div className="rm-field-icon-container">
                                <IoPersonOutline />
                            </div>

                            <input
                                type="text"
                                placeholder='First name'
                                id="first-name-field"
                                className="rm-field-first-name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="rm-field-container">
                            <div className="rm-field-icon-container">
                                <IoPersonOutline />
                            </div>

                            <input
                                type="text"
                                placeholder='Last name'
                                id="last-name-field"
                                className="rm-field-last-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    { /* Username field */}
                    <div className="rm-field-container">
                        <div className="rm-field-icon-container">
                            <HiOutlineUserCircle />
                        </div>

                        <input
                            type="text"
                            placeholder='Username'
                            id="username-field"
                            className="rm-field-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    { /* Email field */}
                    <div className="rm-field-container">
                        <div className="rm-field-icon-container">
                            <IoAt />
                        </div>

                        <input
                            type="email"
                            placeholder='Email'
                            id="email-field"
                            className="rm-field-email"
                            autoComplete='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    { /* Password field */}
                    <div className="rm-field-container">
                        <div className="rm-field-icon-container">
                            <IoKeyOutline />
                        </div>

                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder='Password'
                            id="password-field"
                            className="rm-field-password"
                            autoComplete='new-password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="rm-toggle-password-container">
                            <button className='rm-toggle-password-button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <FaRegEye />
                            </button>
                        </div>
                    </div>

                    { /* Confirm password field */}
                    <div className="rm-field-container">
                        <div className="rm-field-icon-container">
                            <IoKeyOutline />
                        </div>

                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder='Confirm Password'
                            id="confirm-password-field"
                            className="rm-field-confirm-password"
                            autoComplete='new-password-confirm'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </>
            )}

            {currentStage === RegisterStages.VERIFY_ACCOUNT && (
                <>
                    <div className="fpm-verification-text">
                        <span>We have sent a verification code to</span>
                        <span className='fpm-email'><u>{email}</u></span>
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
            )
            }

            <div className="rm-error" style={{ display: errorMessage.length ? "block" : "none" }}>{errorMessage}</div>
            <div className="rm-info" style={{ display: successMessage.length ? "block" : "none" }}>{successMessage}</div>

            {currentStage !== RegisterStages.REDIRECT && (
                <>
                    <button
                        ref={buttonRef}
                        className="register-button"
                        disabled={registerMutation.isPending}
                        onClick={async () => {
                            await ButtonHandler.continueButtonOnClick(
                                registerMutation,
                                successMessage, setSuccessMessage,
                                errorMessage, setErrorMessage,
                                currentStage, setCurrentStage,
                                { username, password, confirmPassword, email, displayName: `${firstName} ${lastName}` },
                                OTP
                            )
                        }}
                    >
                        {registerMutation.isPending ? 'Please wait...' : buttonTitle}
                    </button>

                    <div className="rm-existing-acc-container">
                        <span className="rm-existing-acc-text">Already have an account?</span>
                        <Link to="/login" className='rm-existing-acc-button' state={{ from: location }} replace>Sign-In</Link>
                    </div>
                </>
            )}
        </form>
    );
};