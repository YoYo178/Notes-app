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
    REGISTER: {
        URL: "/api/auth/register",
        METHOD: "POST"
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
    GET_LOGGED_IN_USER: {
        URL: "/api/users/me",
        METHOD: "GET"
    },
    UPDATE_USER: {
        URL: "/api/users",
        METHOD: "PATCH"
    },
    DELETE_USER: {
        URL: "/api/users",
        METHOD: "DELETE"
    },

    /***** FILES *****/
    GET_FILE_URL: {
        URL: "/api/files/getURL",
        METHOD: "GET"
    },
    GET_MULTIPLE_FILES_URL: {
        URL: "/api/files/getMultipleURL",
        METHOD: "POST"
    },
    GET_FILE_UPLOAD_URL: {
        URL: "/api/files/getUploadURL",
        METHOD: "POST"
    },
    DELETE_FILE: {
        URL: "/api/files/delete/:fileKey",
        METHOD: "DELETE"
    }
}

export default APIEndpoints;