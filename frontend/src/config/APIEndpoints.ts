import { Endpoints } from "../types/api.types";

const APIEndpoints: Endpoints = {

    /***** AUTHENTICATION *****/
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
    },

    /***** NOTE *****/
    GET_ALL_NOTES: {
        URL: "/api/notes",
        METHOD: "GET"
    },
    CREATE_NOTE: {
        URL: "/api/notes",
        METHOD: "POST"
    },
    UPDATE_NOTE: {
        URL: "/api/notes",
        METHOD: "PATCH"
    },
    DELETE_NOTE: {
        URL: "/api/notes",
        METHOD: "DELETE"
    },

    /***** USER *****/
    UPDATE_USER: {
        URL: "/api/users",
        METHOD: "PATCH"
    },
    DELETE_USER: {
        URL: "/api/users",
        METHOD: "DELETE"
    },
}

export default APIEndpoints;