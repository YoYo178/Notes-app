import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthContext } from "../../contexts/AuthContext";

export const PublicRouteLayout = () => {
    const { auth } = useAuthContext();
    const location = useLocation();

    return (
        auth?.username ? (
            <Navigate to="/dashboard" state={{ from: location }} replace />
        ) : (
            <Outlet />
        )
    );
}
