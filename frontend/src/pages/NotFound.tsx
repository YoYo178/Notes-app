import { Link } from 'react-router-dom';
import './NotFound.css'; // if you're styling separately

export const NotFound = () => {
    return (
        <div className="nf-wrapper">
            <div className="nf-card">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/" className="nf-home-link">Back to Home</Link>
            </div>
        </div>
    );
};