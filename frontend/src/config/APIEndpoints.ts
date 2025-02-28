const APIEndpoints = {
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
    AUTH_QUERY: {
        URL: "/api/auth/",
        METHOD: "GET"
    }
}

export default APIEndpoints;