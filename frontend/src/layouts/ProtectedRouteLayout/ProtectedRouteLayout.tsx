import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom";

import AuthContext from "../../contexts/AuthProvider";

export const ProtectedRouteLayout = () => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();

    return (
        auth?.username ? (
            <Outlet />
        ) : (
            <Navigate to="/login" state={{ from: location }} replace />
        )
    );
}
