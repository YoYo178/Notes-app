import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom";

import AuthContext from "../../contexts/AuthProvider";

export const PublicRouteLayout = () => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();

    return (
        auth?.username ? (
            <Navigate to="/dashboard" state={{ from: location }} replace />
        ) : (
            <Outlet />
        )
    );
}
