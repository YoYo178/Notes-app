import { FC, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaRegEye } from 'react-icons/fa6';
import { IoKeyOutline, IoPersonOutline } from 'react-icons/io5';

import { LoginButton } from './LoginButton/LoginButton.tsx';
import { ButtonHandler } from './LoginModal.ts';

import './LoginModal.css';

export const LoginModal: FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const passwordField = useRef<HTMLInputElement>(null); // Only needed for toggling password visibility

    return (
        <form className="login-modal" onSubmit={(e) => e.preventDefault()}>
            <h2 className="login-title">Sign In</h2>

            { /* Username field */}
            <div className="text-field-container">
                <div className="text-field-icon-container">
                    <IoPersonOutline />
                </div>

                <input
                    type="text"
                    placeholder='Username'
                    id="username-field"
                    className="username-field"
                    autoComplete='username'
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            { /* Password field */}
            <div className="text-field-container">
                <div className="text-field-icon-container">
                    <IoKeyOutline />
                </div>

                <input
                    ref={passwordField}
                    type="password"
                    placeholder='Password'
                    id="password-field"
                    className="password-field"
                    autoComplete='current-password'
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="password-visibility-container">
                    <button className='toggle-password-visibility-button' onClick={() => ButtonHandler.togglePasswordVisibility(passwordField)}>
                        <FaRegEye />
                    </button>
                </div>
            </div>

            <Link to="/reset" className='forgot-password-button'>Forgot password?</Link>

            <LoginButton username={username} password={password} />

            <div className="register-container">
                <span className="register-text">Don't have an account?</span>
                <Link to="/register" className='register-button'>Register now</Link>
            </div>
        </form>
    );
};