import { FC, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { IoAt, IoKeyOutline, IoPersonOutline } from 'react-icons/io5';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { FaRegEye } from 'react-icons/fa6';

import { useRegisterMutation } from '../../hooks/network/auth/useRegisterMutation.ts';

import { RegisterButton } from './RegisterButton/RegisterButton.tsx';
import { ButtonHandler } from './RegisterModal.ts';

import './RegisterModal.css';

export const RegisterModal: FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const passwordField = useRef<HTMLInputElement>(null); // Only needed for toggling password visibility
    const confirmPasswordField = useRef<HTMLInputElement>(null); // Only needed for toggling password visibility

    const registerMutation = useRegisterMutation();
    const location = useLocation();

    return (
        <form className="rm" onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => {
            ButtonHandler.onKeyDown(e, { username, password, confirmPassword, email, displayName: `${firstName} ${lastName}` }, registerMutation)
        }
        }>
            <h2 className="rm-title">Register</h2>

            { /* Display name field */}
            <div className="rm-display-name-container">
                <div className="rm-field-container">
                    <div className="rm-field-icon-container">
                        <IoPersonOutline />
                    </div>

                    <input
                        type="text"
                        placeholder='First name'
                        id="first-name-field"
                        className="rm-field-first-name"
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
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            { /* Password field */}
            <div className="rm-field-container">
                <div className="rm-field-icon-container">
                    <IoKeyOutline />
                </div>

                <input
                    ref={passwordField}
                    type="password"
                    placeholder='Password'
                    id="password-field"
                    className="rm-field-password"
                    autoComplete='new-password'
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="rm-toggle-password-container">
                    <button className='rm-toggle-password-button' onClick={() => ButtonHandler.togglePasswordVisibility(passwordField, confirmPasswordField)}>
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
                    ref={confirmPasswordField}
                    type="password"
                    placeholder='Confirm Password'
                    id="confirm-password-field"
                    className="rm-field-confirm-password"
                    autoComplete='new-password-confirm'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <div className="rm-error" style={{ display: errorMessage.length ? "block" : "none" }}>{errorMessage}</div>
            <div className="rm-info" style={{ display: successMessage.length ? "block" : "none" }}>{successMessage}</div>

            <RegisterButton
                registerData={{ username, password, confirmPassword, email, displayName: `${firstName} ${lastName}` }}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
                registerMutation={registerMutation}
            />

            <div className="rm-existing-acc-container">
                <span className="rm-existing-acc-text">Already have an account?</span>
                <Link to="/login" className='rm-existing-acc-button' state={{ from: location }} replace>Sign-In</Link>
            </div>
        </form>
    );
};