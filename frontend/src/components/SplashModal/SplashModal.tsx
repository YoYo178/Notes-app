import { FC } from 'react';
import { Link } from 'react-router-dom';

import './SplashModal.css';

export const SplashModal: FC = () => {
    return (
        <form className="sm" onSubmit={(e) => e.preventDefault()}>
            <h2 className="sm-title">AI Notes</h2>

            <div className="sm-links-container">
                <Link to="/login" className="sm-login-button">Login</Link>
                <div className="sm-links-separator">
                    <div className="sm-links-separator-left"></div>
                    <span className="sm-separator-text">OR</span>
                    <div className="sm-links-separator-right"></div>
                </div>
                <Link to="/register" className="sm-register-button">Register</Link>
            </div>
        </form>
    );
};