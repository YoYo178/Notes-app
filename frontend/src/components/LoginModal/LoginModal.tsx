import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { FaRegEye } from 'react-icons/fa6';
import { IoKeyOutline, IoPersonOutline } from 'react-icons/io5';

import { useLoginMutation } from '../../hooks/network/auth/useLoginMutation.ts';

import { LoginButton } from './LoginButton/LoginButton.tsx';
import { ButtonHandler } from './LoginModal.ts';

import './LoginModal.css';

export const LoginModal: FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const location = useLocation();
    const loginMutation = useLoginMutation({ queryKey: ['auth'] });

    return (
        <form className="login-modal" onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => ButtonHandler.onKeyDown(e, username, password, loginMutation)}>
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
                    type="password"
                    placeholder='Password'
                    id="password-field"
                    className="password-field"
                    autoComplete='current-password'
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="password-visibility-container">
                    <button className='toggle-password-visibility-button' onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <FaRegEye />
                    </button>
                </div>
            </div>

            <Link to="/reset" className='forgot-password-button'>Forgot password?</Link>

            <div className="lm-error" style={{ display: errorMessage.length ? "block" : "none" }}>{errorMessage}</div>

            <LoginButton username={username} password={password} setErrorMessage={setErrorMessage} loginMutation={loginMutation} />

            <div className="register-container">
                <span className="register-text">Don't have an account?</span>
                <Link to="/register" className='login-modal-register-button' state={{ from: location }} replace>Register now</Link>
            </div>
        </form>
    );
};