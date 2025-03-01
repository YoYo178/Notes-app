import { Endpoints } from "../types/APITypes";

const APIEndpoints: Endpoints = {
    LOGIN: {
        URL: "/api/auth/login",
        METHOD: "POST"
    },
    LOGOUT: {
        URL: "/api/auth/logout",
        METHOD: "POST"
    },
    REFRESH: {
        URL: "/api/auth/refresh",
        METHOD: "GET"
    },
    REGISTER: {
        URL: "/api/users",
        METHOD: "POST"
    },
    AUTH_QUERY: {
        URL: "/api/auth/",
        METHOD: "GET"
    }
}

export default APIEndpoints;